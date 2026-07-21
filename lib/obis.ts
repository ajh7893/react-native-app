// OBIS(해양생물 출현 기록, Ocean Biodiversity Information System) API 호출 함수.
// 회원가입/API 키 없이 무료로 쓸 수 있습니다. 문서: https://api.obis.org

export type Observation = {
  latitude: number;
  longitude: number;
};

// 한반도 근해 사각형 범위 (WKT 포맷). 이 범위 밖의 관측 기록은 가져오지 않습니다.
// 전 세계 데이터를 다 가져오면 태평양 한복판 점까지 찍혀서 지도가 의미 없어지기 때문.
const KOREA_WATERS_WKT = 'POLYGON((122 30, 133 30, 133 40, 122 40, 122 30))';

// 학명(scientificName)으로 실제 관측 위치를 가져옵니다.
// async function: 시간이 걸리는 작업(네트워크 요청)을 기다렸다가 결과를 반환하는 함수.
export async function fetchObservations(
  scientificName: string,
  limit = 15
): Promise<Observation[]> {
  const url =
    `https://api.obis.org/v3/occurrence` +
    `?scientificname=${encodeURIComponent(scientificName)}` +
    `&geometry=${encodeURIComponent(KOREA_WATERS_WKT)}` +
    // ON_LAND: OBIS가 자체적으로 "이 좌표는 육지로 보인다"고 표시해둔 의심스러운 기록.
    // 오래된 표본 좌표가 반올림되었거나 조사 기관 주소가 잘못 들어간 경우가 많아 제외합니다.
    `&exclude=ON_LAND` +
    `&size=${limit}`;

  // fetch: 웹에서 쓰던 그 fetch가 맞습니다. React Native에도 똑같이 내장되어 있어요.
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`OBIS API 요청 실패: ${response.status}`);
  }

  const json = await response.json();

  // 위/경도 값이 없는(비정상) 기록은 걸러내고, 우리가 쓸 형태로 모양을 맞춰줍니다.
  return json.results
    .filter(
      (r: any) =>
        typeof r.decimalLatitude === 'number' && typeof r.decimalLongitude === 'number'
    )
    .map((r: any) => ({
      latitude: r.decimalLatitude,
      longitude: r.decimalLongitude,
    }));
}
