// API 연결 문제 진단 도구
export function diagnoseApiConnection() {
  console.log('=== API 연결 진단 시작 ===');
  
  // 1. 현재 URL 확인
  console.log('현재 URL:', window.location.href);
  console.log('호스트명:', window.location.hostname);
  
  // 2. 네이버 지도 API 스크립트 확인
  const naverScript = document.querySelector('script[src*="openapi.map.naver.com"]');
  if (naverScript) {
    console.log('네이버 지도 API 스크립트 발견:', naverScript.src);
  } else {
    console.log('네이버 지도 API 스크립트를 찾을 수 없습니다.');
  }
  
  // 3. naver 객체 확인
  if (typeof naver !== 'undefined') {
    console.log('naver 객체 사용 가능:', !!naver);
    console.log('naver.maps 사용 가능:', !!naver.maps);
  } else {
    console.log('naver 객체를 찾을 수 없습니다.');
  }
  
  // 4. 네트워크 상태 확인
  if (navigator.onLine) {
    console.log('온라인 상태입니다.');
  } else {
    console.log('오프라인 상태입니다.');
  }
  
  // 5. CORS 에러 확인
  window.addEventListener('error', (e) => {
    if (e.message.includes('CORS') || e.message.includes('cross-origin')) {
      console.error('CORS 에러 감지:', e.message);
    }
  });
  
  console.log('=== API 연결 진단 완료 ===');
}

// API 키 테스트 함수
export function testApiKey(apiKey) {
  if (!apiKey || apiKey === 'YOUR_NAVER_MAP_KEY_HERE') {
    console.error('API 키가 설정되지 않았습니다.');
    return false;
  }
  
  if (apiKey.length < 10) {
    console.error('API 키가 너무 짧습니다.');
    return false;
  }
  
  // API 키 형식 검증 (간단한 체크)
  if (!/^[a-zA-Z0-9]+$/.test(apiKey)) {
    console.error('API 키에 잘못된 문자가 포함되어 있습니다.');
    return false;
  }
  
  console.log('API 키 형식이 올바릅니다.');
  return true;
}

// 네이버 지도 API 로드 테스트
export function testNaverMapApi(apiKey) {
  return new Promise((resolve, reject) => {
    const testScript = document.createElement('script');
    testScript.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${apiKey}`;
    
    testScript.onload = () => {
      console.log('네이버 지도 API 로드 테스트 성공');
      document.head.removeChild(testScript);
      resolve(true);
    };
    
    testScript.onerror = (error) => {
      console.error('네이버 지도 API 로드 테스트 실패:', error);
      document.head.removeChild(testScript);
      reject(error);
    };
    
    document.head.appendChild(testScript);
  });
}
