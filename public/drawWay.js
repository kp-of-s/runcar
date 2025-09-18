// drawWay.js
'use strict';
import { getMap } from './drawMap.js';

let ways = {};
let wayinfowindow;
let nmap;

const motorwayClass = 'mw';
const highwayClass = 'hw';

export function initWays() {
    nmap = getMap();
    wayinfowindow = new naver.maps.InfoWindow({ content: '' });

    const params = [
        ['road/Motorways', '#FF0000', true, motorwayClass, document.getElementById("motorways"), 'solid', 3],
        ['road/highway', '#0000FF', true, highwayClass, document.getElementById("highway"), 'solid', 3]
    ];

    for (const p of params) {
        const [wayType, clor, initStatus, clss, part, strokestyle, strokeweight] = p;

        fetch(wayType + '.json')
            .then(res => res.json())
            .then(jso => {
                for (let wayName in jso) {
                    const wayNameMangle = wayName + clss;
                    const coords = jso[wayName].map(c => new naver.maps.LatLng(c[1], c[0]));

                    const polyline = new naver.maps.Polyline({
                        path: coords,
                        strokeColor: clor,
                        strokeStyle: strokestyle,
                        strokeLineCap: 'round',
                        strokeLineJoin: 'round',
                        strokeWeight: strokeweight,
                        clickable: true
                    });

                    ways[wayNameMangle] = { type: wayType, overlays: [polyline] };

                    naver.maps.Event.addListener(polyline, 'mouseover', e => {
                        polyline.setOptions({ strokeWeight, strokeColor: 'yellow' });
                        wayinfowindow.setOptions({ position: e.coord, content: wayName });
                        wayinfowindow.open(nmap, e.coord);
                    });

                    naver.maps.Event.addListener(polyline, 'mouseout', _ => {
                        polyline.setOptions({ strokeWeight, strokeColor: clor });
                        wayinfowindow.close();
                    });

                    // 체크박스 UI
                    const ckbx = document.createElement('input');
                    ckbx.type = 'checkbox';
                    ckbx.checked = initStatus;
                    ckbx.id = wayNameMangle;
                    ckbx.className = clss;
                    ckbx.onchange = () => {
                        if (ckbx.checked) addWay(ckbx.id);
                        else delWay(ckbx.id);
                    };

                    const label = document.createElement('label');
                    label.setAttribute('style', `color: ${clor}`);
                    label.setAttribute('for', wayNameMangle);
                    label.textContent = wayName;

                    part.appendChild(ckbx);
                    part.appendChild(label);
                    part.appendChild(document.createElement('br'));

                    if (initStatus) addWay(wayNameMangle);
                }
            });
    }
}

// overlay 지도 표시/삭제
const setOverlaysMap = (wayName, map) => {
    ways[wayName].overlays.forEach(overlay => overlay.setMap(map));
};

const addWay = wayName => setOverlaysMap(wayName, nmap);
const delWay = wayName => setOverlaysMap(wayName, null);

// 클래스 전체 선택/해제
const toggleClass = (clss, setTo) => {
    document.querySelectorAll('input.' + clss).forEach(ckbx => {
        if (ckbx.checked !== setTo) {
            ckbx.checked = setTo;
            if (setTo) addWay(ckbx.id);
            else delWay(ckbx.id);
        }
    });
};

export const selectMW = () => toggleClass(motorwayClass, true);
export const deselectMW = () => toggleClass(motorwayClass, false);
export const selectHW = () => toggleClass(highwayClass, true);
export const deselectHW = () => toggleClass(highwayClass, false);
