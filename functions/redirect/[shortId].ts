export async function onRequestGet({ params, env }: { params: { shortId: string }; env: any }) {
    const { shortId } = params;

    // Obter a URL original do KV
    const originalUrl = await env.encurtaador.get(shortId);

    if (!originalUrl) {
        return new Response('URL not found', { status: 404 });
    }

    // Redirecionar para a URL original
    return Response.redirect(originalUrl, 302);
}
