import type { RequestEvent } from '@sveltejs/kit';

export interface Platform {
    env: {
        URLS: {
            get(key: string): Promise<string | null>;
        };
    };
}

export type RequestHandler = (event: RequestEvent & { platform: Platform }) => Promise<Response>; 