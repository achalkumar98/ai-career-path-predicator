// services/jobMatching.service.js
const puppeteer = require('puppeteer');

const fetchJobs = async (keyword = '', location = '') => {
  let browser = null;
  
  try {
    const searchKeyword = keyword || 'DATASCIENCE';
    const searchLocation = location || 'Noida';
    const encodedKeyword = encodeURIComponent(searchKeyword);
    const encodedLocation = encodeURIComponent(searchLocation);
    
    const url = `https://www.linkedin.com/jobs/search?keywords=${encodedKeyword}&location=${encodedLocation}&geoId=104869687&distance=50&f_TPR=r86400&activeFilter=f_TPR&position=1&pageNum=0`;
    
    console.log(`Fetching jobs for: ${searchKeyword} in ${searchLocation}`);
    
    // Launch browser
    browser = await puppeteer.launch({
      headless: true, // Set to false to see the browser
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled'
      ]
    });
    
    const page = await browser.newPage();
    
    // Set user agent to look like a real browser
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Navigate to LinkedIn
    await page.goto(url, { 
      waitUntil: 'networkidle2', 
      timeout: 30000 
    });
    
    // Wait for jobs to load
    await page.waitForSelector('.job-search-card, .base-search-card', { 
      timeout: 15000 
    }).catch(() => {});
    
    // Extract job data
    const jobs = await page.evaluate(() => {
      const jobCards = document.querySelectorAll('.job-search-card, .base-search-card');
      const results = [];
      
      jobCards.forEach(card => {
        const title = card.querySelector('.job-search-card__title, .base-search-card__title, .job-card-list__title, .base-card__title')?.textContent?.trim() || '';
        const company = card.querySelector('.job-search-card__company-name, .base-search-card__subtitle, .job-card-container__company-name, .base-card__subtitle')?.textContent?.trim() || '';
        const location = card.querySelector('.job-search-card__location, .base-search-card__location, .job-card-container__company-location, .job-card-list__location')?.textContent?.trim() || '';
        const linkEl = card.querySelector('a.job-card-list__title, a.base-card__full-link, a.job-card-container__link, a.job-search-card__title, a.base-search-card__title, a[href*="/jobs/view/"]');
        const link = linkEl?.href || linkEl?.getAttribute('href') || '';
        const postedDate = card.querySelector('.job-search-card__listdate, .job-search-card__listdate--new, .jobs-unified-top-card__posted-date, .base-search-card__duration')?.textContent?.trim() || 'Recently posted';
        
        if (title && company) {
          results.push({
            title,
            company,
            location,
            postedDate,
            link: link && link.startsWith('http') ? link : link ? `https://www.linkedin.com${link}` : ''
          });
        }
      });
      
      return results;
    });
    
    await browser.close();
    
    if (jobs.length === 0) {
      throw new Error('No jobs found. LinkedIn may have changed their HTML structure.');
    }
    
    // Format jobs
    const formattedJobs = jobs.map((job, index) => ({
      id: `job_${index + 1}`,
      title: job.title,
      company: job.company,
      location: job.location || searchLocation,
      description: `${job.title} position at ${job.company}`,
      postedDate: job.postedDate,
      url: job.link,
      applyLink: job.link
    }));

    return {
      success: true,
      jobs: formattedJobs,
      totalJobs: formattedJobs.length,
      searchCriteria: {
        keyword: searchKeyword,
        location: searchLocation
      },
      source: 'LinkedIn (via Puppeteer)'
    };

  } catch (error) {
    if (browser) await browser.close();
    console.error('Error fetching from LinkedIn:', error.message);
    throw new Error(`Failed to fetch jobs from LinkedIn: ${error.message}`);
  }
};

module.exports = {
  fetchJobs,
};