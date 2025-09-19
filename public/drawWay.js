// ways.js
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
            .then(res => res.text())
            .then(str => JSON.parse(str))
            .then(jso => {
                for (let wayName in jso) {
                    const wayNameMangle = wayName + clss;
                    let linestr_coord = jso[wayName];

                    let linestr_LatLng = [];
                    for (let x of linestr_coord)
                        linestr_LatLng.push(new naver.maps.LatLng(x[1], x[0]));

                    let polline = new naver.maps.Polyline({
                        path: linestr_LatLng,
                        strokeColor: clor,
                        strokeStyle: strokestyle,
                        strokeLineCap: 'round',
                        strokeLineJoin: 'round',
                        strokeWeight: strokeweight,
                        clickable: true
                    });

                    if (!ways[wayNameMangle]) ways[wayNameMangle] = { type: wayType, overlays: [] };
					ways[wayNameMangle].overlays.push(polline);
					// console.log("도로 생성:", {
					// 	name: wayName,
					// 	id: wayNameMangle,
					// 	type: wayType,
					// 	color: clor,
					// 	strokeStyle: strokestyle,
					// 	strokeWeight: strokeweight,
					// 	coordCount: linestr_coord.length
					// });

                    naver.maps.Event.addListener(polline, 'mouseover', e => {
                        polline.setOptions({
                            strokeWeight: strokeweight,
                            strokeColor: 'yellow',
                        });
                        wayinfowindow.setOptions({
                            position: e.coord,
                            content: wayName
                        });
                        wayinfowindow.open(nmap, e.coord);
                    });

                    naver.maps.Event.addListener(polline, 'mouseout', _ => {
                        polline.setOptions({
                            strokeWeight: strokeweight,
                            strokeColor: clor
                        });
                        wayinfowindow.close();
                    });

                    // 체크박스 UI
                    let ckbx = document.createElement('input');
                    ckbx.type = "checkbox";
                    ckbx.checked = init_status;
                    ckbx.id = wayNameMangle;
                    ckbx.className = clss;

                    let y = document.createElement('label');
                    y.style.color = clor;
                    y.setAttribute('for', wayNameMangle);
                    y.appendChild(document.createTextNode(wayName));

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

const overlays_setMap = (wayName, m) => {
    for (let overlay of ways[wayName]['overlays']) {
        overlay.setMap(m);
    }
};

const addWay = wayName => { console.log(wayName); overlays_setMap(wayName, nmap); };
const delWay = wayName => { overlays_setMap(wayName, null); };

// 통합 함수
export const selectWays = clss => {
    document.querySelectorAll('input.' + clss).forEach(ckbx => {
        if (!ckbx.checked) {
            ckbx.checked = true;
            addWay(ckbx.id);
        }
    });
};

export const deselectWays = clss => {
    document.querySelectorAll('input.' + clss).forEach(ckbx => {
        if (ckbx.checked) {
            ckbx.checked = false;
            delWay(ckbx.id);
        }
    });
};
