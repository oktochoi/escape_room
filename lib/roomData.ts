// ============================================================================
// 타입 정의
// ============================================================================

export type Difficulty = 'easy' | 'normal' | 'hard';

export interface RoomTheme {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  playTime: number;
  thumbnailUrl: string;
  slug: string;
  story: string;
}

export interface GameQuestion {
  id: number;
  question: string;
  hint: string;
  answer: string;
  imageUrl?: string;
}

// ============================================================================
// 상수
// ============================================================================

const IMAGE_API_BASE = 'https://readdy.ai/api/search-image';
const DEFAULT_IMAGE_SIZE = { width: 800, height: 600 };

// 이미지 URL 생성 헬퍼 함수
const createImageUrl = (
  query: string,
  seq: string,
  width = DEFAULT_IMAGE_SIZE.width,
  height = DEFAULT_IMAGE_SIZE.height
): string => {
  const params = new URLSearchParams({
    query,
    width: width.toString(),
    height: height.toString(),
    seq,
    orientation: 'landscape',
  });
  return `${IMAGE_API_BASE}?${params.toString()}`;
};

// ============================================================================
// 방 테마 데이터
// ============================================================================

export const roomThemes: RoomTheme[] = [
  {
    id: '1',
    title: '잃어버린 연구소',
    description: '폐쇄된 연구소에서 숨겨진 비밀을 찾아라',
    difficulty: 'hard',
    playTime: 60,
    thumbnailUrl: createImageUrl(
      'abandoned dark mysterious scientific research laboratory with glowing screens and scattered papers dramatic lighting cinematic atmosphere foggy environment high tech equipment covered in dust',
      'room1'
    ),
    slug: 'lost-laboratory',
    story: '50년 전 갑자기 폐쇄된 연구소. 당신은 이곳에서 사라진 과학자의 마지막 실험 기록을 찾아야 합니다.',
  },
  {
    id: '2',
    title: '저주받은 저택',
    description: '100년 된 저택의 저주를 풀어라',
    difficulty: 'normal',
    playTime: 45,
    thumbnailUrl: createImageUrl(
      'haunted victorian mansion interior with antique furniture candlelight mysterious shadows gothic atmosphere dark wooden panels dusty chandelier eerie ambiance moonlight through windows',
      'room2'
    ),
    slug: 'cursed-mansion',
    story: '대대로 내려오는 저주로 인해 아무도 살지 않는 저택. 저주의 근원을 찾아 해방시켜야 합니다.',
  },
  {
    id: '3',
    title: '시간 여행자의 방',
    description: '과거와 미래를 넘나들며 퍼즐을 해결하라',
    difficulty: 'hard',
    playTime: 70,
    thumbnailUrl: createImageUrl(
      'futuristic time travel room with glowing blue portals floating clocks holographic displays sci fi technology neon lights temporal distortion effects mysterious atmosphere advanced machinery',
      'room3'
    ),
    slug: 'time-traveler-room',
    story: '시간 여행 실험이 실패한 방. 시간의 균열을 바로잡고 현재로 돌아와야 합니다.',
  },
  {
    id: '4',
    title: '해적의 보물선',
    description: '침몰한 해적선에서 전설의 보물을 찾아라',
    difficulty: 'easy',
    playTime: 30,
    thumbnailUrl: createImageUrl(
      'sunken pirate ship interior underwater scene with treasure chests old maps golden coins mysterious blue lighting wooden barrels ancient artifacts atmospheric rays of light through water',
      'room4'
    ),
    slug: 'pirate-treasure-ship',
    story: '전설의 해적 블랙비어드의 보물선. 숨겨진 보물의 위치를 암호를 풀어 찾아내세요.',
  },
  {
    id: '5',
    title: '마법사의 탑',
    description: '고대 마법사의 주문서를 해독하라',
    difficulty: 'normal',
    playTime: 50,
    thumbnailUrl: createImageUrl(
      'ancient wizard tower interior with magical books glowing runes crystal ball potion bottles mystical purple lighting floating spell books enchanted atmosphere stone walls magical artifacts',
      'room5'
    ),
    slug: 'wizard-tower',
    story: '사라진 대마법사의 탑. 봉인된 주문서를 해독하여 탑의 비밀을 밝혀내야 합니다.',
  },
  {
    id: '6',
    title: '사이버 해커의 은신처',
    description: '해커의 암호화된 시스템을 뚫어라',
    difficulty: 'hard',
    playTime: 55,
    thumbnailUrl: createImageUrl(
      'cyberpunk hacker hideout with multiple glowing monitors neon lights computer servers digital code streaming dark room futuristic technology cables everywhere matrix style atmosphere green and blue lighting',
      'room6'
    ),
    slug: 'cyber-hacker-hideout',
    story: '국제 해커 조직의 은신처. 암호화된 데이터를 해독하고 중요한 정보를 찾아내세요.',
  },
  {
    id: '7',
    title: '이집트 파라오의 무덤',
    description: '고대 이집트의 저주를 피해 탈출하라',
    difficulty: 'normal',
    playTime: 45,
    thumbnailUrl: createImageUrl(
      'ancient egyptian pharaoh tomb interior with hieroglyphics golden sarcophagus torch lighting mysterious shadows sand covered floor ancient treasures dramatic atmosphere stone pillars mystical ambiance',
      'room7'
    ),
    slug: 'pharaoh-tomb',
    story: '3000년 전 봉인된 파라오의 무덤. 저주를 피하고 무사히 탈출해야 합니다.',
  },
  {
    id: '8',
    title: '우주 정거장 비상사태',
    description: '고장난 우주 정거장을 수리하고 탈출하라',
    difficulty: 'easy',
    playTime: 35,
    thumbnailUrl: createImageUrl(
      'futuristic space station interior with control panels holographic displays stars visible through windows emergency red lighting floating objects zero gravity sci fi technology metallic surfaces dramatic atmosphere',
      'room8'
    ),
    slug: 'space-station-emergency',
    story: '산소가 부족한 우주 정거장. 시스템을 복구하고 지구로 귀환해야 합니다.',
  },
];

