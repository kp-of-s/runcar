// markerManager.js
import { getMap } from './drawMap.js';

function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines.shift().split(',');
    return lines.map(line => {
        const values = line.split(',');
        const obj = {};
        headers.forEach((h, i) => {
            obj[h.trim()] = values[i] ? values[i].trim() : '';
        });
        return obj;
    });
}

let markers = {}; // { clss: [marker, ...] }
let nmap;

export function initMarkers() {
    nmap = getMap();

    const params = [
        ['marker/TG.csv', document.getElementById("tollgate_marker"), true, 'resource/marker1.png', 'tg'],
        ['marker/IC.csv', document.getElementById("interchange_marker"), true, 'resource/marker2.png', 'ic'],
        ['marker/JC.csv', document.getElementById("junction_marker"), true, 'resource/marker3.png', 'jc'],
        ['marker/RA.csv', document.getElementById("restarea_marker"), true, 'resource/marker4.png', 'ra']
    ];

    for (const p of params) {
        const [csvFile, part, initStatus, icon_image, clss] = p;

        if (!markers[clss]) markers[clss] = [];

        fetch(csvFile)
            .then(res => res.text())
            .then(text => {
                const data = parseCSV(text);

                data.forEach((item, idx) => {
                    const lat = parseFloat(item.lat);
                    const lon = parseFloat(item.lon);
                    if (isNaN(lat) || isNaN(lon)) return;

                    const position = new naver.maps.LatLng(lat, lon);

                    const marker = new naver.maps.Marker({
                        position,
                        map: initStatus ? nmap : null,
                        icon: {
                            url: icon_image,
                            size: new naver.maps.Size(20, 20),
                            scaledSize: new naver.maps.Size(20, 20),
                            anchor: new naver.maps.Point(10, 10)
                        }
                    });

                    // InfoWindow
                    const infowindow = new naver.maps.InfoWindow({
                        content: `
                          <div style="padding:5px; max-width:200px;">
                            <strong>노선명:</strong> ${item.노선명}<br>
                            <strong>시설명:</strong> ${item.시설명}<br>
                            <strong>노선방향:</strong> ${item.노선방향}<br>
                            <strong>유형:</strong> ${item.유형}<br>
                            <strong>좌표:</strong> ${lat}, ${lon}
                          </div>`
                    });

                    naver.maps.Event.addListener(marker, 'mouseover', () => infowindow.open(nmap, marker));
                    naver.maps.Event.addListener(marker, 'mouseout', () => infowindow.close());

                    markers[clss].push(marker);
                    const markerIndex = markers[clss].length - 1;

                    // 체크박스 UI
                    if (part) {
                        const ckbx = document.createElement('input');
                        ckbx.type = 'checkbox';
                        ckbx.checked = initStatus;
                        ckbx.className = clss;
                        ckbx.dataset.index = markerIndex;
                        ckbx.onchange = () => {
                            const idx = ckbx.dataset.index;
                            markers[clss][idx].setMap(ckbx.checked ? nmap : null);
                        };
                        part.appendChild(ckbx);

                        const label = document.createElement('label');
                        label.innerText = item.시설명;
                        part.appendChild(label);
                        part.appendChild(document.createElement('br'));
                    }
                });
            });
    }
}

// 전체 선택/해제
export const selectMarkers = clss => {
    document.querySelectorAll('input.' + clss).forEach(ckbx => {
        const idx = ckbx.dataset.index;
        if (!ckbx.checked) {
            ckbx.checked = true;
            markers[clss][idx].setMap(nmap);
        }
    });
};

export const deselectMarkers = clss => {
    document.querySelectorAll('input.' + clss).forEach(ckbx => {
        const idx = ckbx.dataset.index;
        if (ckbx.checked) {
            ckbx.checked = false;
            markers[clss][idx].setMap(null);
        }
    });
};
