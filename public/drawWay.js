'use strict';

import { getMap } from './drawMap.js';

let ways = {};
let wayinfowindow;
let nmap;

const motorwayClass = 'mw';
const highwayClass = 'hw';

export function initWays() {
    nmap = getMap();
    wayinfowindow = new naver.maps.InfoWindow({
        content: ''
    });

    const params = [
        ['road/Motorways', '#FF0000', true, motorwayClass, document.getElementById("motorways"), 'solid', 3],
        ['road/highway', '#0000FF', true, highwayClass, document.getElementById("highway"), 'solid', 3]
    ];

    for (const p of params) {
        const [wayType, clor, init_status, clss, part, strokestyle, strokeweight] = p;

        fetch(wayType + '.json')
            .then(res => res.json())
            .then(jso => {
                for (let wayName in jso) {
                    const wayNameMangle = wayName + clss;

                    const linestr_coord = jso[wayName];
                    const linestr_LatLng = linestr_coord.map(
                        x => new naver.maps.LatLng(x[1], x[0])
                    );

                    const polline = new naver.maps.Polyline({
                        path: linestr_LatLng,
                        strokeColor: clor,
                        strokeStyle: strokestyle,
                        strokeLineCap: 'round',
                        strokeLineJoin: 'round',
                        strokeWeight: strokeweight,
                        clickable: true
                    });

                    // ways에 저장
                    ways[wayNameMangle] = {
                        "type": wayType,
                        "overlays": [polline]
                    };

                    // 마우스 이벤트
                    naver.maps.Event.addListener(polline, 'mouseover', e => {
                        if (!polline.getMap()) return; // 지도에 없으면 무시
                        polline.setOptions({
                            strokeWeight: strokeweight,
                            strokeColor: 'yellow'
                        });
                        wayinfowindow.setOptions({
                            position: e.coord,
                            content: wayName
                        });
                        wayinfowindow.open(nmap, e.coord);
                    });

                    naver.maps.Event.addListener(polline, 'mouseout', _ => {
                        if (!polline.getMap()) return;
                        polline.setOptions({
                            strokeWeight: strokeweight,
                            strokeColor: clor
                        });
                        wayinfowindow.close();
                    });

                    // 체크박스 생성
                    const ckbx = document.createElement('input');
                    ckbx.type = "checkbox";
                    ckbx.id = wayNameMangle;
                    ckbx.className = clss;
                    if (init_status) ckbx.checked = true;

                    const y = document.createElement('label');
                    y.style.color = clor;
                    y.setAttribute('for', wayNameMangle);
                    y.textContent = wayName;

                    ckbx.onchange = _ => {
                        if (ckbx.checked) addWay(wayNameMangle);
                        else delWay(wayNameMangle);
                    };

                    part.appendChild(ckbx);
                    part.appendChild(y);
                    part.appendChild(document.createElement('br'));

                    if (init_status) addWay(wayNameMangle);
                }
            });
    }
}

// 지도에 표시/삭제
const overlays_setMap = (wayName, m) => {
    if (!ways[wayName]) return;
    for (let overlay of ways[wayName]['overlays']) {
        overlay.setMap(m);
    }
};

const addWay = wayName => overlays_setMap(wayName, nmap);
const delWay = wayName => overlays_setMap(wayName, null);

// 클래스 단위 전체 on/off
const selct = (clss, checkedState, action) => {
    const checkboxes = document.querySelectorAll(`input.${clss}`);
    for (let ckbx of checkboxes) {
        if (ckbx.checked === checkedState) {
            ckbx.checked = !checkedState;
            action(ckbx.id);
        }
    }
};

export const selectMW = _ => selct(motorwayClass, false, addWay);
export const deselectMW = _ => selct(motorwayClass, true, delWay);
export const selectHW = _ => selct(highwayClass, false, addWay);
export const deselectHW = _ => selct(highwayClass, true, delWay);
