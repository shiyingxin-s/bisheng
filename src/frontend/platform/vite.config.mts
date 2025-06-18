// vite.config.mts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createHtmlPlugin } from 'vite-plugin-html';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import svgr from "vite-plugin-svgr";

const app_env = { BASE_URL: '' };

export default defineConfig(() => {
  return {
    base: app_env.BASE_URL || '/',
    build: {
      outDir: "build",
      rollupOptions: {
        output: {
          manualChunks: {
            acebuilds: ['react-ace', 'ace-builds', 'react-syntax-highlighter', 'rehype-mathjax', 'react-markdown'],
            reactflow: ['@xyflow/react'],
            pdfjs: ['pdfjs-dist'],
            reactdrop: ['react-window', 'react-beautiful-dnd', 'react-dropzone']
          }
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    plugins: [
      react(),
      svgr(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            aceScriptSrc: `<script src="${process.env.NODE_ENV === 'production' ? app_env.BASE_URL : ''}/node_modules/ace-builds/src-min-noconflict/ace.js" type="text/javascript"></script>`,
            baseUrl: app_env.BASE_URL
          }
        }
      }),
      viteStaticCopy({
        targets: [
          {
            src: [
              'node_modules/ace-builds/src-min-noconflict/ace.js',
              'node_modules/ace-builds/src-min-noconflict/mode-json.js',
              'node_modules/ace-builds/src-min-noconflict/worker-json.js',
              'node_modules/ace-builds/src-min-noconflict/mode-yaml.js',
              'node_modules/ace-builds/src-min-noconflict/worker-yaml.js'
            ],
            dest: 'node_modules/ace-builds/src-min-noconflict/'
          },
          {
            src: 'node_modules/pdfjs-dist/build/pdf.worker.min.js',
            dest: './'
          }
        ]
      })
    ],
    define: {
      __APP_ENV__: JSON.stringify(app_env)
    },
    server: {
      host: '0.0.0.0',
      port: 3001,
      proxy: {
        // 只代理 /api/v1 开头的请求
        '/api/v1': {
          target: 'https://bisheng.dataelem.com',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path, // 保持原始路径
        }
      }
    }
  };
});