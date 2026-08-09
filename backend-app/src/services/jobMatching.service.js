// services/jobMatching.service.js

// ─── LinkedIn f_TPR values ────────────────────────────────────────────────────
// r86400  = last 24 hours
// r259200 = last 3 days
// r604800 = last 7 days
const RECENCY_TO_TPR = {
  '1d':  'r86400',
  '3d':  'r259200',
  '7d':  'r604800',
  '14d': 'r1209600',
  '30d': 'r2592000',
  'all': '',          // no f_TPR param → all time
};

// ─── Parse LinkedIn relative date string → approximate Date ──────────────────
function parsePostedDate(raw) {
  const now   = new Date();
  const lower = (raw || '').toLowerCase().trim();

  if (!lower || lower === 'recently posted' || lower === 'just now' || lower === 'today')
    return now;

  const num = parseInt(lower.match(/\d+/)?.[0] ?? '0', 10);

  if (lower.includes('minute') || lower.includes('hour'))  return now;
  if (lower.includes('day'))   { const d = new Date(now); d.setDate(d.getDate() - num); return d; }
  if (lower.includes('week'))  { const d = new Date(now); d.setDate(d.getDate() - num * 7); return d; }
  if (lower.includes('month')) { const d = new Date(now); d.setMonth(d.getMonth() - num); return d; }
  if (lower.includes('year'))  { const d = new Date(now); d.setFullYear(d.getFullYear() - num); return d; }
  return now;
}

// ─── Strip time component from a Date ────────────────────────────────────────
function stripTime(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// ─── Main fetch function ─────────────────────────────────────────────────────
const fetchJobs = async (keyword = '', location = '', filters = {}) => {
  let browser = null;

  try {
    const { default: puppeteer } = await import('puppeteer');

    const searchKeyword  = keyword  || 'DATASCIENCE';
    const searchLocation = location || 'Noida';
    const encodedKeyword  = encodeURIComponent(searchKeyword);
    const encodedLocation = encodeURIComponent(searchLocation);

    // Map recency to LinkedIn time filter param
    const recency = filters.recency || 'all';
    const tpr     = RECENCY_TO_TPR[recency] || '';
    const tprParam = tpr ? `&f_TPR=${tpr}` : '';

    const url = `https://www.linkedin.com/jobs/search?keywords=${encodedKeyword}&location=${encodedLocation}&distance=50${tprParam}&position=1&pageNum=0`;

    console.log(`Fetching jobs | keyword="${searchKeyword}" location="${searchLocation}" recency="${recency}" tpr="${tpr || 'all-time'}"`);

    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-blink-features=AutomationControlled',
        '--disable-extensions',
        '--disable-gpu',
      ],
    });

    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const type = req.resourceType();
      if (['image', 'media', 'font', 'stylesheet'].includes(type)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    );

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await page.waitForSelector('.job-search-card, .base-search-card', { timeout: 10000 }).catch(() => {});

    const jobs = await page.evaluate(() => {
      const jobCards = document.querySelectorAll('.job-search-card, .base-search-card');
      const results  = [];

      jobCards.forEach((card) => {
        const title =
          card.querySelector('.job-search-card__title, .base-search-card__title, .base-card__title')
            ?.textContent?.trim() || '';
        const company =
          card.querySelector('.job-search-card__company-name, .base-search-card__subtitle, .base-card__subtitle')
            ?.textContent?.trim() || '';
        const location =
          card.querySelector('.job-search-card__location, .base-search-card__location, .job-card-list__location')
            ?.textContent?.trim() || '';
        const linkEl = card.querySelector('a.base-card__full-link, a[href*="/jobs/view/"]');
        const link =
          linkEl?.href ||
          (linkEl?.getAttribute('href')
            ? `https://www.linkedin.com${linkEl.getAttribute('href')}`
            : '');
        const postedDate =
          card.querySelector('.job-search-card__listdate, .job-search-card__listdate--new, .base-search-card__duration')
            ?.textContent?.trim() || 'Recently posted';

        if (title && company) {
          results.push({ title, company, location, postedDate, link });
        }
      });

      return results;
    });

    await browser.close();
    browser = null;

    if (jobs.length === 0) {
      throw new Error('No jobs found. LinkedIn may have changed their HTML structure or blocked the request.');
    }

    // ── Sort: exact location match first ────────────────────────────────────
    const searchLocationLower = searchLocation.toLowerCase();
    const sortedJobs = jobs.sort((a, b) => {
      const aMatch = (a.location || '').toLowerCase().includes(searchLocationLower);
      const bMatch = (b.location || '').toLowerCase().includes(searchLocationLower);
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    });

    // ── Format jobs ──────────────────────────────────────────────────────────
    let formattedJobs = sortedJobs.map((job, index) => ({
      id: `job_${index + 1}`,
      title:         job.title,
      company:       job.company,
      location:      job.location || searchLocation,
      description:   `${job.title} position at ${job.company}`,
      postedDate:    job.postedDate,
      url:           job.link,
      applyLink:     job.link,
      locationMatch: (job.location || '').toLowerCase().includes(searchLocationLower),
    }));

    // ── Post-scrape date-range filter (custom dateFrom / dateTo) ─────────────
    const { dateFrom, dateTo } = filters;

    if (dateFrom || dateTo) {
      const from = dateFrom ? stripTime(new Date(dateFrom)) : null;
      // dateTo is inclusive — extend to end of that day
      const to   = dateTo   ? new Date(stripTime(new Date(dateTo)).getTime() + 86399999) : null;

      formattedJobs = formattedJobs.filter((job) => {
        const posted = parsePostedDate(job.postedDate);
        if (from && posted < from) return false;
        if (to   && posted > to)   return false;
        return true;
      });

      console.log(`Date-range filter applied [${dateFrom || '—'} → ${dateTo || 'today'}]: ${formattedJobs.length} jobs remaining`);
    }

    return {
      success: true,
      jobs:          formattedJobs,
      totalJobs:     formattedJobs.length,
      searchCriteria: {
        keyword:  searchKeyword,
        location: searchLocation,
        recency,
        dateFrom: dateFrom || null,
        dateTo:   dateTo   || null,
      },
      source: 'LinkedIn (via Puppeteer)',
    };

  } catch (error) {
    if (browser) await browser.close();
    console.error('Error fetching from LinkedIn:', error.message);
    throw new Error(`Failed to fetch jobs from LinkedIn: ${error.message}`);
  }
};

module.exports = { fetchJobs };
