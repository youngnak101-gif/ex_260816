# Proposal web

## Supabase 연결

1. Supabase에서 새 프로젝트를 만든 뒤 **SQL Editor**에서 [`supabase-schema.sql`](supabase-schema.sql)을 실행합니다.
2. Vercel 프로젝트의 **Settings → Environment Variables**에 아래 환경 변수를 추가합니다.
   - `SUPABASE_URL`: Supabase Dashboard **Connect**의 Project URL
   - `SUPABASE_ANON_KEY`: Supabase Dashboard **Connect**의 anon 또는 publishable key
3. Vercel에 재배포합니다. 브라우저는 `/api/proposal`만 호출하고, Vercel 함수가 환경 변수를 이용해 데이터를 저장합니다.

`service_role` 키는 모든 데이터 접근 권한이 있으므로 절대 이 프로젝트나 GitHub에 넣으면 안 됩니다. 현재 구현은 Vercel 서버에서 `anon`/publishable key를 사용하며, 키는 브라우저 번들에 포함되지 않습니다.

저장되는 필드는 신랑 이름, 신부 이름, 결혼식 날짜, 서비스 이용일, 두 날짜의 차이(일), 생성 시각입니다. RLS 정책은 익명 방문자의 **삽입만** 허용하며, 저장된 개인 데이터의 조회·수정·삭제는 허용하지 않습니다.

공개 웹사이트는 익명 삽입을 악용한 스팸 위험이 있으므로, 실제 공개 배포 전에는 Supabase Edge Function과 CAPTCHA 또는 rate limit을 추가하는 것을 권장합니다.
