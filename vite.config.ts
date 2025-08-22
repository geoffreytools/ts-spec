/// <reference types="vitest/config" />

import { defineConfig } from 'vite';

export default defineConfig(() => ({
    test: {
        expect: { requireAssertions: true },
        coverage: {
            include: ['test/'],
            exclude: ['**/interface.ts', '**/*.d.ts'],
        }
    }
}));