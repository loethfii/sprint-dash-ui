// @ts-nocheck
import { defineConfig } from 'astro/config';
import fs from 'node:fs';
import path from 'node:path';

import react from '@astrojs/react';
import tailwind from '@tailwindcss/vite';

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

// https://astro.build/config
export default defineConfig({
    server: {
        port: getPort()
    },

    integrations: [react()],
    vite: {
        plugins: [tailwind()]
    },
    devToolbar: {
        enabled: false
    }
});