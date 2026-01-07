// ============================================================================
// 타입 정의
// ============================================================================

export type Difficulty = 'easy' | 'normal' | 'hard';
export type PuzzleType = 'text' | 'code' | 'pattern' | 'clock';

export interface Hotspot {
  id: string;
  name: string;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  isSolved: boolean;
  puzzle: {
    type: PuzzleType;
    question: string;
    answer: string;
    hint: string;
    imageUrl?: string;
  };
  requiredItems?: string[];
  itemReward?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  icon: string;
}

export interface SubRoom {
  id: string;
  name: string;
  backgroundUrl: string;
  hotspots: Hotspot[];
}

export interface ExplorationRoom {
  id: string;
  slug: string;
  title: string;
  story: string;
  difficulty: Difficulty;
  backgroundMusic: string;
  timeLimit: number;
  subRooms: SubRoom[];
}

// ============================================================================
// 상수 및 헬퍼 함수
// ============================================================================

// 주제에 맞는 이미지 URL
// 로컬 이미지 우선 사용 (public/images 폴더), 없으면 외부 이미지 사용
const createBackgroundUrl = (theme: string): string => {
  const localImages: Record<string, string> = {
    // 연구실 - 과학 실험실 내부
    laboratory: '/images/laboratory-bg.jpg',
    // 보관실 - 창고/보관소
    storage: '/images/storage-bg.jpg',
    // 저택 - 고딕 저택 내부 (로컬 이미지 사용)
    mansion: '/images/cursed_house/first_room.png',
  };
  
  const externalImages: Record<string, string> = {
    laboratory: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b4?w=1920&h=1080&fit=crop&q=80',
    storage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&h=1080&fit=crop&q=80',
    mansion: 'https://images.unsplash.com/photo-1513694208250-520b60e97ccb?w=1920&h=1080&fit=crop&q=80',
  };
  
  // 로컬 이미지 우선, 없으면 외부 이미지
  return localImages[theme] || externalImages[theme] || externalImages.laboratory;
};

const createPuzzleImageUrl = (item: string): string => {
  // 로컬 이미지 우선 사용
  const localImages: Record<string, string> = {
    // 서제 - 저택 서제 이미지
    shelf: '/images/cursed_house/first_room_book_shelf.png',
    bookshelf: '/images/cursed_house/first_room_book_shelf.png',
    // 시계 - 저택 시계 이미지
    clock: '/images/cursed_house/first_room_clock.png',
    // 초상화 - 저택 초상화 이미지
    painting: '/images/cursed_house/first_room_picture.png',
    // 책상 - 저택 책상 이미지
    notebook: '/images/cursed_house/first_room_desk.png',
    desk: '/images/cursed_house/first_room_desk.png',
  };
  
  const externalImages: Record<string, string> = {
    // 노트북 - 책상 위 노트
    notebook: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop&q=80',
    // 금고 - 벽 금고
    safe: 'https://images.unsplash.com/photo-1554224154-260022812cbd?w=800&h=600&fit=crop&q=80',
    // 캐비닛 - 서류 캐비닛
    cabinet: 'https://images.unsplash.com/photo-1582719478250-3e272b300f78?w=800&h=600&fit=crop&q=80',
    // 시계 - 벽시계
    clock: 'https://images.unsplash.com/photo-1493612276213-13d21c8f18f7?w=800&h=600&fit=crop&q=80',
    // 문 - 실험실 문
    door: 'https://images.unsplash.com/photo-1513477654296-22c48430e0e5?w=800&h=600&fit=crop&q=80',
    // 선반 - 화학물질 선반
    shelf: 'https://images.unsplash.com/photo-1559757148-5c0d32ba7015?w=800&h=600&fit=crop&q=80',
    // 장비 - 과학 장비
    equipment: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop&q=80',
    // 출구 - 비상구
    exit: 'https://images.unsplash.com/photo-1513477654296-22c48430e0e5?w=800&h=600&fit=crop&q=80',
    // 거울 - 고딕 거울
    mirror: 'https://images.unsplash.com/photo-1513694208250-520b60e97ccb?w=800&h=600&fit=crop&q=80',
    // 피아노 - 그랜드 피아노
    piano: 'https://images.unsplash.com/photo-1514329923350-8c18e42e0c1b?w=800&h=600&fit=crop&q=80',
    // 초상화 - 벽에 걸린 그림
    painting: 'https://images.unsplash.com/photo-1513477654296-22c48430e0e5?w=800&h=600&fit=crop&q=80',
  };
  
  // 로컬 이미지 우선, 없으면 외부 이미지
  return localImages[item] || externalImages[item] || externalImages.notebook;
};

