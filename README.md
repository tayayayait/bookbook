# Ondo — Book Temperature

“지금 읽히고 있는가”를 보여주는 기록 기반 온도 서비스(UI MVP).

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set Naver Book API keys in `.env.local`:
   `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET`
3. Run the app:
   `npm run dev`

## Build & Preview

1. Build:
   `npm run build`
2. Preview:
   `npm run preview`

## Notes

- UI는 Tailwind CDN 설정을 사용합니다(`index.html`).
- Naver Book API 키가 없으면 내부 더미 데이터로 fallback 됩니다.
- Naver Book API는 개발 서버 프록시(`/naver`)를 통해 호출됩니다. 운영 환경에서는 Supabase Edge Functions 등으로 프록시가 필요합니다.
