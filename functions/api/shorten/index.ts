import { nanoid } from 'nanoid';
import QRCode from 'qrcode';
import { createHash } from 'node:crypto';

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


        const hash = createHash('sha256').update(url).digest('base64url');
        const shortId = hash.slice(0, 8); // 8 caracteres, pode ajustar conforme necessário


        const existingUrl = await env.encurtaador.get(shortId);

        if (existingUrl && existingUrl !== url) {

            return new Response(JSON.stringify({ error: 'Hash collision detected' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }


        if (!existingUrl) {
            await env.encurtaador.put(shortId, url);
        }


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
