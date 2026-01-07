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
];

// ============================================================================
// 게임 질문 데이터
// ============================================================================

const createQuestionImageUrl = (query: string, seq: string): string =>
  createImageUrl(query, seq, 600, 400);

export const gameQuestions: Record<string, GameQuestion[]> = {
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
