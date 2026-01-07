'use client';

import { useState, useEffect, useRef } from 'react';
import { ExplorationRoom, Hotspot, InventoryItem } from '@/lib/explorationRoomData';
import PuzzleModal from './PuzzleModal';
import InventoryPanel from './InventoryPanel';

interface ExplorationGameProps {
  room: ExplorationRoom;
}

// 자동 리다이렉트 컴포넌트
function AutoRedirect({ delay }: { delay: number }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = '/';
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return null;
}

export default function ExplorationGame({ room }: ExplorationGameProps) {
  const [currentSubRoomIndex, setCurrentSubRoomIndex] = useState(0);
  const currentSubRoom = room.subRooms[currentSubRoomIndex];
  // 모든 서브룸의 hotspot 상태를 추적
  const [allHotspots, setAllHotspots] = useState<Record<string, Hotspot[]>>(() => {
    const initial: Record<string, Hotspot[]> = {};
    room.subRooms.forEach((subRoom, index) => {
      initial[index] = [...subRoom.hotspots];
    });
    return initial;
  });
  const [hotspots, setHotspots] = useState<Hotspot[]>(allHotspots[currentSubRoomIndex] || currentSubRoom.hotspots);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const [showInventory, setShowInventory] = useState(false);
  const [timer, setTimer] = useState(room.timeLimit || 600);
  const [isComplete, setIsComplete] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showEscapeAnimation, setShowEscapeAnimation] = useState(false);
  const [showCompletionScreen, setShowCompletionScreen] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.3);
  const [notification, setNotification] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showTopBar, setShowTopBar] = useState(false);
  const topBarTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(room.backgroundMusic);
    audioRef.current.loop = true;
    audioRef.current.volume = musicVolume;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      // 타이머 정리
      if (topBarTimerRef.current) {
        clearTimeout(topBarTimerRef.current);
        topBarTimerRef.current = null;
      }
    };
  }, [room.backgroundMusic, musicVolume]);

  useEffect(() => {
    if (!isComplete && !isGameOver) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setIsGameOver(true);
            if (audioRef.current) {
              audioRef.current.pause();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isComplete, isGameOver]);

  useEffect(() => {
    const allSolved = hotspots.every(h => h.isSolved);
    if (allSolved && hotspots.length > 0 && !isGameOver && !isTransitioning) {
      // 마지막 서브룸인지 확인
      if (currentSubRoomIndex === room.subRooms.length - 1) {
        // 마지막 서브룸 클리어 = 탈출 성공
        // 탈출 애니메이션 시작
        setShowEscapeAnimation(true);
        if (audioRef.current) {
          audioRef.current.pause();
        }
        // 3초 후 완료 화면 표시
        setTimeout(() => {
          setShowEscapeAnimation(false);
          setShowCompletionScreen(true);
          setIsComplete(true);
        }, 3000);
      } else {
        // 다음 서브룸으로 이동
        setIsTransitioning(true);
        setNotification({
          message: `${currentSubRoom.name} 클리어! 다음 방으로 이동합니다...`,
          type: 'success',
        });
        setTimeout(() => {
          setCurrentSubRoomIndex(prev => prev + 1);
          setIsTransitioning(false);
          setNotification(null);
        }, 2000);
      }
    }
  }, [hotspots, isGameOver, currentSubRoomIndex, room.subRooms.length, currentSubRoom.name, isTransitioning]);

  // 서브룸이 변경되면 hotspots 업데이트 (저장된 상태 사용)
  useEffect(() => {
    if (allHotspots[currentSubRoomIndex]) {
      setHotspots(allHotspots[currentSubRoomIndex]);
    } else {
      const newSubRoom = room.subRooms[currentSubRoomIndex];
      setHotspots(newSubRoom.hotspots);
      setAllHotspots(prev => ({
        ...prev,
        [currentSubRoomIndex]: [...newSubRoom.hotspots]
      }));
    }
    setSelectedHotspot(null);
    setHoveredHotspot(null);
  }, [currentSubRoomIndex, room.subRooms, allHotspots]);

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

  const handleHotspotClick = (hotspot: Hotspot) => {
    if (isGameOver) return;
    
    // 이미 해결한 hotspot은 더 이상 조사할 수 없음
    if (hotspot.isSolved) {
      setNotification({
        message: `${hotspot.name}은(는) 이미 조사해서 더 이상 얻을 것이 없습니다.`,
        type: 'error',
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    
    if (hotspot.requiredItems && hotspot.requiredItems.length > 0) {
      const hasAllItems = hotspot.requiredItems.every(itemId =>
        inventory.some(inv => inv.id === itemId)
      );
      if (!hasAllItems) {
        const missingItems = hotspot.requiredItems
          .filter(itemId => !inventory.some(inv => inv.id === itemId))
          .map(itemId => {
            const itemNames: { [key: string]: string } = {
              key1: '연구실 열쇠',
              mirror_key: '거울 열쇠',
              old_key: '오래된 열쇠',
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
    
    // 70% 확률로 문제 발견
    const foundPuzzle = Math.random() < 0.7;
    
    if (foundPuzzle) {
      setSelectedHotspot(hotspot);
    } else {
      // 문제를 발견하지 못했을 때 20초 차감
      setTimer(prev => Math.max(0, prev - 20));
      setNotification({
        message: `${hotspot.name}을(를) 조사했지만 아무것도 찾지 못했습니다. 시간이 20초 감소했습니다.`,
        type: 'error',
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handlePuzzleSolve = (hotspotId: string, itemReward?: string) => {
    // 현재 서브룸의 hotspot 업데이트
    setHotspots(prev =>
      prev.map(h =>
        h.id === hotspotId ? { ...h, isSolved: true } : h
      )
    );
    // 모든 서브룸의 hotspot 상태도 업데이트
    setAllHotspots(prev => ({
      ...prev,
      [currentSubRoomIndex]: prev[currentSubRoomIndex].map(h =>
        h.id === hotspotId ? { ...h, isSolved: true } : h
      )
    }));

    if (itemReward) {
      const itemNames: { [key: string]: string } = {
        key1: '연구실 열쇠',
        room_b_key: '연구실 B 열쇠',
        final_key: '탈출 열쇠',
        document: '기밀 문서',
        blueprint: '설계도',
        final_code: '최종 코드',
        mirror_key: '거울 열쇠',
        music_box: '오르골'
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

    setSelectedHotspot(null);
  };

  const handleCloseModal = () => {
    setSelectedHotspot(null);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <div className="absolute inset-0">
        <img
          src={currentSubRoom.backgroundUrl}
          alt={currentSubRoom.name}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            // 배경 이미지 로딩 실패 시 대체 배경 표시
            const parent = target.parentElement;
            if (parent && !parent.querySelector('.bg-fallback')) {
              const fallback = document.createElement('div');
              fallback.className = 'bg-fallback absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900';
              parent.appendChild(fallback);
            }
          }}
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* 상단 호버 감지 영역 */}
      <div
        className="absolute top-0 left-0 right-0 h-20 z-30"
        onMouseEnter={() => {
          // 타이머가 있으면 취소
          if (topBarTimerRef.current) {
            clearTimeout(topBarTimerRef.current);
            topBarTimerRef.current = null;
          }
          // 즉시 표시
          setShowTopBar(true);
        }}
        onMouseLeave={() => {
          // 2초 후에 숨김
          topBarTimerRef.current = setTimeout(() => {
            setShowTopBar(false);
            topBarTimerRef.current = null;
          }, 2000);
        }}
      />

      {/* 상단 바 */}
      <div className={`absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/80 to-transparent p-2 md:p-4 transition-opacity duration-300 ${
        showTopBar ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-4 min-w-0">
            <button
              onClick={() => window.history.back()}
              className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm flex-shrink-0"
            >
              <i className="ri-arrow-left-line text-lg md:text-xl text-white"></i>
            </button>
            <div className="min-w-0">
              <h1 className="text-base md:text-2xl font-bold text-white truncate">{room.title}</h1>
              <div className="flex items-center gap-2">
                <p className="text-xs md:text-sm text-cyan-300 truncate hidden sm:block">{room.story}</p>
                <span className="text-xs md:text-sm text-yellow-400 font-semibold">
                  {currentSubRoom.name} ({currentSubRoomIndex + 1}/{room.subRooms.length})
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 md:gap-3 flex-shrink-0">
            <button
              onClick={toggleMusic}
              className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-colors"
            >
              <i className={`${isMusicPlaying ? 'ri-volume-up-line' : 'ri-volume-mute-line'} text-lg md:text-xl text-cyan-400`}></i>
            </button>

            <button
              onClick={() => setShowInventory(!showInventory)}
              className="relative px-2 md:px-4 py-1.5 md:py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-colors whitespace-nowrap"
            >
              <div className="flex items-center gap-1.5 md:gap-2">
                <i className="ri-briefcase-line text-cyan-400 text-lg md:text-base"></i>
                <span className="text-white text-xs md:text-base hidden sm:inline">인벤토리</span>
                {inventory.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-cyan-500 text-white text-xs rounded-full flex items-center justify-center">
                    {inventory.length}
                  </span>
                )}
              </div>
            </button>

            <button
              onClick={() => setShowDebug(!showDebug)}
              className="hidden md:block px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-colors whitespace-nowrap"
            >
              <span className="text-white text-sm">디버그</span>
            </button>
          </div>
        </div>
      </div>

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

      <div className="absolute inset-0 z-10">
        {hotspots.map(hotspot => (
          <button
            key={hotspot.id}
            onClick={() => handleHotspotClick(hotspot)}
            onMouseEnter={() => setHoveredHotspot(hotspot.id)}
            onMouseLeave={() => setHoveredHotspot(null)}
            className={`absolute cursor-pointer transition-all duration-300 ${
              hotspot.isSolved ? 'opacity-50' : 'opacity-100'
            }`}
            style={{
              left: `${hotspot.position.x}%`,
              top: `${hotspot.position.y}%`,
              width: `${hotspot.position.w}%`,
              height: `${hotspot.position.h}%`
            }}
            disabled={isGameOver || hotspot.isSolved}
            title={hotspot.name}
          >
            <div className="w-full h-full">
              {hoveredHotspot === hotspot.id && !showDebug && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-2 pointer-events-none z-50">
                  <div className={`px-3 md:px-4 py-1.5 md:py-2 bg-black/90 backdrop-blur-md rounded-lg border ${
                    hotspot.isSolved ? 'border-green-400/70' : 'border-cyan-400/70'
                  } shadow-lg whitespace-nowrap`}>
                    <div className="flex items-center gap-2">
                      {hotspot.isSolved ? (
                        <>
                          <i className="ri-check-line text-green-400 text-sm md:text-base"></i>
                          <span className="text-white font-medium text-xs md:text-sm">
                            {hotspot.name} (완료)
                          </span>
                        </>
                      ) : (
                        <>
                          <i className="ri-search-line text-cyan-400 text-sm md:text-base"></i>
                          <span className="text-white font-medium text-xs md:text-sm">
                            {hotspot.name}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-cyan-400/70"></div>
                </div>
              )}
              {showDebug && (
                <>
                  <div className={`w-full h-full rounded-lg ${
                    hotspot.isSolved
                      ? 'bg-green-500/50 border-4 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.6)]'
                      : 'bg-cyan-500/50 border-4 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.6)]'
                  }`}>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="px-3 md:px-5 py-2 md:py-3 bg-black/95 backdrop-blur-md rounded-lg border-2 border-cyan-400/70 shadow-lg">
                        <div className="flex flex-col items-center gap-1 md:gap-2">
                          <div className="flex items-center gap-2 md:gap-3">
                            <span className="text-white font-bold whitespace-nowrap text-sm md:text-base">
                              {hotspot.name}
                            </span>
                          </div>
                          <div className="text-xs text-gray-200 font-mono space-y-0.5 text-center bg-black/60 px-2 py-1 rounded mt-1">
                            <div className="text-yellow-400 font-bold">디버그 정보</div>
                            <div>위치: ({hotspot.position.x}%, {hotspot.position.y}%)</div>
                            <div>크기: {hotspot.position.w}% × {hotspot.position.h}%</div>
                            <div className="text-cyan-400">ID: {hotspot.id}</div>
                            <div className="text-xs text-gray-400">타입: {hotspot.puzzle.type}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-0 left-0 bg-cyan-500/90 text-black text-[10px] font-bold px-1 rounded-br pointer-events-none">
                      {hotspot.position.x}%, {hotspot.position.y}%
                    </div>
                    <div className="absolute bottom-0 right-0 bg-cyan-500/90 text-black text-[10px] font-bold px-1 rounded-tl pointer-events-none">
                      {hotspot.position.w}% × {hotspot.position.h}%
                    </div>
                  </div>
                </>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/80 to-transparent p-2 md:p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 md:gap-0">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-white/70 text-xs md:text-base">진행률:</span>
              <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                <div className="w-32 sm:w-48 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                    style={{
                      width: `${(() => {
                        // 모든 서브룸의 총 hotspot 수
                        const totalHotspots = room.subRooms.reduce((total, subRoom) => total + subRoom.hotspots.length, 0);
                        // 모든 서브룸의 해결된 hotspot 수
                        const solvedHotspots = Object.values(allHotspots).reduce((total, subRoomHotspots) => 
                          total + subRoomHotspots.filter(h => h.isSolved).length, 0
                        );
                        return totalHotspots > 0 ? (solvedHotspots / totalHotspots) * 100 : 0;
                      })()}%`
                    }}
                  />
                </div>
                <span className="text-white font-mono text-xs md:text-base">
                  {(() => {
                    const totalHotspots = room.subRooms.reduce((total, subRoom) => total + subRoom.hotspots.length, 0);
                    const solvedHotspots = Object.values(allHotspots).reduce((total, subRoomHotspots) => 
                      total + subRoomHotspots.filter(h => h.isSolved).length, 0
                    );
                    return `${solvedHotspots}/${totalHotspots}`;
                  })()} - 방 {currentSubRoomIndex + 1}/{room.subRooms.length}
                </span>
              </div>
            </div>

            <div className="text-xs md:text-sm text-white/70 text-center sm:text-right">
              마우스를 움직여 상호작용 가능한 오브젝트를 찾으세요
            </div>
          </div>
        </div>
      </div>

      {selectedHotspot && !isGameOver && (
        <PuzzleModal
          hotspot={selectedHotspot}
          onSolve={handlePuzzleSolve}
          onClose={handleCloseModal}
        />
      )}

      {showInventory && (
        <InventoryPanel
          items={inventory}
          onClose={() => setShowInventory(false)}
        />
      )}

      {isTransitioning && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full animate-pulse">
              <i className="ri-door-open-line text-4xl text-white"></i>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">다음 방으로 이동 중...</h2>
            <p className="text-cyan-300">{currentSubRoom.name} 클리어!</p>
            <p className="text-gray-400 mt-2">방 {currentSubRoomIndex + 1}/{room.subRooms.length} 완료</p>
          </div>
        </div>
      )}

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

      {/* 탈출 애니메이션 */}
      {showEscapeAnimation && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* 탈출 길 SVG 애니메이션 */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 800 600"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* 배경 */}
              <rect width="800" height="600" fill="rgba(15, 23, 42, 0.8)" />
              
              {/* 탈출 길 경로 */}
              <path
                d="M 100 300 Q 200 200, 300 250 T 500 200 T 700 250"
                fill="none"
                stroke="url(#escapeGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="1000"
                strokeDashoffset="1000"
                className="animate-escape-path"
              />
              
              {/* 시작점 (방) */}
              <circle
                cx="100"
                cy="300"
                r="30"
                fill="rgba(34, 211, 238, 0.3)"
                stroke="rgb(34, 211, 238)"
                strokeWidth="3"
                className="animate-fade-in"
              >
                <animate
                  attributeName="r"
                  values="30;35;30"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </circle>
              <text
                x="100"
                y="305"
                textAnchor="middle"
                fill="rgb(34, 211, 238)"
                fontSize="20"
                fontWeight="bold"
                className="animate-fade-in"
              >
                시작
              </text>
              
              {/* 중간 지점들 */}
              {[300, 500].map((x, i) => (
                <g key={i} className="animate-fade-in" style={{ animationDelay: `${(i + 1) * 0.5}s` }}>
                  <circle
                    cx={x}
                    cy={i % 2 === 0 ? 250 : 200}
                    r="20"
                    fill="rgba(59, 130, 246, 0.3)"
                    stroke="rgb(59, 130, 246)"
                    strokeWidth="2"
                  />
                </g>
              ))}
              
              {/* 종료점 (탈출구) */}
              <g className="animate-fade-in" style={{ animationDelay: '2s' }}>
                <circle
                  cx="700"
                  cy="250"
                  r="40"
                  fill="rgba(34, 197, 94, 0.3)"
                  stroke="rgb(34, 197, 94)"
                  strokeWidth="4"
                >
                  <animate
                    attributeName="r"
                    values="40;50;40"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </circle>
                <text
                  x="700"
                  y="255"
                  textAnchor="middle"
                  fill="rgb(34, 197, 94)"
                  fontSize="24"
                  fontWeight="bold"
                >
                  탈출!
                </text>
              </g>
              
              {/* 그라디언트 정의 */}
              <defs>
                <linearGradient id="escapeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgb(34, 211, 238)" />
                  <stop offset="50%" stopColor="rgb(59, 130, 246)" />
                  <stop offset="100%" stopColor="rgb(34, 197, 94)" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* 텍스트 오버레이 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center animate-fade-in">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-slide-up">
                  탈출 경로 발견!
                </h2>
                <p className="text-xl md:text-2xl text-cyan-300 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                  탈출구로 향하는 길을 따라가세요...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 완료 화면 */}
      {showCompletionScreen && isComplete && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
          <div className="max-w-2xl w-full p-6 md:p-8 bg-gradient-to-br from-cyan-900/50 to-blue-900/50 rounded-2xl border-2 border-cyan-400/50 shadow-[0_0_50px_rgba(34,211,238,0.3)] animate-slide-up">
            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full animate-fade-in">
                <i className="ri-trophy-line text-3xl md:text-4xl text-white"></i>
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4 animate-slide-up">탈출 성공!</h2>
              <p className="text-base md:text-xl text-cyan-300 mb-6 md:mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                모든 퍼즐을 해결하고 {room.title}에서 탈출했습니다!
              </p>
              <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <div className="p-3 md:p-4 bg-white/5 rounded-lg">
                  <div className="text-white/70 text-xs md:text-sm mb-1">남은 시간</div>
                  <div className="text-xl md:text-2xl font-bold text-cyan-400 font-mono">{formatTime(timer)}</div>
                </div>
                <div className="p-3 md:p-4 bg-white/5 rounded-lg">
                  <div className="text-white/70 text-xs md:text-sm mb-1">해결한 퍼즐</div>
                  <div className="text-xl md:text-2xl font-bold text-white">
                    {room.subRooms.reduce((total, subRoom) => total + subRoom.hotspots.length, 0)}개
                  </div>
                </div>
                <div className="p-3 md:p-4 bg-white/5 rounded-lg col-span-2">
                  <div className="text-white/70 text-xs md:text-sm mb-1">클리어한 방</div>
                  <div className="text-xl md:text-2xl font-bold text-white">
                    {room.subRooms.length}개 방 모두 클리어!
                  </div>
                </div>
              </div>
              <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
                <p className="text-white/70 text-sm mb-4">잠시 후 메인 페이지로 이동합니다...</p>
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-6 md:px-8 py-2.5 md:py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-sm md:text-base font-semibold rounded-lg transition-all whitespace-nowrap"
                >
                  메인으로 돌아가기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 자동으로 메인 페이지로 이동 */}
      {showCompletionScreen && isComplete && (
        <AutoRedirect delay={5000} />
      )}

      {isGameOver && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="max-w-2xl w-full p-6 md:p-8 bg-gradient-to-br from-red-900/50 to-gray-900/50 rounded-2xl border-2 border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.3)]">
            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 flex items-center justify-center bg-gradient-to-br from-red-500 to-red-700 rounded-full">
                <i className="ri-time-line text-3xl md:text-4xl text-white"></i>
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4">시간 초과!</h2>
              <p className="text-base md:text-xl text-red-300 mb-6 md:mb-8">
                제한 시간 내에 탈출하지 못했습니다.
              </p>
              <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                <div className="p-3 md:p-4 bg-white/5 rounded-lg">
                  <div className="text-white/70 text-xs md:text-sm mb-1">해결한 퍼즐</div>
                  <div className="text-xl md:text-2xl font-bold text-white">{hotspots.filter(h => h.isSolved).length}/{hotspots.length}</div>
                </div>
                <div className="p-3 md:p-4 bg-white/5 rounded-lg">
                  <div className="text-white/70 text-xs md:text-sm mb-1">진행률</div>
                  <div className="text-xl md:text-2xl font-bold text-red-400">
                    {Math.round((hotspots.filter(h => h.isSolved).length / hotspots.length) * 100)}%
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 md:px-8 py-2.5 md:py-3 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white text-sm md:text-base font-semibold rounded-lg transition-all whitespace-nowrap"
                >
                  다시 도전하기
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-6 md:px-8 py-2.5 md:py-3 bg-white/10 hover:bg-white/20 text-white text-sm md:text-base font-semibold rounded-lg transition-all whitespace-nowrap border border-white/30"
                >
                  메인으로 돌아가기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
