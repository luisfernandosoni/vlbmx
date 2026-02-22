import express, { Request, Response, NextFunction } from 'express';
import { chromium } from 'playwright-extra';
import { Browser, BrowserContext, Page } from 'playwright';
import stealth from 'puppeteer-extra-plugin-stealth';
import dotenv from 'dotenv';

dotenv.config();

// Add stealth plugin to Playwright to bypass Cloudflare
chromium.use(stealth());

const app = express();
app.use(express.json());

// Require API key via middleware
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];
  const expectedKey = process.env.API_KEY;

  if (!expectedKey) {
    console.error('API_KEY environment variable is not configured');
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  if (!apiKey || apiKey !== expectedKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
};

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

interface ScrapePayload {
  url: string;
}

app.post('/api/scrape', requireAuth, async (req: Request, res: Response) => {
  const { url } = req.body as ScrapePayload;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  let browser: Browser | null = null;
  
  try {
    // Launch browser optimized for container execution
    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-default-browser-check',
        '--ignore-certificate-errors',
      ],
      // Required to work via residential proxy in production
      // proxy: { server: process.env.PROXY_URL }
    });

    const context: BrowserContext = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
      hasTouch: false,
      locale: 'en-US',
      timezoneId: 'America/New_York'
    });

    const page: Page = await context.newPage();

    // Mask webdriver presence to bypass Cloudflare
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });
    });

    console.log(`[Scraper] Navigating to: ${url}`);
    
    // Cloudflare bypassing requires networkidle or domcontentloaded and a slight delay
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Simulate some human-like behavior
    await page.mouse.move(100, 100);
    await page.waitForTimeout(2000); // 2 second pause to let JS / anti-bots settle

    // In the future: Add strategy-based extraction based on URL
    const extractionResult = { data: 'Extraction logic pending for premium platforms' };

    // Clean up
    await context.close();
    await browser.close();

    return res.json({ 
      success: true, 
      url, 
      ...extractionResult
    });

  } catch (error: any) {
    console.error(`[Scraper] Error scraping ${url}:`, error.message);
    
    if (browser) {
      await browser.close().catch(console.error);
    }

    return res.status(500).json({ error: 'Scraping failed', details: error.message });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`VLBMX Scraper Service running on port ${PORT}`);
  console.log(`Protected by API Key: ${process.env.API_KEY ? 'YES' : 'NO'}`);
});
