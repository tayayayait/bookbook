const buildUrl = (query, display, start) => {
  const params = new URLSearchParams({
    query,
    display: String(display),
    start: String(start)
  });
  return `https://openapi.naver.com/v1/search/book.json?${params.toString()}`;
};

export const handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { Allow: 'GET' },
      body: 'Method Not Allowed'
    };
  }

  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return {
      statusCode: 500,
      body: 'Missing NAVER credentials'
    };
  }

  const query = event.queryStringParameters?.query?.trim();
  if (!query) {
    return {
      statusCode: 400,
      body: 'Missing query'
    };
  }

  const display = Number(event.queryStringParameters?.display ?? 10) || 10;
  const start = Number(event.queryStringParameters?.start ?? 1) || 1;
  const url = buildUrl(query, display, start);

  try {
    const response = await fetch(url, {
      headers: {
        'X-Naver-Client-Id': clientId,
        'X-Naver-Client-Secret': clientSecret
      }
    });

    const body = await response.text();
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        'Cache-Control': 'public, max-age=60'
      },
      body
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: 'Naver proxy error'
    };
  }
};
