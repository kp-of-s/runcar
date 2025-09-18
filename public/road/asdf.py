import json
from pathlib import Path

# 변환할 파일 경로
input_path = Path("Motorways.json")
output_path = Path("Motorways.json")

# JSON 읽기
with open(input_path, "r", encoding="utf-8") as f:
    data = json.load(f)

# 좌표 변환: [경도, 위도] -> [위도, 경도]
converted = {}
for way_name, coords in data.items():
    converted[way_name] = [[lat, lon] for lon, lat in coords]

# 변환된 JSON 저장
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(converted, f, ensure_ascii=False, indent=2)

print(f"변환 완료: {output_path}")
