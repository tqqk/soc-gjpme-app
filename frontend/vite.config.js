import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { resolve } from 'path';

export default defineConfig({
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: 'public/wordlists/*',
                    dest: 'wordlists'
                }
                // {
                //     src: 'public/js/*',
                //     dest: 'js'
                // }
            ]
        })
    ],
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                index: resolve(__dirname, 'index.html'), // Main HTML file
                kviz: resolve(__dirname, 'kviz.html'), // Kviz HTML file
                tipy: resolve(__dirname, 'generator.html')  // Tipy HTML file
            }
        }
    },
    server: {
        port: 3000,
        open: true // Automatically open the browser
    }
});
