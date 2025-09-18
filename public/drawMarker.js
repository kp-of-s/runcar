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

const tollgateClass = 'tg';
const interchangeJunctionClass = 'ijc';
const restareaClass = 'ra';  // ✅ 수정

let markers = {};

function initMarkers(params) {
    for (const p of params) {
        const csvFile = p[0];
        const part = p[1];
        const init_status = p[2];
        const icon_image = p[3];
        const clss = p[4];

        fetch(csvFile)
            .then(res => res.text())
            .then(text => {
                const data = parseCSV(text);
                if (!markers[clss]) markers[clss] = {};

                for (let item of data) {
                    const lat = parseFloat(item.lat);
                    const lon = parseFloat(item.lon);
                    if (isNaN(lat) || isNaN(lon)) continue;

                    const position = new naver.maps.LatLng(lat, lon);

                    const marker = new naver.maps.Marker({
                        position: position,
                        map: init_status ? nmap : null,
                        icon: {
                            url: icon_image,
                            size: new naver.maps.Size(15, 20),
                            scaledSize: new naver.maps.Size(15, 20),
                            anchor: new naver.maps.Point(7, 20)
                        }
                    });

                    // key: 시설명 + 좌표
                    const key = `${item.시설명}_${lat}_${lon}`;
                    markers[clss][key] = marker;

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

                    // 체크박스 UI
                    if (part) {
                        const ckbx = document.createElement('input');
                        ckbx.type = 'checkbox';
                        ckbx.checked = init_status;
                        ckbx.className = clss;
                        ckbx.dataset.key = key;
                        ckbx.onchange = () => {
                            if (ckbx.checked) addMarker(clss, key);
                            else delMarker(clss, key);
                        };
                        part.appendChild(ckbx);

                        const label = document.createElement('label');
                        label.innerText = item.시설명;
                        part.appendChild(label);
                        part.appendChild(document.createElement('br'));
                    }
                }
            });
    }
}

const selectMarkers = clss => {
    document.querySelectorAll('input.' + clss).forEach(ckbx => {   // ✅ 수정
        if (!ckbx.checked) {
            ckbx.checked = true;
            addMarker(clss, ckbx.dataset.key);
        }
    });
};

const deselectMarkers = clss => {
    document.querySelectorAll('input.' + clss).forEach(ckbx => {   // ✅ 수정
        if (ckbx.checked) {
            ckbx.checked = false;
            delMarker(clss, ckbx.dataset.key);
        }
    });
};

// 개별 제어 함수
const addMarker = (clss, key) => {
    if (markers[clss] && markers[clss][key]) {
        markers[clss][key].setMap(nmap);
    }
};
const delMarker = (clss, key) => {
    if (markers[clss] && markers[clss][key]) {
        markers[clss][key].setMap(null);
    }
};
