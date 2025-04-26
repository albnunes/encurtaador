import { nanoid } from 'nanoid';
import QRCode from 'qrcode';

export const onRequestPost = async ({ request, env }: { request: Request; env: any }) => {
    try {
        const { url, generateQr } = await request.json();

        if (!url) {
            return new Response(JSON.stringify({ error: 'URL is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        // Validate URL
        try {
            new URL(url);
        } catch {
            return new Response(JSON.stringify({ error: 'Invalid URL' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        // Generate a short ID using nanoid
        const shortId = nanoid(6); // 6 characters long

        // Store in KV
        await env.encurtaador.put(shortId, url);

        // Return the short URL
        const shortUrl = `${new URL(request.url).origin}/${shortId}`;

        let qrCodeDataUrl = "";
        if (generateQr) {
            qrCodeDataUrl = await QRCode.toString(shortUrl);
        }

        return new Response(
            JSON.stringify({ shortUrl, qrCodeDataUrl }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error shortening URL:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
};
