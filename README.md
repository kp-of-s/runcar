# 자동차 전용도로 / 고속도로 지도

한국의 자동차 전용도로와 고속도로를 시각화하는 웹 애플리케이션입니다.

## 🚀 기능

- **지도 시각화**: 네이버 지도 API를 사용한 인터랙티브 지도
- **도로 표시**: 자동차전용도로(적색)와 고속도로(청색) 표시
- **시설 마커**: 톨게이트, 나들목, 휴게소 마커 표시
- **선택적 표시**: 각 카테고리별로 개별 또는 전체 선택/해제 가능

## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6), Bootstrap 5.3.3
- **지도**: 네이버 지도 API
- **배포**: Netlify (서버리스 함수)

## 📋 설치 및 실행

### 1. 저장소 클론
```bash
git clone <repository-url>
cd runcar
```

### 2. 로컬 개발 환경 설정

#### 네이버 지도 API 키 발급
1. [네이버 클라우드 플랫폼](https://www.ncloud.com/product/applicationService/maps)에서 계정 생성
2. Maps API 서비스 신청
3. API 키 발급

#### API 키 설정
1. `public/config.js` 파일을 열어서 `YOUR_NAVER_MAP_KEY_HERE`를 실제 API 키로 교체
```javascript
export const LOCAL_CONFIG = {
  NAVER_MAP_KEY: '실제_API_키_입력',
  DEBUG_MODE: true
};
```

### 3. 로컬 서버 실행
Live Server 또는 다른 로컬 서버를 사용하여 `public` 폴더를 서빙합니다.

```bash
# Live Server 사용 시
# VS Code에서 Live Server 확장 설치 후 index.html 우클릭 → "Open with Live Server"

# 또는 Python 사용
cd public
python -m http.server 8000
# http://localhost:8000 접속
```

## 🌐 Netlify 배포

### 1. 환경 변수 설정
Netlify 대시보드에서 환경 변수 설정:
- `NAVER_MAP_KEY`: 네이버 지도 API 키

### 2. 배포
1. GitHub 저장소와 연결
2. 빌드 설정:
   - Build command: (비어있음)
   - Publish directory: `public`
3. 배포 완료

## 📁 프로젝트 구조

```
runcar/
├── public/
│   ├── index.html          # 메인 HTML 파일
│   ├── main.js            # 앱 진입점
│   ├── config.js          # 로컬 개발 설정
│   ├── drawMap.js         # 지도 초기화
│   ├── drawWay.js         # 도로 그리기
│   ├── drawMarker.js      # 마커 관리
│   ├── getCoord.js        # 좌표 클릭 이벤트
│   ├── inputData.js       # 데이터 로드
│   ├── style.css          # 스타일
│   ├── marker/            # 마커 데이터 (CSV)
│   ├── road/              # 도로 데이터 (JSON)
│   └── resource/          # 이미지 리소스
├── functions/
│   └── naver-key.js       # Netlify 서버리스 함수
├── netlify.toml           # Netlify 설정
└── README.md
```

## 🔧 개발 가이드

### 모듈 구조
- 모든 JavaScript 파일은 ES6 모듈로 구성
- `main.js`에서 앱 초기화 및 모듈 통합
- 각 기능별로 독립적인 모듈로 분리

### 데이터 형식
- **마커 데이터**: CSV 형식 (시설명, 노선명, 유형, 노선방향, lat, lon)
- **도로 데이터**: JSON 형식 (도로명: [좌표배열])

## ⚠️ 주의사항

- API 키는 절대 공개 저장소에 커밋하지 마세요
- `config.js`는 `.gitignore`에 포함되어 있습니다
- 로컬 개발 시에는 `config.js`에서 API 키를 설정하세요
- Netlify 배포 시에는 환경 변수로 API 키를 관리하세요

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.