// 무료 음악 리소스 (공개 도메인)
const MUSIC_RESOURCES = {
  mystery: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  horror: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  ambient: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
};

// ============================================================================
// 방 데이터
// ============================================================================

export const explorationRooms: ExplorationRoom[] = [
  {
    id: '1',
    slug: 'lost-laboratory',
    title: '잃어버린 연구소',
    story: '폐쇄된 연구소에서 탈출하세요. 여러 개의 방을 통과해야 합니다.',
    difficulty: 'normal',
    backgroundMusic: MUSIC_RESOURCES.mystery,
    timeLimit: 900,
    subRooms: [
      {
        id: 'room-a',
        name: '연구실 A - 실험실',
        backgroundUrl: createBackgroundUrl('laboratory'),
        hotspots: [
          {
            id: 'desk',
            name: '연구 책상',
            position: { x: 30, y: 50, w: 30, h: 35 },
            isSolved: false,
            puzzle: {
              type: 'text',
              question: '책상 위 노트에 적힌 숫자: 2 + 3 = ?',
              answer: '5',
              hint: '간단한 덧셈입니다',
              imageUrl: createPuzzleImageUrl('notebook'),
            },
            itemReward: 'key1',
          },
          {
            id: 'safe',
            name: '벽 금고',
            position: { x: 65, y: 20, w: 20, h: 25 },
            isSolved: false,
            puzzle: {
              type: 'code',
              question: '금고 위에 새겨진 글자: "과학의 영어 단어"',
              answer: 'SCIENCE',
              hint: 'SCIENCE',
              imageUrl: createPuzzleImageUrl('safe'),
            },
            itemReward: 'room_b_key',
          },
          {
            id: 'cabinet',
            name: '서류 캐비닛',
            position: { x: 5, y: 35, w: 18, h: 40 },
            isSolved: false,
            puzzle: {
              type: 'text',
              question: '잠긴 캐비닛입니다. 열쇠가 필요합니다.',
              answer: '열기',
              hint: '책상에서 열쇠를 찾으세요',
              imageUrl: createPuzzleImageUrl('cabinet'),
            },
            requiredItems: ['key1'],
          },
          {
            id: 'clock',
            name: '벽시계',
            position: { x: 75, y: 5, w: 15, h: 15 },
            isSolved: false,
            puzzle: {
              type: 'code',
              question: '시계가 가리키는 시간: 3시 15분. 시침이 가리키는 숫자는?',
              answer: '3',
              hint: '시침이 가리키는 숫자를 보세요',
              imageUrl: createPuzzleImageUrl('clock'),
            },
          },
          {
            id: 'door',
            name: '다음 방으로 가는 문',
            position: { x: 80, y: 60, w: 15, h: 35 },
            isSolved: false,
            puzzle: {
              type: 'code',
              question: '문에 적힌 암호: "연구실 B로 가려면 이 방의 모든 퍼즐을 해결하고 열쇠를 사용하세요"',
              answer: '열기',
              hint: '모든 퍼즐을 해결하고 열쇠를 사용하면 문이 열립니다',
              imageUrl: createPuzzleImageUrl('door'),
            },
            requiredItems: ['room_b_key'],
          },
        ],
      },
      {
        id: 'room-b',
        name: '연구실 B - 보관실',
        backgroundUrl: createBackgroundUrl('storage'),
        hotspots: [
          {
            id: 'shelf',
            name: '화학물질 선반',
            position: { x: 10, y: 20, w: 25, h: 50 },
            isSolved: false,
            puzzle: {
              type: 'text',
              question: '선반에 적힌 숫자: 10 - 3 = ?',
              answer: '7',
              hint: '간단한 뺄셈입니다',
              imageUrl: createPuzzleImageUrl('shelf'),
            },
            itemReward: 'final_key',
          },
          {
            id: 'equipment',
            name: '오래된 장비',
            position: { x: 40, y: 40, w: 30, h: 40 },
            isSolved: false,
            puzzle: {
              type: 'code',
              question: '장비에 표시된 숫자: 1234. 이 숫자를 역순으로 입력하세요',
              answer: '4321',
              hint: '숫자를 뒤에서부터 읽으세요',
              imageUrl: createPuzzleImageUrl('equipment'),
            },
          },
          {
            id: 'exit',
            name: '탈출구',
            position: { x: 70, y: 50, w: 25, h: 40 },
            isSolved: false,
            puzzle: {
              type: 'code',
              question: '탈출구에 적힌 최종 암호: "모든 실험을 마치고 탈출하세요"',
              answer: '탈출',
              hint: '모든 퍼즐을 해결하고 탈출 키를 사용하세요',
              imageUrl: createPuzzleImageUrl('exit'),
            },
            requiredItems: ['final_key'],
          },
        ],
      },
    ],
  },
  {
    id: '2',
    slug: 'cursed-mansion',
    title: '저주받은 저택',
    story: '오래된 저택의 저주를 풀어야 합니다',
    difficulty: 'normal',
    backgroundMusic: '/images/cursed_house/black magic.mp3',
    timeLimit: 480,
    subRooms: [
      {
        id: 'main-hall',
        name: '저택 서재',
        backgroundUrl: createBackgroundUrl('mansion'),
        hotspots: [
          {
            id: 'desk',
            name: '오래된 책상',
            position: { x: 30, y: 60, w: 40, h: 30 },
            isSolved: false,
            puzzle: {
              type: 'text',
              question: '책상 위 열린 책에 적힌 글: "LIVE"를 거울처럼 뒤집으면?',
              answer: 'EVIL',
              hint: '거울에 비친 것처럼 뒤집어보세요',
              imageUrl: createPuzzleImageUrl('notebook'),
            },
            itemReward: 'old_key',
          },
          {
            id: 'bookshelf',
            name: '거대한 서제',
            position: { x: 5, y: 10, w: 20, h: 60 },
            isSolved: false,
            puzzle: {
              type: 'code',
              question: '서제에 있는 책들의 제목 첫 글자: A, B, C, D, ? 다음은?',
              answer: 'E',
              hint: '알파벳 순서를 따라가세요',
              imageUrl: createPuzzleImageUrl('bookshelf'),
            },
            itemReward: 'book_clue',
          },
          {
            id: 'clock',
            name: '할아버지 시계',
            position: { x: 70, y: 10, w: 15, h: 50 },
            isSolved: false,
            puzzle: {
              type: 'code',
              question: '시계가 가리키는 시간: 10시 10분. 시침이 가리키는 숫자는?',
              answer: '10',
              hint: '시침이 가리키는 숫자를 보세요',
              imageUrl: createPuzzleImageUrl('clock'),
            },
          },
          {
            id: 'painting',
            name: '초상화',
            position: { x: 85, y: 10, w: 12, h: 25 },
            isSolved: false,
            puzzle: {
              type: 'text',
              question: '초상화 뒤에 숨겨진 숫자: 1867. 이 숫자를 역순으로 입력하세요.',
              answer: '7681',
              hint: '숫자를 뒤에서부터 읽으세요',
              imageUrl: createPuzzleImageUrl('painting'),
            },
            requiredItems: ['old_key'],
          },
        ],
      },
    ],
  },
];

// ============================================================================
// 유틸리티 함수
// ============================================================================

/**
 * 슬러그로 탐험 방을 찾습니다.
 * @param slug - 방의 슬러그
 * @returns 해당하는 탐험 방 또는 undefined
 */
export function getExplorationRoomBySlug(slug: string): ExplorationRoom | undefined {
  return explorationRooms.find(room => room.slug === slug);
}

/**
 * 모든 탐험 방을 가져옵니다.
 * @returns 모든 탐험 방 배열
 */
export function getAllExplorationRooms(): ExplorationRoom[] {
  return [...explorationRooms];
}

/**
 * 난이도별로 탐험 방을 필터링합니다.
 * @param difficulty - 필터링할 난이도
 * @returns 해당 난이도의 탐험 방 배열
 */
export function getExplorationRoomsByDifficulty(difficulty: Difficulty): ExplorationRoom[] {
  return explorationRooms.filter(room => room.difficulty === difficulty);
}
