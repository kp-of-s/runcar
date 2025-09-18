export async function handler(event, context) {
  // 민감한 API 키는 서버에서만 노출
  return {
    statusCode: 200,
    body: JSON.stringify({
      NAVER_MAP_KEY: process.env.NAVER_MAP_KEY
    })
  };
}
