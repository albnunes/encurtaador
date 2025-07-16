import { writable } from 'svelte/store';

export interface User {
    id: string;
    email: string;
    name: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}

function createAuthStore() {
    const { subscribe, set, update } = writable<AuthState>({
        user: null,
        token: null,
        isAuthenticated: false,
    });

    return {
        subscribe,
        login: (user: User, token: string) => {
            localStorage.setItem('auth_token', token);
            localStorage.setItem('user', JSON.stringify(user));

            set({ user, token, isAuthenticated: true });
        },
        logout: () => {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            set({ user: null, token: null, isAuthenticated: false });
        },
        initialize: () => {
            const token = localStorage.getItem('auth_token');
            const userStr = localStorage.getItem('user');

            if (token && userStr) {
                try {
                    const user = JSON.parse(userStr);
                    set({ user, token, isAuthenticated: true });
                } catch (error) {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user');
                    set({ user: null, token: null, isAuthenticated: false });
                }
            } else {
                set({ user: null, token: null, isAuthenticated: false });
            }
        },
    };
}

export const authStore = createAuthStore(); 