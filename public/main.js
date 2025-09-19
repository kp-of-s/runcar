import { initMap } from './drawMap.js';
import { initWays, selectWays, deselectWays } from './drawWay.js';
import { initMarkers, selectMarkers, deselectMarkers } from './drawMarker.js';
import { loadData } from './inputData.js';
import { LOCAL_CONFIG } from './config.js';
import { diagnoseApiConnection, testApiKey, testNaverMapApi } from './debug.js';

// 앱 초기화
async function initApp() {
  try {
    let naverKey;
    
    // 로컬 개발 환경인지 확인
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isLocal) {
      // 로컬 환경: config.js에서 API 키 가져오기
      naverKey = LOCAL_CONFIG.NAVER_MAP_KEY;
      
      // API 키 유효성 검사
      if (!testApiKey(naverKey)) {
        console.warn('로컬 환경에서 네이버 지도 API 키를 설정해주세요.');
        console.warn('config.js 파일에서 YOUR_NAVER_MAP_KEY_HERE를 실제 API 키로 교체하세요.');
        console.warn('네이버 클라우드 플랫폼에서 지도 API 키를 발급받으세요: https://www.ncloud.com/product/applicationService/maps');
        naverKey = '';
      } else {
        console.log('로컬 API 키 사용:', naverKey.substring(0, 8) + '...');
        
        // API 키 테스트
        try {
          await testNaverMapApi(naverKey);
          console.log('API 키 테스트 성공');
        } catch (testError) {
          console.error('API 키 테스트 실패:', testError);
          console.warn('API 키가 유효하지 않거나 사용량을 초과했을 수 있습니다.');
          naverKey = '';
        }
      }
      
      // 진단 정보 출력
      diagnoseApiConnection();
    } else {
      // Netlify 환경: 서버리스 함수 사용
      try {
        const res = await fetch('/.netlify/functions/naver-key');
        const data = await res.json();
        naverKey = data.NAVER_MAP_KEY;
      } catch (fetchError) {
        console.error('서버리스 함수에서 키를 가져오는데 실패했습니다:', fetchError);
        naverKey = '';
      }
    }

    // 네이버 지도 초기화
    const script = document.createElement('script');
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${naverKey}`;
    document.head.appendChild(script);

    script.onload = () => {
      console.log('네이버 지도 API 로드 성공');
      
      try {
        // 지도 초기화
        initMap();
        console.log('지도 초기화 완료');
        
        // 도로 데이터 로드
        initWays();
        console.log('도로 데이터 로드 완료');
        
        // 마커 데이터 로드
        initMarkers();
        console.log('마커 데이터 로드 완료');
        
        // 기타 데이터 로드
        loadData();
        console.log('기타 데이터 로드 완료');
        
        // 전역 함수 등록 (HTML에서 사용)
        window.selectWays = selectWays;
        window.deselectWays = deselectWays;
        window.selectMarkers = selectMarkers;
        window.deselectMarkers = deselectMarkers;
        
        console.log('앱 초기화 완료');
      } catch (initError) {
        console.error('앱 초기화 중 오류 발생:', initError);
      }
    };

    script.onerror = (error) => {
      console.error('네이버 지도 API 로드에 실패했습니다:', error);
      console.error('API 키를 확인해주세요:', naverKey ? '설정됨' : '설정되지 않음');
      console.error('API 키 형식이 올바른지 확인해주세요 (예: abc123def456)');
    };
  } catch (error) {
    console.error('앱 초기화 중 오류 발생:', error);
  }
}

// DOM이 로드된 후 앱 초기화
document.addEventListener('DOMContentLoaded', initApp);
