import { json } from '@sveltejs/kit';
import type { RequestHandler, Platform } from './types';
import { nanoid } from 'nanoid';

export const POST: RequestHandler = async ({ request, platform }) => {
    try {
        const { url } = await request.json();

        if (!url) {
            return json({ error: 'URL is required' }, { status: 400 });
        }

        // Validate URL
        try {
            new URL(url);
        } catch {
            return json({ error: 'Invalid URL' }, { status: 400 });
        }

        // Generate a short ID using nanoid
        const shortId = nanoid(6); // 6 characters long

        // Store in KV
        await platform.env.URLS.put(shortId, url);

        // Return the short URL
        const shortUrl = `${request.url.split('/api')[0]}/${shortId}`;

        return json({ shortUrl });
    } catch (error) {
        console.error('Error shortening URL:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
}; 