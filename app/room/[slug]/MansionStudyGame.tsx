'use client';

import { useState, useEffect, useRef } from 'react';
import { ExplorationRoom, InventoryItem } from '@/lib/explorationRoomData';
import PuzzleModal from './PuzzleModal';
import InventoryPanel from './InventoryPanel';
import ClockPuzzle from './ClockPuzzle';

interface MansionStudyGameProps {
  room: ExplorationRoom;
}

// 오브젝트 정의
const OBJECTS = {
  bookshelf: {
    id: 'bookshelf',
    name: '거대한 서재',
    position: { x: 5, y: 10, w: 20, h: 60 },
    puzzles: [
      {
        type: 'code' as const,
        question: '이 서재의 주인은 말보다 구조를, 설명보다 규칙을 남겼다.\n 책의 제목, 책상의 위치, 시계의 움직임, 그리고 서재라는 공간 자체까지.\n 이 방에 존재하는 것들은 각각 숫자로 해석될 수 있는 단서다.\n ● BOOK → 2, DESK → 3, CLOCK → 2, LIBRARY → ?',
        answer: '5',
        hint: '',
        imageUrl: '/images/cursed_house/first_room_book_shelf.png',
      },

    ],
    itemReward: 'key_10',
    requiredItems: [],
  },
  desk: {
    id: 'desk',
    name: '책상',
    position: { x: 30, y: 60, w: 40, h: 30 },
    puzzles: [

      {
        type: 'code' as const,
        question: '●● 책상 위에는\n\n알 수 없는 말들이\n\n마구 적혀 있다.\n\n의미는 없거나,\n\n의미가 뒤집혀 있다.\n\n하지만 그중\n\n유독 눈에 띄는 문장이 있다.\n\n"우리는\n\n우리의 삶을\n\n거꾸로 읽어야 한다."',
        answer: 'EVIL',
        hint: '',
        imageUrl: '/images/cursed_house/first_room_desk.png',
      },
     
    ],
    itemReward: 'key_3',
    requiredItems: [],
  },
  portrait: {
    id: 'portrait',
    name: '초상화',
    position: { x: 85, y: 10, w: 12, h: 25 },
    puzzles: [
      {
        type: 'code' as const,
        question: '●●● 초상화들이\n\n벽에 걸려 있다.\n\n시선이\n\n모두 다른 곳을 향하고 있다.\n\n어쩐지\n\n보고 있는 쪽이\n\n틀린 것 같다.',
        answer: '←↓↑←→↑', // left bottom up left right up
        hint: '',
        imageUrl: '/images/cursed_house/up.png',
      },
    ],
    itemReward: 'key_5',
    requiredItems: [],
  },
  clock: {
    id: 'clock',
    name: '시계',
    position: { x: 70, y: 10, w: 15, h: 50 },
    puzzle: {
      type: 'clock' as const,
      question: '시계를 조절하여 정확한 시간을 맞추세요',
      answer: '1035',
      hint: '시침과 분침을 조절하세요',
      imageUrl: '/images/cursed_house/first_room_clock.png',
    },
    itemReward: 'escape_key',
    requiredItems: ['key_10', 'key_3', 'key_5'],
  },
};

