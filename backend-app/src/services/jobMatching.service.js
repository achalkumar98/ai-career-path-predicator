// services/jobMatching.service.js

const fetchJobs = async (keyword = '', location = '') => {
  let browser = null;

  try {
    const { default: puppeteer } = await import('puppeteer');
    const searchKeyword = keyword || 'DATASCIENCE';
    const searchLocation = location || 'Noida';
    const encodedKeyword = encodeURIComponent(searchKeyword);
    const encodedLocation = encodeURIComponent(searchLocation);

    const url = `https://www.linkedin.com/jobs/search?keywords=${encodedKeyword}&location=${encodedLocation}&distance=50&f_TPR=r86400&position=1&pageNum=0`;

    console.log(`Fetching jobs for: ${searchKeyword} in ${searchLocation}`);

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

    // Block images, fonts, and media — speeds up load significantly
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

    // Use domcontentloaded — much faster than networkidle2
    // networkidle2 waits for ALL network requests to stop (LinkedIn never stops firing analytics)
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    // Give JS a moment to render job cards after DOM loads
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Wait for job cards — silent fail so we still attempt extraction
    await page.waitForSelector('.job-search-card, .base-search-card', {
      timeout: 10000,
    }).catch(() => {});

    // Extract job data
    const jobs = await page.evaluate(() => {
      const jobCards = document.querySelectorAll('.job-search-card, .base-search-card');
      const results = [];

      jobCards.forEach((card) => {
        const title =
          card.querySelector(
            '.job-search-card__title, .base-search-card__title, .base-card__title'
          )?.textContent?.trim() || '';
        const company =
          card.querySelector(
            '.job-search-card__company-name, .base-search-card__subtitle, .base-card__subtitle'
          )?.textContent?.trim() || '';
        const location =
          card.querySelector(
            '.job-search-card__location, .base-search-card__location, .job-card-list__location'
          )?.textContent?.trim() || '';
        const linkEl = card.querySelector(
          'a.base-card__full-link, a[href*="/jobs/view/"]'
        );
        const link =
          linkEl?.href ||
          (linkEl?.getAttribute('href')
            ? `https://www.linkedin.com${linkEl.getAttribute('href')}`
            : '');
        const postedDate =
          card.querySelector(
            '.job-search-card__listdate, .job-search-card__listdate--new, .base-search-card__duration'
          )?.textContent?.trim() || 'Recently posted';

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

    // Sort: exact location match first
    const searchLocationLower = searchLocation.toLowerCase();
    const sortedJobs = jobs.sort((a, b) => {
      const aMatch = (a.location || '').toLowerCase().includes(searchLocationLower);
      const bMatch = (b.location || '').toLowerCase().includes(searchLocationLower);
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    });

    const formattedJobs = sortedJobs.map((job, index) => ({
      id: `job_${index + 1}`,
      title: job.title,
      company: job.company,
      location: job.location || searchLocation,
      description: `${job.title} position at ${job.company}`,
      postedDate: job.postedDate,
      url: job.link,
      applyLink: job.link,
      locationMatch: (job.location || '').toLowerCase().includes(searchLocationLower),
    }));

    return {
      success: true,
      jobs: formattedJobs,
      totalJobs: formattedJobs.length,
      searchCriteria: { keyword: searchKeyword, location: searchLocation },
      source: 'LinkedIn (via Puppeteer)',
    };

  } catch (error) {
    if (browser) await browser.close();
    console.error('Error fetching from LinkedIn:', error.message);
    throw new Error(`Failed to fetch jobs from LinkedIn: ${error.message}`);
  }
};

module.exports = { fetchJobs };