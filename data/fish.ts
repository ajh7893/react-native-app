// 어류 도감의 데이터 파일입니다.
// 나중에 실제 API로 교체하기 전까지, 이 배열이 우리의 "데이터베이스" 역할을 합니다.

// TypeScript 문법: 어류 한 마리가 어떤 정보를 갖는지 "타입"으로 정의합니다.
// 이렇게 해두면 오타를 내거나 항목을 빼먹었을 때 에디터가 바로 알려줍니다.
export type Fish = {
  id: string;
  name: string; // 한국어 이름
  scientificName: string; // 학명
  emoji: string; // 사진 대신 쓸 이모지 (나중에 실제 사진으로 교체)
  habitat: string; // 서식지
  size: string; // 평균 크기
  description: string; // 설명
  // 관찰된 위치 (2단계 지도에서 사용할 예정)
  locations: { latitude: number; longitude: number }[];
};

export const FISH_LIST: Fish[] = [
  {
    id: '1',
    name: '고등어',
    scientificName: 'Scomber japonicus',
    emoji: '🐟',
    habitat: '온대 해역의 표층~중층',
    size: '30~40cm',
    description:
      '등푸른생선의 대표 주자. 무리를 지어 다니며 한국 연안 전역에서 잡힌다. 구이와 조림으로 사랑받는 국민 생선.',
    locations: [
      { latitude: 35.1796, longitude: 129.0756 }, // 부산 근해
      { latitude: 33.5097, longitude: 126.5219 }, // 제주 근해
    ],
  },
  {
    id: '2',
    name: '갈치',
    scientificName: 'Trichiurus lepturus',
    emoji: '🗡️',
    habitat: '수심 100m 안팎의 모래·펄 바닥',
    size: '50~100cm',
    description:
      '은빛으로 빛나는 길쭉한 몸이 칼을 닮아 갈치(칼치)라 불린다. 밤에 표층으로 올라와 먹이를 사냥한다.',
    locations: [
      { latitude: 33.2382, longitude: 126.5653 }, // 서귀포 근해
      { latitude: 34.7604, longitude: 127.6622 }, // 여수 근해
    ],
  },
  {
    id: '3',
    name: '광어(넙치)',
    scientificName: 'Paralichthys olivaceus',
    emoji: '🐠',
    habitat: '연안의 모래 바닥',
    size: '40~80cm',
    description:
      '두 눈이 몸 왼쪽에 몰려 있는 납작한 물고기. 바닥에 붙어 몸 색을 바꿔 위장한다. 횟감으로 가장 많이 양식되는 어종.',
    locations: [
      { latitude: 33.4996, longitude: 126.5312 }, // 제주
      { latitude: 36.6173, longitude: 126.3336 }, // 태안 근해
    ],
  },
  {
    id: '4',
    name: '참돔',
    scientificName: 'Pagrus major',
    emoji: '🐡',
    habitat: '수심 30~150m 암초 지대',
    size: '30~70cm',
    description:
      '선명한 붉은빛 몸에 푸른 점이 흩어져 있어 "바다의 왕자"로 불린다. 수명이 길어 20년 넘게 사는 개체도 있다.',
    locations: [
      { latitude: 34.8118, longitude: 128.4224 }, // 통영 근해
      { latitude: 34.3114, longitude: 126.7531 }, // 완도 근해
    ],
  },
  {
    id: '5',
    name: '방어',
    scientificName: 'Seriola quinqueradiata',
    emoji: '🐋',
    habitat: '온대 해역 회유성',
    size: '60~110cm',
    description:
      '겨울철 제주 바다의 별미. 차가운 물을 따라 남하하며 겨울에 지방이 올라 "대방어"로 인기가 높다.',
    locations: [
      { latitude: 33.2043, longitude: 126.2929 }, // 모슬포 근해
      { latitude: 35.4919, longitude: 129.4204 }, // 울산 근해
    ],
  },
  {
    id: '6',
    name: '멸치',
    scientificName: 'Engraulis japonicus',
    emoji: '🐟',
    habitat: '연안 표층',
    size: '10~15cm',
    description:
      '작지만 바다 생태계를 떠받치는 중요한 물고기. 큰 무리를 이루어 다니며 남해안 죽방렴 멸치가 유명하다.',
    locations: [
      { latitude: 34.8372, longitude: 128.0432 }, // 남해 근해
      { latitude: 34.7331, longitude: 128.4227 }, // 통영 앞바다
    ],
  },
  {
    id: '7',
    name: '명태',
    scientificName: 'Gadus chalcogrammus',
    emoji: '❄️',
    habitat: '수온 2~10°C의 찬 바다',
    size: '30~60cm',
    description:
      '생태, 동태, 황태, 코다리, 노가리… 상태에 따라 이름이 수십 가지인 물고기. 동해의 찬 바다에 산다.',
    locations: [
      { latitude: 38.2070, longitude: 128.5918 }, // 속초 근해
      { latitude: 37.7519, longitude: 128.8961 }, // 강릉 근해
    ],
  },
  {
    id: '8',
    name: '전갱이',
    scientificName: 'Trachurus japonicus',
    emoji: '🐟',
    habitat: '연안~근해 중층',
    size: '20~35cm',
    description:
      '고등어와 비슷하지만 옆줄을 따라 방패비늘이 늘어서 있는 것이 특징. 여름이 제철이며 회와 구이 모두 맛있다.',
    locations: [
      { latitude: 33.5141, longitude: 126.9530 }, // 성산 근해
      { latitude: 35.0768, longitude: 129.1051 }, // 부산 앞바다
    ],
  },
  {
    id: '9',
    name: '아귀',
    scientificName: 'Lophiomus setigerus',
    emoji: '🎣',
    habitat: '수심 50~250m 바닥',
    size: '40~100cm',
    description:
      '머리의 낚싯대 같은 돌기를 흔들어 먹이를 유인하는 심해의 사냥꾼. 못생겼지만 아귀찜으로 사랑받는다.',
    locations: [
      { latitude: 35.2050, longitude: 128.5811 }, // 마산 근해
      { latitude: 36.0190, longitude: 129.3435 }, // 포항 근해
    ],
  },
  {
    id: '10',
    name: '돌돔',
    scientificName: 'Oplegnathus fasciatus',
    emoji: '🦓',
    habitat: '연안 암초 지대',
    size: '30~50cm',
    description:
      '몸에 뚜렷한 검은 줄무늬 7개가 있어 알아보기 쉽다. 단단한 이빨로 성게와 소라를 부숴 먹는 낚시꾼들의 로망.',
    locations: [
      { latitude: 33.9640, longitude: 126.2986 }, // 추자도 근해
      { latitude: 34.0210, longitude: 127.3080 }, // 거문도 근해
    ],
  },
];