export default function MansionStudyGame({ room }: MansionStudyGameProps) {
  // 게임 상태
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [solvedObjects, setSolvedObjects] = useState<Set<string>>(new Set());
  const [objectPuzzleProgress, setObjectPuzzleProgress] = useState<Record<string, number>>({});
  const [solvedPuzzles, setSolvedPuzzles] = useState<Set<string>>(new Set()); // 오브젝트ID-퍼즐인덱스 형식
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [showClockPuzzle, setShowClockPuzzle] = useState(false);
  const [isEscaped, setIsEscaped] = useState(false);
  const [showEscapePath, setShowEscapePath] = useState(false);
  const [showCompletionScreen, setShowCompletionScreen] = useState(false);
  const [showIntroText, setShowIntroText] = useState(true);
  const [showFailureScreen, setShowFailureScreen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [startTime] = useState<number>(Date.now());
  const [escapeTime, setEscapeTime] = useState<number | null>(null);
  const [timer, setTimer] = useState(room.timeLimit || 600);
  
  // UI 상태
  const [hoveredObject, setHoveredObject] = useState<string | null>(null);
  const [showInventory, setShowInventory] = useState(false);
  const [showBookshelfHint, setShowBookshelfHint] = useState(true);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [mysteriousTexts, setMysteriousTexts] = useState<Array<{ text: string; x: number; y: number; id: number }>>([]);
  const [showTopBar, setShowTopBar] = useState(false);
  const topBarTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const unlockAudioRef = useRef<HTMLAudioElement | null>(null);
  const introScrollRef = useRef<HTMLDivElement | null>(null);

  // 배경 음악 설정
  useEffect(() => {
    audioRef.current = new Audio(room.backgroundMusic);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    // unlock 사운드 설정
    unlockAudioRef.current = new Audio('/images/cursed_house/unlock.mp3');
    unlockAudioRef.current.volume = 0.5;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (unlockAudioRef.current) {
        unlockAudioRef.current.pause();
        unlockAudioRef.current = null;
      }
      if (topBarTimerRef.current) {
        clearTimeout(topBarTimerRef.current);
        topBarTimerRef.current = null;
      }
    };
  }, [room.backgroundMusic]);

  // 타이머
  useEffect(() => {
    if (!isEscaped && !showCompletionScreen && !showIntroText && !showFailureScreen) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isEscaped, showCompletionScreen, showIntroText, showFailureScreen]);

  // 탈출 키 획득 시 탈출 통로 표시
  useEffect(() => {
    if (inventory.some(item => item.id === 'escape_key') && !showEscapePath) {
      const elapsed = Date.now() - startTime;
      setEscapeTime(elapsed);
      setTimeout(() => {
        setShowEscapePath(true);
      }, 500);
    }
  }, [inventory, startTime, showEscapePath]);

  const formatEscapeTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}분 ${seconds}초`;
  };

  const formatRemainingTime = () => {
    const totalSeconds = room.timeLimit || 480; // 8분 = 480초
    const remainingSeconds = timer;
    const usedSeconds = totalSeconds - remainingSeconds;
    const usedMinutes = Math.floor(usedSeconds / 60);
    const usedSecs = usedSeconds % 60;
    return `${usedMinutes}분 ${usedSecs}초`;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timer > 120) return 'text-cyan-400';
    if (timer > 60) return 'text-yellow-400';
    return 'text-red-400 animate-pulse';
  };

  const handleEscapePathClick = () => {
    setShowEscapePath(false);
    setShowCompletionScreen(true);
    setIsEscaped(true);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  // 시간 종료 시 실패 화면 표시
  useEffect(() => {
    if (timer === 0 && !isEscaped && !showCompletionScreen && !showFailureScreen) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setShowFailureScreen(true);
    }
  }, [timer, isEscaped, showCompletionScreen, showFailureScreen]);

  // 인트로 자동 스크롤
  useEffect(() => {
    if (!showIntroText || !introScrollRef.current) return;

    const scrollContainer = introScrollRef.current;
    let scrollPosition = 0;
    const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
    const scrollSpeed = 0.5; // 픽셀/프레임
    const targetDuration = 30000; // 30초 동안 스크롤
    const totalFrames = (targetDuration / 16.67); // 60fps 기준
    const scrollPerFrame = maxScroll / totalFrames;

    let animationFrameId: number;
    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (startTime === null) {
        startTime = currentTime;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / targetDuration, 1);
      
      scrollPosition = maxScroll * progress;
      scrollContainer.scrollTop = scrollPosition;

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    // 약간의 지연 후 시작
    const timeoutId = setTimeout(() => {
      animationFrameId = requestAnimationFrame(animate);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [showIntroText]);

  // 의미심장한 텍스트 표시
  useEffect(() => {
    if (showIntroText || isEscaped) return;
    
    const texts = [
      "시간은 멈추지 않는다",
      "과거는 기억 속에",
      "진실은 그림자 속에",
      "열쇠는 열린 문을 찾는다",
      "시간이 모든 것을 드러낸다",
      "과거의 흔적이 남아있다",
      "진실은 가까이 있다",
      "시간이 답을 알려준다",
    ];
    
    const interval = setInterval(() => {
      const randomText = texts[Math.floor(Math.random() * texts.length)];
      const randomX = Math.random() * 80 + 10; // 10-90%
      const randomY = Math.random() * 80 + 10; // 10-90%
      
      setMysteriousTexts(prev => {
        const newTexts = [...prev, { text: randomText, x: randomX, y: randomY, id: Date.now() }];
        // 최대 3개까지만 표시
        return newTexts.slice(-3);
      });
      
      // 5초 후 제거
      setTimeout(() => {
        setMysteriousTexts(prev => prev.slice(1));
      }, 5000);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [showIntroText, isEscaped]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.log('Audio play failed:', err));
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  const handleObjectClick = (objectId: string) => {
    const obj = OBJECTS[objectId as keyof typeof OBJECTS];
    if (!obj) return;

    // 이미 모든 문제를 해결한 오브젝트는 다시 열 수 있지만 제출은 불가
    // (문제는 다시 볼 수 있게 함)

    // 필요한 아이템 확인
    if (obj.requiredItems.length > 0) {
      const hasAllItems = obj.requiredItems.every(itemId =>
        inventory.some(inv => inv.id === itemId)
      );
      if (!hasAllItems) {
        const missingItems = obj.requiredItems
          .filter(itemId => !inventory.some(inv => inv.id === itemId))
          .map(itemId => {
            const itemNames: { [key: string]: string } = {
              key_10: '10 열쇠',
              key_3: '3 열쇠',
              key_5: '5 열쇠',
              escape_key: '탈출 열쇠',
            };
            return itemNames[itemId] || itemId;
          });
        setNotification({
          message: `이 오브젝트를 조사하려면 필요한 아이템이 있습니다: ${missingItems.join(', ')}`,
          type: 'error',
        });
        setTimeout(() => setNotification(null), 3000);
        return;
      }
    }

    // 시계는 탈출 열쇠가 있으면 탈출 화면 표시
    if (objectId === 'clock' && inventory.some(item => item.id === 'escape_key')) {
      const elapsed = Date.now() - startTime;
      setEscapeTime(elapsed);
      setShowEscapePath(true);
      setIsEscaped(true);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      return;
    }

    // 이미 해결한 오브젝트는 문제를 다시 볼 수 있게
    if (solvedObjects.has(objectId) && objectId !== 'clock') {
      setSelectedObject(objectId);
      setShowPuzzle(true);
      return;
    }

    // 70% 확률로 문제 발견
    const foundPuzzle = Math.random() < 0.7;

    if (foundPuzzle) {
      setSelectedObject(objectId);
      // 시계는 별도의 UI 사용
      if (objectId === 'clock') {
        setShowClockPuzzle(true);
      } else {
        setShowPuzzle(true);
      }
      setShowBookshelfHint(false);
    } else {
      // 문제를 발견하지 못했을 때 - 20초 감소
      setTimer(prev => Math.max(0, prev - 20));
      setNotification({
        message: `${obj.name}을(를) 조사했지만 아무것도 찾지 못했습니다. 20초가 감소했습니다.`,
        type: 'error',
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleHintUsed = () => {
    setTimer(prev => Math.max(0, prev - 60)); // 1분 감소
    setNotification({
      message: '힌트를 사용하여 1분이 감소했습니다.',
      type: 'error',
    });
    setTimeout(() => setNotification(null), 2000);
  };

  const handleWrongAnswer = () => {
    setTimer(prev => Math.max(0, prev - 30)); // 30초 감소
    setNotification({
      message: '오답으로 인해 30초가 감소했습니다.',
      type: 'error',
    });
    setTimeout(() => setNotification(null), 2000);
  };

  const handlePuzzleSolve = (hotspotId: string, itemReward?: string) => {
    const obj = OBJECTS[hotspotId as keyof typeof OBJECTS];
    if (!obj) return;

    // 시계는 바로 아이템 획득
    if (hotspotId === 'clock') {
      setSolvedObjects(prev => new Set([...prev, hotspotId]));
      setShowClockPuzzle(false);
      setSelectedObject(null);
      
      // unlock 사운드 재생
      if (unlockAudioRef.current) {
        unlockAudioRef.current.currentTime = 0;
        unlockAudioRef.current.play().catch(err => console.log('Unlock audio play failed:', err));
      }
      
      // 시계 문제지를 인벤토리에 추가
      const clockPuzzleKey = `${hotspotId}-0`;
      if ('puzzle' in obj) {
        setInventory(prev => {
          const existingIndex = prev.findIndex(item => item.id === clockPuzzleKey);
          if (existingIndex === -1) {
            return [
              ...prev,
              { id: clockPuzzleKey, name: obj.puzzle.question, icon: 'ri-file-text-line' }
            ];
          }
          return prev;
        });
      }
      
      if (itemReward) {
        const itemNames: { [key: string]: string } = {
          escape_key: '탈출 열쇠',
        };
        setInventory(prev => [
          ...prev,
          { id: itemReward, name: itemNames[itemReward] || itemReward, icon: 'ri-key-line' }
        ]);
        setNotification({
          message: `아이템 획득: ${itemNames[itemReward] || itemReward}`,
          type: 'success',
        });
        setTimeout(() => setNotification(null), 2000);
      }
      return;
    }

    // 다른 오브젝트는 puzzles 배열 사용
    if ('puzzles' in obj) {
      const currentProgress = objectPuzzleProgress[hotspotId] || 0;
      const puzzleKey = `${hotspotId}-${currentProgress}`;
      
      // 현재 퍼즐을 해결된 것으로 표시
      setSolvedPuzzles(prev => new Set([...prev, puzzleKey]));
      
      // unlock 사운드 재생
      if (unlockAudioRef.current) {
        unlockAudioRef.current.currentTime = 0;
        unlockAudioRef.current.play().catch(err => console.log('Unlock audio play failed:', err));
      }
      
      // 문제지를 인벤토리에 추가
      const currentPuzzle = obj.puzzles[currentProgress];
      const puzzlePaperName = currentPuzzle.question; // 문제 내용을 직접 사용
      setInventory(prev => {
        // 이미 같은 문제지가 있는지 확인
        const existingIndex = prev.findIndex(item => item.id === puzzleKey);
        if (existingIndex === -1) {
          return [
            ...prev,
            { id: puzzleKey, name: puzzlePaperName, icon: 'ri-file-text-line' }
          ];
        }
        return prev;
      });
      
      const nextProgress = currentProgress + 1;

      // 다음 퍼즐로 진행
      if (nextProgress < obj.puzzles.length) {
        setObjectPuzzleProgress(prev => ({
          ...prev,
          [hotspotId]: nextProgress
        }));
        setNotification({
          message: `문제 ${currentProgress + 1}/${obj.puzzles.length} 해결! 다음 문제로 진행합니다.`,
          type: 'success',
        });
        setTimeout(() => setNotification(null), 2000);
        // 모달은 열어두고 다음 문제 표시
      } else {
        // 모든 퍼즐 완료 - 아이템 획득
        setSolvedObjects(prev => new Set([...prev, hotspotId]));
        setObjectPuzzleProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[hotspotId];
          return newProgress;
        });
        
        if (itemReward) {
          const itemNames: { [key: string]: string } = {
            key_10: '10 열쇠',
            key_3: '3 열쇠',
            key_5: '5 열쇠',
          };
          setInventory(prev => [
            ...prev,
            { id: itemReward, name: itemNames[itemReward] || itemReward, icon: 'ri-key-line' }
          ]);
          setNotification({
            message: `문제를 해결했습니다! 아이템 획득: ${itemNames[itemReward] || itemReward}`,
            type: 'success',
          });
          setTimeout(() => setNotification(null), 3000);
        }
        setShowPuzzle(false);
        setSelectedObject(null);
      }
    }
  };


  const closeModal = () => {
    setShowPuzzle(false);
    setShowClockPuzzle(false);
    setSelectedObject(null);
  };

  const handleClockSolve = (time: string) => {
    const correctAnswer = '1035';
    if (time === correctAnswer) {
      handlePuzzleSolve('clock', 'escape_key');
      setShowClockPuzzle(false);
    } else {
      setNotification({
        message: '잘못된 시간입니다. 다시 시도해보세요.',
        type: 'error',
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const currentSubRoom = room.subRooms[0];
  const backgroundUrl = currentSubRoom.backgroundUrl;

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-slate-950"
    >
      {/* 배경 이미지 */}
      <div className="absolute inset-0">
        <img
          src={backgroundUrl}
          alt="저택 서재"
          className="w-full h-full object-cover select-none"
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />
      </div>

      {/* 입장 텍스트 */}
      {showIntroText && (
        <div 
          className="absolute inset-0 z-40 bg-black/40 backdrop-blur-sm cursor-pointer overflow-hidden"
          onClick={() => setShowIntroText(false)}
        >
          <div className="relative w-full h-full">
            {/* 스크롤되는 텍스트들 */}
            <div 
              ref={introScrollRef}
              className="absolute inset-0 overflow-y-auto scroll-smooth"
            >
              <div className="min-h-[200vh] flex flex-col items-center justify-end pb-[100vh]">
                <div className="max-w-4xl mx-auto px-6 text-center space-y-6 md:space-y-8">
                </div>
              </div>
            </div>
            
            {/* 가운데 고정된 시작 텍스트 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-lg md:text-xl text-cyan-300/90 animate-pulse font-medium drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                화면을 클릭하여 시작하세요
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 상단 호버 감지 영역 (데스크톱만) */}
      <div
        className="hidden md:block absolute top-0 left-0 right-0 h-20 z-30"
        onMouseEnter={() => {
          if (topBarTimerRef.current) {
            clearTimeout(topBarTimerRef.current);
            topBarTimerRef.current = null;
          }
          setShowTopBar(true);
        }}
        onMouseLeave={() => {
          topBarTimerRef.current = setTimeout(() => {
            setShowTopBar(false);
            topBarTimerRef.current = null;
          }, 2000);
        }}
      />

      {/* 상단 바 */}
      {!showIntroText && (
        <div className={`absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/80 to-transparent p-2 md:p-4 transition-opacity duration-300 md:transition-opacity ${
          showTopBar ? 'opacity-100' : 'opacity-100 md:opacity-0 pointer-events-auto md:pointer-events-none'
        }`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 md:gap-4 min-w-0">
              <div className="min-w-0">
                <h1 className="text-base md:text-2xl font-bold text-white truncate">{room.title}</h1>
                <p className="text-xs md:text-sm text-cyan-300 truncate">{currentSubRoom.name}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 인벤토리와 소리 버튼 (항상 표시, 인트로 제외) */}
      {!showIntroText && (
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2 pointer-events-auto">
          <button
            onClick={toggleMusic}
            className="w-12 h-12 flex items-center justify-center bg-black/80 hover:bg-black/90 backdrop-blur-md rounded-lg transition-all border-2 border-cyan-400/50 shadow-lg shadow-cyan-400/20"
          >
            <i className={`${isMusicPlaying ? 'ri-volume-up-line' : 'ri-volume-mute-line'} text-2xl text-cyan-400`}></i>
          </button>

          <button
            onClick={() => setShowInventory(!showInventory)}
            className="relative px-5 py-2.5 bg-black/80 hover:bg-black/90 backdrop-blur-md rounded-lg transition-all border-2 border-cyan-400/50 shadow-lg shadow-cyan-400/20"
          >
            <div className="flex items-center gap-2">
              <i className="ri-briefcase-line text-cyan-400 text-lg"></i>
              <span className="text-white text-base font-medium">인벤토리</span>
              {inventory.length > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                  {inventory.length}
                </span>
              )}
            </div>
          </button>
        </div>
      )}

      {/* 가운데 타이머 (항상 표시) */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none">
        <div className={`px-3 md:px-6 py-1.5 md:py-3 bg-black/60 backdrop-blur-sm rounded-lg border-2 ${timer <= 60 ? 'border-red-500' : 'border-cyan-500/50'}`}>
          <div className="flex items-center gap-1.5 md:gap-3">
            <i className={`ri-timer-line text-lg md:text-2xl ${getTimerColor()}`}></i>
            <div className="hidden md:block">
              <div className="text-xs text-white/70">남은 시간</div>
              <div className={`text-2xl font-bold font-mono ${getTimerColor()}`}>
                {formatTime(timer)}
              </div>
            </div>
            <div className="md:hidden">
              <div className={`text-base font-bold font-mono ${getTimerColor()}`}>
                {formatTime(timer)}
              </div>
            </div>
          </div>
        </div>
      </div>

  
      {/* 의미심장한 텍스트들 */}
      {mysteriousTexts.map((item) => (
        <div
          key={item.id}
          className="absolute z-15 pointer-events-none animate-fade-in"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
          }}
        >
          <p className="text-amber-300/40 text-xs md:text-sm italic font-serif drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            "{item.text}"
          </p>
        </div>
      ))}

      {/* 클릭 가능한 오브젝트 */}
      <div className="absolute inset-0 z-10">
        {Object.values(OBJECTS).map((obj) => {
          const hasRequiredItems = obj.requiredItems.length === 0 || 
            obj.requiredItems.every(itemId => inventory.some(inv => inv.id === itemId));
          const isSolved = solvedObjects.has(obj.id);
          const hasEscapeKey = inventory.some(item => item.id === 'escape_key');
          const isClockGlowing = obj.id === 'clock' && hasEscapeKey;

          return (
            <button
              key={obj.id}
              onClick={() => handleObjectClick(obj.id)}
              onMouseEnter={() => setHoveredObject(obj.id)}
              onMouseLeave={() => setHoveredObject(null)}
              disabled={!hasRequiredItems || (isSolved && obj.id !== 'clock')}
              className={`absolute cursor-pointer transition-all duration-300 ${
                isSolved && obj.id !== 'clock' ? 'opacity-50' : 'opacity-100'
              } ${isClockGlowing ? 'animate-pulse' : ''}`}
              style={{
                left: `${obj.position.x}%`,
                top: `${obj.position.y}%`,
                width: `${obj.position.w}%`,
                height: `${obj.position.h}%`
              }}
            >
              <div className="w-full h-full">
                {hoveredObject === obj.id && (
                  <div className={`absolute left-1/2 transform -translate-x-1/2 pointer-events-none z-50 ${
                    'top-0 -translate-y-full mb-2'
                  }`}>
                    <div className={`px-3 md:px-4 py-1.5 md:py-2 bg-black/90 backdrop-blur-md rounded-lg border ${
                      isSolved ? 'border-green-400/70' : 'border-cyan-400/70'
                    } shadow-lg whitespace-nowrap`}>
                      <div className="flex items-center gap-2">
                        {isSolved ? (
                          <>
                            <i className="ri-check-line text-green-400 text-sm md:text-base"></i>
                            <span className="text-white font-medium text-xs md:text-sm">
                              {obj.name} (완료)
                            </span>
                          </>
                        ) : (
                          <>
                            <i className="ri-search-line text-cyan-400 text-sm md:text-base"></i>
                            <span className="text-white font-medium text-xs md:text-sm">
                              {obj.name}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className={`absolute left-1/2 transform -translate-x-1/2 w-0 h-0 ${
                      obj.id === 'portrait' || obj.id === 'bookshelf'
                        ? 'top-full border-l-4 border-r-4 border-t-4 border-transparent border-t-cyan-400/70'
                        : 'top-full border-l-4 border-r-4 border-t-4 border-transparent border-t-cyan-400/70'
                    }`}></div>
                  </div>
                )}
                {!hoveredObject && !isSolved && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className={`w-3 h-3 rounded-full animate-ping ${
                      isClockGlowing ? 'bg-amber-400/80' : 'bg-cyan-400/60'
                    }`}></div>
                    <div className={`absolute w-3 h-3 rounded-full ${
                      isClockGlowing ? 'bg-amber-400/90' : 'bg-cyan-400/80'
                    }`}></div>
                  </div>
                )}
                {isClockGlowing && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-amber-400/20 rounded-full animate-pulse blur-xl"></div>
                    <div className="absolute inset-0 bg-amber-300/10 rounded-full animate-pulse blur-2xl"></div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* 퍼즐 모달 */}
      {showPuzzle && selectedObject && (() => {
        const obj = OBJECTS[selectedObject as keyof typeof OBJECTS];
        if (!obj || !('puzzles' in obj)) return null;
        
        const currentProgress = objectPuzzleProgress[selectedObject] || 0;
        const currentPuzzle = obj.puzzles[currentProgress];
        const puzzleKey = `${selectedObject}-${currentProgress}`;
        const isPuzzleSolved = solvedPuzzles.has(puzzleKey);
        
        return (
          <PuzzleModal
            hotspot={{
              id: selectedObject,
              name: obj.name,
              position: obj.position,
              isSolved: solvedObjects.has(selectedObject),
              puzzle: currentPuzzle,
              itemReward: obj.itemReward,
              requiredItems: obj.requiredItems,
            }}
            onSolve={handlePuzzleSolve}
            onClose={closeModal}
            onHintUsed={handleHintUsed}
            onWrongAnswer={handleWrongAnswer}
            isSolved={isPuzzleSolved}
          />
        );
      })()}

      {/* 시계 퍼즐 */}
      {showClockPuzzle && (
        <ClockPuzzle
          onSolve={handleClockSolve}
          onClose={closeModal}
        />
      )}

      {/* 인벤토리 패널 */}
      {showInventory && (
        <InventoryPanel
          items={inventory}
          onClose={() => setShowInventory(false)}
        />
      )}

      {/* 알림 */}
      {notification && (
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow-lg backdrop-blur-md border-2 ${
          notification.type === 'error'
            ? 'bg-red-900/80 border-red-500/50 text-red-100'
            : 'bg-green-900/80 border-green-500/50 text-green-100'
        } animate-slide-down`}>
          <div className="flex items-center gap-3">
            <i className={`${notification.type === 'error' ? 'ri-error-warning-line' : 'ri-checkbox-circle-line'} text-xl`}></i>
            <p className="font-medium">{notification.message}</p>
          </div>
        </div>
      )}

      {/* 탈출 성공 */}
      {isEscaped && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="max-w-3xl w-full bg-gradient-to-br from-cyan-900/50 to-blue-900/50 rounded-2xl border-2 border-cyan-400/50 shadow-2xl p-6 md:p-8">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full">
                <i className="ri-trophy-line text-4xl text-white"></i>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">탈출 성공!</h2>
              <p className="text-xl text-cyan-300 mb-6">
                책장이 열리며 탈출 통로가 나타났습니다.
              </p>
              <div className="relative w-full h-64 bg-slate-900 rounded-lg overflow-hidden">
                <img
                  src="/images/cursed_house/first_room_escape.png"
                  alt="탈출 통로"
                  className="w-full h-full object-cover animate-fade-in"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center">
                  <div className="text-center">
                    <i className="ri-door-open-line text-6xl text-cyan-400 mb-4"></i>
                    <p className="text-white text-xl">탈출 통로</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-cyan-400/30">
                <p className="text-cyan-300 text-lg font-semibold mb-2">
                  탈출 시간
                </p>
                <p className="text-white text-2xl font-bold">
                  8분 - {formatTime(timer)} = {formatRemainingTime()}
                </p>
                <p className="text-white/70 text-sm mt-2">
                  축하합니다! 저택의 저주를 풀었습니다.
                </p>
              </div>
              <button
                onClick={() => window.location.href = '/'}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all"
              >
                메인으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 실패 화면 */}
      {showFailureScreen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="max-w-3xl w-full bg-gradient-to-br from-red-900/50 to-orange-900/50 rounded-2xl border-2 border-red-400/50 shadow-2xl p-6 md:p-8">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-red-500 to-orange-500 rounded-full">
                <i className="ri-time-line text-4xl text-white"></i>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">실패했습니다</h2>
              <p className="text-xl text-red-300 mb-6">
                시간이 모두 소진되었습니다.
              </p>
              <div className="bg-white/5 rounded-lg p-4 border border-red-400/30">
                <p className="text-red-300 text-lg font-semibold mb-2">
                  남은 시간
                </p>
                <p className="text-white text-2xl font-bold">
                  {formatTime(timer)}
                </p>
                <p className="text-white/70 text-sm mt-2">
                  다시 도전해보세요!
                </p>
              </div>
              <button
                onClick={() => window.location.href = '/'}
                className="px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all"
              >
                메인으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

<style jsx global>{`
  @keyframes credits-scroll {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(-200vh);
    }
  }
  .animate-credits-scroll {
    animation: credits-scroll 50s linear;
    animation-fill-mode: forwards;
  }
  @keyframes slide-up-intro {
    from {
      opacity: 0;
      transform: translateY(50px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-slide-up-intro {
    animation: slide-up-intro 1s ease-out forwards;
    opacity: 0;
  }
`}</style>

