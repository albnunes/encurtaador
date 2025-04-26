import type { RequestEvent } from '@sveltejs/kit';

export interface Platform {
    env: {
        URLS: {
            put(key: string, value: string): Promise<void>;
            get(key: string): Promise<string | null>;
        };
    };
}

export type RequestHandler = (event: RequestEvent & { platform: Platform }) => Promise<Response>; 