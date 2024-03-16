import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {resolve} from 'node:path'
import * as packageJson from './package.json'
import libCss from 'vite-plugin-libcss';


export default defineConfig({
    plugins: [
        react(),
        libCss()
    ],
    css: {
        inline: true,
    },
    build: {
        lib: {
            entry: resolve('src', 'index.jsx'),
            name: "@nejadipour/react-modern-datepicker",
            fileName: (format) => `react-modern-datepicker.${format}.js`,
        },
        rollupOptions: {
            external: [...Object.keys(packageJson.peerDependencies)],
        },
    }
})
