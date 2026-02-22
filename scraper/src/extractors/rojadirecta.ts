import { Page } from 'playwright-extra';

export interface ScrapeResult {
  title: string;
  streams: string[];
  iframes: string[];
}

export async function extractRojaDirecta(page: Page): Promise<ScrapeResult> {
  const result: ScrapeResult = {
    title: '',
    streams: [],
    iframes: []
  };

  try {
    result.title = await page.title();
  } catch (e) {
    console.warn('[Extractor] Failed to get page title');
  }

  // Set up network interception to trap video streams dynamically loaded via JS
  const interceptedStreams = new Set<string>();
  
  page.on('request', request => {
    const url = request.url();
    if (url.includes('.m3u8') || url.includes('.mp4')) {
      interceptedStreams.add(url);
    }
  });

  // Extract all iframes natively found in DOM (RojaDirecta heavily uses nested iframes)
  const iframes = await page.evaluate(() => {
    const frames = Array.from(document.querySelectorAll('iframe'));
    return frames.map(f => f.src).filter(src => src && src.trim() !== '');
  });

  result.iframes = iframes;

  // Let the page settle to ensure media player network requests fire
  await page.waitForTimeout(5000);

  result.streams = Array.from(interceptedStreams);

  return result;
}
