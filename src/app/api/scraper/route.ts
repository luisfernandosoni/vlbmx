import { NextResponse } from 'next/server';
// import { auth } from '@/lib/auth'; // Uncomment when auth is ready

/**
 * Trigger a Scraping Job
 * This endpoint receives requests to scrape a specific stream URL.
 * It sits behind Better Auth and pushes messages to a Cloudflare Queue.
 */
export async function POST(req: Request) {
  try {
    // 1. Authenticate user/admin
    // const session = await auth.api.getSession({ headers: req.headers });
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await req.json();
    const { url, platform } = body;

    if (!url || !platform) {
      return NextResponse.json({ error: 'URL and platform are required' }, { status: 400 });
    }

    // 2. Dispatch to Cloudflare Queues
    // In OpenNext/Workers environment, process.env.SCRAPER_QUEUE will be bound.
    // For local development, we might use a direct fetch to the Hetzner node.
    const jobId = crypto.randomUUID();

    if (process.env.SCRAPER_QUEUE) {
      // @ts-expect-error - Cloudflare Workers typings
      await process.env.SCRAPER_QUEUE.send({
        jobId,
        url,
        platform,
        strategy: 'hetzner-playwright', // All scraping now happens here
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json({ success: true, jobId, message: 'Job queued successfully.' });
    } else {
      // Fallback for local testing or direct Hetzner API call
      console.warn('SCRAPER_QUEUE not bound. Simulating queue dispatch.');
      // Normally we would do:
      // await fetch('http://<HETZNER_IP>:3001/api/scrape', { ... })
      return NextResponse.json({ success: true, jobId, message: 'Job dispatched (simulated).' });
    }
  } catch (error: unknown) {
    console.error('API /scraper error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
