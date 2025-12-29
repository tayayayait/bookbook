import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const naverClientId = env.NAVER_CLIENT_ID;
    const naverClientSecret = env.NAVER_CLIENT_SECRET;
    const naverProxy = naverClientId && naverClientSecret ? {
      '/naver': {
        target: 'https://openapi.naver.com',
        changeOrigin: true,
        rewrite: (pathStr: string) => pathStr.replace(/^\/naver/, ''),
        headers: {
          'X-Naver-Client-Id': naverClientId,
          'X-Naver-Client-Secret': naverClientSecret
        }
      }
    } : undefined;
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: naverProxy,
        allowedHosts: ['disclose-thereby-rather-anonymous.trycloudflare.com']
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
