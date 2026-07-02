// @ts-nocheck
import { defineConfig } from 'astro/config';
import fs from 'node:fs';
import path from 'node:path';

import react from '@astrojs/react';
import tailwind from '@tailwindcss/vite';
import node from '@astrojs/node';

function getPort() {
    try {
        const envPath = path.join(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf-8');
            const match = envContent.match(/^PORT\s*=\s*(\d+)/m);
            if (match) {
                return parseInt(match[1], 10);
            }
        }
    } catch (e) {
        // ignore
    }
    // @ts-ignore
    return process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
}

function getApiUrl() {
    try {
        const envPath = path.join(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf-8');
            const match = envContent.match(/^BASE_URL_SPRINT_DASH_API\s*=\s*(.+)/m);
            if (match) {
                return match[1].trim().replace(/['"]/g, '');
            }
        }
    } catch (e) {
        // ignore
    }
    return 'http://localhost:3000';
}

// https://astro.build/config
export default defineConfig({
    output: 'server',
    adapter: node({
        mode: 'standalone'
    }),
    server: {
        host: '0.0.0.0',
        port: 3001,
    },
    integrations: [react()],
    vite: {
        plugins: [tailwind()],
        define: {
            'import.meta.env.BASE_URL_SPRINT_DASH_API': JSON.stringify(getApiUrl())
        }
    },
    devToolbar: {
        enabled: false
    }
});