// ============================================================================
// 게임 질문 데이터
// ============================================================================

const createQuestionImageUrl = (query: string, seq: string): string =>
  createImageUrl(query, seq, 600, 400);

export const gameQuestions: Record<string, GameQuestion[]> = {
  'lost-laboratory': [
    {
      id: 1,
      question: '연구소 입구의 키패드에 적힌 메모: "첫 번째 원소의 원자번호 + 물의 분자식 숫자의 합"',
      hint: '수소(H)의 원자번호는 1, H2O에서 2+1=3',
      answer: '4',
      imageUrl: createQuestionImageUrl(
        'scientific keypad lock with handwritten note chemical formulas dark laboratory setting mysterious lighting close up view detailed texture',
        'lab1'
      ),
    },
    {
      id: 2,
      question: '실험 노트에 적힌 암호: "SCIENCE"를 숫자로 변환하면? (A=1, B=2...)',
      hint: 'S=19, C=3, I=9, E=5, N=14, C=3, E=5',
      answer: '19395145',
      imageUrl: createQuestionImageUrl(
        'old scientific notebook with handwritten notes and codes worn pages mysterious symbols laboratory background vintage style detailed close up',
        'lab2'
      ),
    },
    {
      id: 3,
      question: '냉동 보관소의 온도계가 가리키는 숫자를 역순으로 입력하세요: -273',
      hint: '역순으로 읽으면 372',
      answer: '372',
    },
    {
      id: 4,
      question: '마지막 실험 기록: "빛의 속도를 천 단위로 나눈 값" (km/s)',
      hint: '빛의 속도는 약 300,000 km/s',
      answer: '300',
    },
  ],
  'cursed-mansion': [
    {
      id: 1,
      question: '현관 거울에 비친 글자: "LIVE"',
      hint: '거울에 비친 글자를 뒤집으면?',
      answer: 'EVIL',
      imageUrl: createQuestionImageUrl(
        'antique mirror with mysterious text reflection gothic mansion interior candlelight eerie atmosphere ornate frame detailed close up',
        'mansion1'
      ),
    },
    {
      id: 2,
      question: '피아노 위의 악보에 표시된 음표: C-E-G-A-D',
      hint: '음표의 첫 글자를 이어 읽으세요',
      answer: 'CEGAD',
    },
    {
      id: 3,
      question: '시계탑이 가리키는 시간: 3시 15분. 시침과 분침이 이루는 각도는?',
      hint: '시침은 3과 4 사이, 분침은 3. 각도 계산 필요',
      answer: '7.5',
    },
  ],
  'time-traveler-room': [
    {
      id: 1,
      question: '시간 포털의 좌표: 과거(1985) + 미래(2085) = ?',
      hint: '두 연도를 더하세요',
      answer: '4070',
      imageUrl: createQuestionImageUrl(
        'glowing time portal with digital numbers and coordinates futuristic interface blue neon lights sci fi technology holographic display mysterious atmosphere',
        'time1'
      ),
    },
    {
      id: 2,
      question: '시간 역설 방정식: 현재 연도의 각 자릿수를 곱하면?',
      hint: '2024 → 2×0×2×4 = 0, 다시 생각해보세요. 2×2×4 = 16',
      answer: '16',
    },
    {
      id: 3,
      question: '타임머신 코드: "PAST"를 미래 암호로 변환 (각 알파벳 +5)',
      hint: 'P→U, A→F, S→X, T→Y',
      answer: 'UFXY',
    },
  ],
  'pirate-treasure-ship': [
    {
      id: 1,
      question: '보물 지도의 X 표시 좌표: 북쪽으로 3, 동쪽으로 7',
      hint: '좌표를 숫자로 합치면?',
      answer: '37',
      imageUrl: createQuestionImageUrl(
        'old pirate treasure map with X marks the spot aged paper compass rose nautical symbols mysterious lighting detailed illustration vintage style',
        'pirate1'
      ),
    },
    {
      id: 2,
      question: '선장의 일지: "보물은 7개의 바다를 건너 49일째 되는 날 묻었다"',
      hint: '7 × 7 = ?',
      answer: '49',
    },
    {
      id: 3,
      question: '금화의 개수: 첫 번째 상자 12개, 두 번째 상자 18개, 세 번째 상자 24개',
      hint: '모두 더하면?',
      answer: '54',
    },
  ],
  'wizard-tower': [
    {
      id: 1,
      question: '마법진의 룬 문자: ᚱᚢᚾᛖ (RUNE)를 숫자로 변환 (R=18, U=21, N=14, E=5)',
      hint: '각 알파벳의 순서를 더하세요',
      answer: '58',
      imageUrl: createQuestionImageUrl(
        'glowing magical rune circle on stone floor mystical symbols purple light ancient wizard tower detailed engravings magical atmosphere',
        'wizard1'
      ),
    },
    {
      id: 2,
      question: '물약 제조법: 용의 비늘 3개 + 유니콘 뿔 가루 5스푼 + 불사조 깃털 2개',
      hint: '재료의 개수를 모두 더하세요',
      answer: '10',
    },
    {
      id: 3,
      question: '주문서의 암호: "MAGIC"을 역순으로',
      hint: '뒤에서부터 읽으세요',
      answer: 'CIGAM',
    },
  ],
  'cyber-hacker-hideout': [
    {
      id: 1,
      question: '시스템 로그인: 바이너리 코드 01001000 01001001 (ASCII)',
      hint: '01001000=H, 01001001=I',
      answer: 'HI',
      imageUrl: createQuestionImageUrl(
        'computer screen with binary code and login interface green text on black background hacker style matrix atmosphere glowing numbers cyberpunk aesthetic',
        'cyber1'
      ),
    },
    {
      id: 2,
      question: '암호화 키: MD5 해시의 첫 4자리 - a1b2',
      hint: '그대로 입력하세요',
      answer: 'a1b2',
    },
    {
      id: 3,
      question: 'IP 주소의 마지막 옥텟: 192.168.1.???. 힌트: 2의 7승',
      hint: '2^7 = 128',
      answer: '128',
    },
  ],
  'pharaoh-tomb': [
    {
      id: 1,
      question: '상형문자 해독: 태양(1) + 매(2) + 뱀(3) + 물(4)',
      hint: '숫자를 순서대로 이어붙이세요',
      answer: '1234',
      imageUrl: createQuestionImageUrl(
        'ancient egyptian hieroglyphics carved on stone wall golden lighting detailed symbols pharaoh tomb interior mysterious atmosphere close up view',
        'egypt1'
      ),
    },
    {
      id: 2,
      question: '파라오의 이름: TUTANKHAMUN의 자음 개수',
      hint: 'T, T, N, K, H, M, N = 7개',
      answer: '7',
    },
    {
      id: 3,
      question: '피라미드의 층수: 기자의 대피라미드는 원래 몇 층? (힌트: 100+46)',
      hint: '146층',
      answer: '146',
    },
  ],
  'space-station-emergency': [
    {
      id: 1,
      question: '산소 탱크 압력: 현재 35%, 필요량 100%. 추가 필요량은?',
      hint: '100 - 35 = ?',
      answer: '65',
      imageUrl: createQuestionImageUrl(
        'futuristic oxygen tank display with digital readout space station interior red emergency lighting sci fi control panel detailed interface',
        'space1'
      ),
    },
    {
      id: 2,
      question: '통신 주파수: 지구 관제센터 주파수는 144.39 MHz. 소수점 제거 시?',
      hint: '14439',
      answer: '14439',
    },
    {
      id: 3,
      question: '귀환 카운트다운: T-10분. 초로 환산하면?',
      hint: '10 × 60 = ?',
      answer: '600',
    },
  ],
};

// ============================================================================
// 유틸리티 함수
// ============================================================================

/**
 * 슬러그로 방 테마를 찾습니다.
 * @param slug - 방의 슬러그
 * @returns 해당하는 방 테마 또는 undefined
 */
export function getRoomBySlug(slug: string): RoomTheme | undefined {
  return roomThemes.find(room => room.slug === slug);
}

/**
 * 슬러그로 게임 질문 목록을 가져옵니다.
 * @param slug - 방의 슬러그
 * @returns 해당 방의 질문 배열 (없으면 빈 배열)
 */
export function getQuestionsBySlug(slug: string): GameQuestion[] {
  return gameQuestions[slug] ?? [];
}

/**
 * 모든 방 테마를 가져옵니다.
 * @returns 모든 방 테마 배열
 */
export function getAllRooms(): RoomTheme[] {
  return [...roomThemes];
}

/**
 * 난이도별로 방을 필터링합니다.
 * @param difficulty - 필터링할 난이도
 * @returns 해당 난이도의 방 배열
 */
export function getRoomsByDifficulty(difficulty: Difficulty): RoomTheme[] {
  return roomThemes.filter(room => room.difficulty === difficulty);
}
