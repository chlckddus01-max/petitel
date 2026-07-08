import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
      // 카카오 로그인 진입/콜백도 백엔드로 프록시 — 프론트 코드에서 절대경로(localhost:8080)를
      // 하드코딩하지 않아도 되고, 배포 환경(vercel.json의 rewrites)과 동작 방식이 동일해진다.
      '/oauth2': 'http://localhost:8080',
      '/login/oauth2': 'http://localhost:8080',
    },
  },
})