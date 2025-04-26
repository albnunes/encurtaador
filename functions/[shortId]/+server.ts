import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './types';

export const GET: RequestHandler = async ({ params, platform }) => {

    const { shortId } = params;

    // Get the original URL from KV
    const originalUrl = await platform.env.URLS.get(shortId);

    if (!originalUrl) {
        return new Response('URL not found', { status: 404 });
    }

    // Redirect to the original URL
    throw redirect(302, originalUrl);
}; 