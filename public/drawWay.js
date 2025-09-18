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
		const wayType = p[0]
		const clor = p[1]
		const init_status = p[2]
		const clss = p[3]
		const part = p[4]
		const strokestyle = p[5]
		const strokeweight = p[6]

		fetch(wayType + '.json')
			.then(res => res.text())
			.then(str => JSON.parse(str))
			.then(jso => {
				for (let wayName in jso) {
					const wayNameMangle = wayName + clss

					let linestr_coord = jso[wayName]

					let linestr_LatLng = []
					for (let x of linestr_coord)
						linestr_LatLng.push(new naver.maps.LatLng(x[1], x[0]))

					let polline = new naver.maps.Polyline({
						path: linestr_LatLng,
						strokeColor: clor,
						strokeStyle: strokestyle,
						strokeLineCap: 'round',
						strokeLineJoin: 'round',
						strokeWeight: strokeweight,
						clickable: true
					});

					ways[wayNameMangle] = {
						"type": wayType,
						"overlays": [polline]
					}

					naver.maps.Event.addListener(polline, 'mouseover', e => {
						polline.setOptions({
							strokeWeight: strokeweight,
							strokeColor: 'yellow',
						});
						wayinfowindow.setOptions({
							position: e.coord,
							content: wayName
						})
						wayinfowindow.open(nmap, e.coord);
					});

					naver.maps.Event.addListener(polline, 'mouseout', _ => {
						polline.setOptions({
							strokeWeight: strokeweight,
							strokeColor: clor
						});
						wayinfowindow.close();
					});

					let ckbx = document.createElement('input')
					ckbx.setAttribute("type", "checkbox")
					if (init_status)
						ckbx.setAttribute("checked", true)
					ckbx.setAttribute('id', wayNameMangle)
					ckbx.setAttribute('class', clss)

					let y = document.createElement('label')
					y.setAttribute('style', 'color: ' + clor)
					y.setAttribute('for', wayNameMangle)
					y.appendChild(document.createTextNode(wayName))

					ckbx.onchange = _ => {
						if (ckbx.checked)
							addWay(wayNameMangle)
						else
							delWay(wayNameMangle)
					}

					part.appendChild(ckbx)
					part.appendChild(y)
					part.appendChild(document.createElement('br'))

					if (init_status)
						addWay(wayNameMangle)
				}
			})
	}
}

const overlays_setMap = (wayName, m) => {
	for (let overlay of ways[wayName]['overlays']) {
		overlay.setMap(m)
	}
}

const addWay = wayName => { overlays_setMap(wayName, nmap) }
const delWay = wayName => { overlays_setMap(wayName, null) }

const selct = params => {
    const checkboxes = document.querySelectorAll('input[class="' + params[0] + '"]');
    for (let ckbx of checkboxes) {
        if (ckbx.checked !== params[1]) {
            ckbx.checked = params[1];
            if (params[1]) {
                addWay(ckbx.id);
            } else {
                delWay(ckbx.id);
            }
        }
    }
}

export const selectMW = _ => selct([motorwayClass, true]);
export const deselectMW = _ => selct([motorwayClass, false]);
export const selectHW = _ => selct([highwayClass, true]);
export const deselectHW = _ => selct([highwayClass, false]);
