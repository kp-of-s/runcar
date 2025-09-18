"use strict";

let nmap;

export function initMap() {
	nmap = new naver.maps.Map('map', {
		useStyleMap: true,
		logoControl: false,
		mapDataControl: false,
		mapTypeControl: true,
		zoomControl: true,
		zoomControlOptions: { position: naver.maps.Position.RIGHT_CENTER },
		zoom: 7
	});

	nmap.setCenter(new naver.maps.LatLng(36.556058, 127.927138));
}

// 다른 모듈에서 nmap에 접근할 수 있도록 export
export function getMap() {
	return nmap;
}
