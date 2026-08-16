const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

function isValidDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function getSeoulDate() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.filter(({ type }) => type !== 'literal').map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ message: 'POST 요청만 허용됩니다.' });
  }
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return response.status(500).json({ message: '서버 환경 변수가 설정되지 않았습니다.' });
  }

  const { groomName, brideName, weddingDate } = request.body ?? {};
  if (typeof groomName !== 'string' || typeof brideName !== 'string' || !isValidDate(weddingDate)) {
    return response.status(400).json({ message: '입력한 정보를 다시 확인해주세요.' });
  }
  const groom = groomName.trim();
  const bride = brideName.trim();
  if (!groom || groom.length > 12 || !bride || bride.length > 12) {
    return response.status(400).json({ message: '이름은 1~12자로 입력해주세요.' });
  }

  try {
    const supabaseResponse = await fetch(`${SUPABASE_URL}/rest/v1/proposal_records`, {
      method: 'POST',
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ groom_name: groom, bride_name: bride, wedding_date: weddingDate, service_used_on: getSeoulDate() }),
    });
    if (!supabaseResponse.ok) {
      console.error('Supabase insert failed:', await supabaseResponse.text());
      return response.status(502).json({ message: '기록을 저장하지 못했습니다.' });
    }
    return response.status(201).json({ ok: true });
  } catch (error) {
    console.error('Proposal API failed:', error);
    return response.status(500).json({ message: '서버 연결에 문제가 생겼습니다.' });
  }
}
