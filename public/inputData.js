import { initWays } from './drawWay.js';
import { initMarkers } from './drawMarker.js';
import { initCoordClick } from './getCoord.js';

export function loadData() {
    // 도로 데이터 로드
    initWays();
    
    // 마커 데이터 로드
    initMarkers();
    
    // 좌표 클릭 이벤트 초기화
    initCoordClick();
}