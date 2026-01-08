'use client';

import { useState } from 'react';
import { Hotspot } from '@/lib/explorationRoomData';

interface PuzzleModalProps {
  hotspot: Hotspot;
  onSolve: (hotspotId: string, itemReward?: string) => void;
  onClose: () => void;
  onHintUsed?: () => void;
  onWrongAnswer?: () => void;
  isSolved?: boolean;
}

export default function PuzzleModal({ hotspot, onSolve, onClose, onHintUsed, onWrongAnswer, isSolved = false }: PuzzleModalProps) {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  
  // 책상 퍼즐용 문자 선택 슬롯 상태
  const isDeskPuzzle = hotspot.id === 'desk';
  const isPortraitPuzzle = hotspot.id === 'portrait';
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const [selectedChars, setSelectedChars] = useState<string[]>(['A', 'A', 'A', 'A']);
  
  // 초상화 퍼즐용 방향 입력 상태
  const [directionPath, setDirectionPath] = useState<string[]>([]);
  // 각 초상화의 로마 숫자: 2, 1, 5, 4, 3, 6
  const portraitRomanNumbers = ['II', 'I', 'V', 'IV', 'III', 'VI'];
  // 각 초상화가 가리키는 방향: bottom, left, right, left, up, up
  const portraitImages = [
    '/images/cursed_house/bottom.png', // 초상화 1 - 아랍어 2, 방향: bottom
    '/images/cursed_house/left.png',   // 초상화 2 - 아랍어 1, 방향: left
    '/images/cursed_house/right.png',  // 초상화 3 - 아랍어 5, 방향: right
    '/images/cursed_house/left.png',   // 초상화 4 - 아랍어 4, 방향: left
    '/images/cursed_house/up.png',     // 초상화 5 - 아랍어 3, 방향: up
    '/images/cursed_house/up.png',     // 초상화 6 - 아랍어 6, 방향: up
  ];
  
  // 문자 슬롯 변경 핸들러
  const handleCharChange = (index: number, direction: 'prev' | 'next') => {
    if (isSolved) return;
    
    setSelectedChars(prev => {
      const newChars = [...prev];
      const currentIndex = alphabet.indexOf(newChars[index]);
      let newIndex;
      
      if (direction === 'prev') {
        newIndex = currentIndex === 0 ? alphabet.length - 1 : currentIndex - 1;
      } else {
        newIndex = currentIndex === alphabet.length - 1 ? 0 : currentIndex + 1;
      }
      
      newChars[index] = alphabet[newIndex];
      return newChars;
    });
  };
  
  // 책상 퍼즐 확인 핸들러
  const handleDeskSubmit = () => {
    if (isSolved) return;
    
    const currentAnswer = selectedChars.join('');
    const correctAnswer = hotspot.puzzle.answer.toUpperCase();
    
    if (currentAnswer === correctAnswer) {
      onSolve(hotspot.id, hotspot.itemReward);
      setError('');
    } else {
      setError('틀렸습니다. 다시 시도해보세요.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      onWrongAnswer?.();
    }
  };
  
  // 초상화 퍼즐 방향 추가
  const handleDirectionAdd = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (isSolved) return;
    const directionSymbols = { up: '↑', down: '↓', left: '←', right: '→' };
    setDirectionPath(prev => [...prev, directionSymbols[direction]]);
    setError('');
  };
  
  // 초상화 퍼즐 한 칸 지우기
  const handleDirectionDeleteOne = () => {
    if (isSolved || directionPath.length === 0) return;
    setDirectionPath(prev => prev.slice(0, -1));
  };
  
  // 초상화 퍼즐 모두 지우기
  const handleDirectionDeleteAll = () => {
    if (isSolved) return;
    setDirectionPath([]);
  };
  
  // 초상화 퍼즐 확인 핸들러
  const handlePortraitSubmit = () => {
    if (isSolved) return;
    
    const currentAnswer = directionPath.join('');
    const correctAnswer = hotspot.puzzle.answer || '';
    
    // 공백 제거 후 비교
    const normalizedCurrent = currentAnswer.replace(/\s/g, '');
    const normalizedCorrect = correctAnswer.replace(/\s/g, '');
    
    if (normalizedCurrent === normalizedCorrect) {
      onSolve(hotspot.id, hotspot.itemReward);
      setError('');
    } else {
      setError('틀렸습니다. 다시 시도해보세요.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      onWrongAnswer?.();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSolved) return; // 이미 해결된 문제는 제출 불가
    
    const normalizedAnswer = answer.toLowerCase().trim();
    const correctAnswer = hotspot.puzzle.answer.toLowerCase().trim();
    
    if (normalizedAnswer === correctAnswer) {
      onSolve(hotspot.id, hotspot.itemReward);
      setAnswer('');
      setError('');
    } else {
      setError('틀렸습니다. 다시 시도해보세요.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      onWrongAnswer?.();
    }
  };

  return (
    <>
      {/* 고정 배경 */}
      <div 
        className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 스크롤 가능한 컨텐츠 */}
      <div className="fixed top-0 left-0 right-0 z-40 h-screen overflow-y-auto">
        <div className={`relative max-w-3xl w-full mx-auto mt-0 mb-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-b-2xl border-2 border-t-0 border-cyan-400/30 shadow-[0_0_50px_rgba(34,211,238,0.2)] overflow-hidden animate-slide-down ${isShaking ? 'animate-shake' : ''}`}>
        <div className="sticky top-0 z-10 flex justify-end p-4 bg-gradient-to-b from-slate-900 to-transparent">
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
          >
            <i className="ri-close-line text-xl text-white"></i>
          </button>
        </div>

        {hotspot.puzzle.imageUrl || isPortraitPuzzle ? (
          <div className="relative w-full h-80 md:h-96 overflow-hidden bg-slate-900">
            <img
              src={isPortraitPuzzle ? '/images/cursed_house/center.png' : hotspot.puzzle.imageUrl}
              alt={hotspot.name}
              className={`w-full h-full ${
                hotspot.id === 'clock' || hotspot.id === 'portrait' ? 'object-cover object-top' : 'object-cover'
              }`}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                // 이미지 로딩 실패 시 대체 UI 표시
                const parent = target.parentElement;
                if (parent && !parent.querySelector('.image-fallback')) {
                  const fallback = document.createElement('div');
                  fallback.className = 'image-fallback absolute inset-0 flex items-center justify-center bg-slate-800';
                  fallback.innerHTML = `<div class="text-center p-4"><i class="ri-image-line text-4xl text-slate-500 mb-2"></i><p class="text-slate-400 text-sm">${hotspot.name}</p></div>`;
                  parent.appendChild(fallback);
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
          </div>
        ) : (
          <div className="relative w-full h-64 overflow-hidden bg-slate-900 flex items-center justify-center">
            <div className="text-center p-4">
              <i className="ri-image-line text-4xl text-slate-500 mb-2"></i>
              <p className="text-slate-400 text-sm">{hotspot.name}</p>
            </div>
          </div>
        )}

        <div className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg">
              <i className={`${
                hotspot.puzzle.type === 'code' ? 'ri-lock-line' :
                hotspot.puzzle.type === 'pattern' ? 'ri-image-line' :
                'ri-file-text-line'
              } text-2xl text-white`}></i>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{hotspot.name}</h2>
              <p className="text-sm text-cyan-400">
                {hotspot.puzzle.type === 'code' ? '코드 퍼즐' :
                 hotspot.puzzle.type === 'pattern' ? '패턴 퍼즐' :
                 '텍스트 퍼즐'}
              </p>
            </div>
          </div>

          <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-white/90 leading-relaxed text-lg whitespace-pre-line">{hotspot.puzzle.question}</p>
          </div>

          {isPortraitPuzzle ? (
            /* 초상화 퍼즐 - 방향 입력 */
            <div className="space-y-6">
              <div>
                <p className="text-xs text-white/50 mb-6 text-center">
                  화살표를 눌러 경로를 만들고, 아래에서 정답을 확인하세요.
                </p>
                
                {/* 초상화 이미지들 */}
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                  {portraitImages.map((img, index) => (
                    <div key={index} className="relative bg-slate-800/50 rounded-lg p-3 border border-cyan-400/20 w-32 h-32">
                      <div className="w-full h-full relative overflow-hidden rounded">
                        <img
                          src={img}
                          alt={`초상화 ${index + 1}`}
                          className="w-full h-full object-cover object-center"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent && !parent.querySelector('.portrait-fallback')) {
                              const fallback = document.createElement('div');
                              fallback.className = 'portrait-fallback absolute inset-0 flex items-center justify-center bg-slate-700';
                              fallback.innerHTML = `<div class="text-center"><div class="text-2xl text-cyan-400 mb-2">${portraitRomanNumbers[index]}</div><p class="text-xs text-slate-400">초상화 ${index + 1}</p></div>`;
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                        {/* 로마 숫자 표시 */}
                        <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-cyan-400 text-lg font-bold">
                          {portraitRomanNumbers[index]}
                        </div>
                        {/* 방향 표시 */}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* 경로 입력 필드 */}
                <div className="mb-4">
                  <div className="w-full px-4 py-3 bg-amber-50/10 border border-amber-400/30 rounded-lg text-center min-h-[48px] flex items-center justify-center">
                    <span className={`text-lg font-semibold ${directionPath.length > 0 ? 'text-amber-300' : 'text-amber-300/40'}`}>
                      {directionPath.length > 0 ? directionPath.join(' ') : '경로 입력 중…'}
                    </span>
                  </div>
                </div>
                
                {/* 방향 버튼들 */}
                <div className="flex flex-col items-center gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => handleDirectionAdd('up')}
                    disabled={isSolved}
                    className="w-20 h-12 bg-amber-100/20 hover:bg-amber-100/30 border border-amber-400/30 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center"
                  >
                    <span className="text-2xl text-amber-300">↑</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDirectionAdd('left')}
                      disabled={isSolved}
                      className="w-20 h-12 bg-amber-100/20 hover:bg-amber-100/30 border border-amber-400/30 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center"
                    >
                      <span className="text-2xl text-amber-300">←</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDirectionAdd('down')}
                      disabled={isSolved}
                      className="w-20 h-12 bg-amber-200/30 hover:bg-amber-200/40 border border-amber-500/40 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center"
                    >
                      <span className="text-2xl text-amber-400">↓</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDirectionAdd('right')}
                      disabled={isSolved}
                      className="w-20 h-12 bg-amber-100/20 hover:bg-amber-100/30 border border-amber-400/30 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center"
                    >
                      <span className="text-2xl text-amber-300">→</span>
                    </button>
                  </div>
                </div>
                
                {/* 편집 버튼들 */}
                <div className="flex gap-3 mb-4">
                  <button
                    type="button"
                    onClick={handleDirectionDeleteOne}
                    disabled={isSolved || directionPath.length === 0}
                    className="flex-1 px-4 py-2 bg-amber-100/20 hover:bg-amber-100/30 border border-amber-400/30 rounded-lg text-amber-300 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    ← 한 칸 지우기
                  </button>
                  <button
                    type="button"
                    onClick={handleDirectionDeleteAll}
                    disabled={isSolved || directionPath.length === 0}
                    className="flex-1 px-4 py-2 bg-amber-100/20 hover:bg-amber-100/30 border border-amber-400/30 rounded-lg text-amber-300 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    모두 지우기
                  </button>
                </div>
                
                {error && (
                  <p className="mb-4 text-sm text-red-400 flex items-center gap-2 justify-center">
                    <i className="ri-error-warning-line"></i>
                    {error}
                  </p>
                )}
              </div>
              
              {/* 정답 확인 버튼 */}
              <button
                type="button"
                onClick={handlePortraitSubmit}
                disabled={isSolved || directionPath.length === 0}
                className="w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-lg"
              >
                정답 확인하기
              </button>
            </div>
          ) : isDeskPuzzle ? (
            /* 책상 퍼즐 - 문자 선택 슬롯 */
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-4">
                  문자를 선택하세요
                </label>
                <div className="space-y-4">
                  {selectedChars.map((char, index) => {
                    const currentIndex = alphabet.indexOf(char);
                    const prevChar = alphabet[currentIndex === 0 ? alphabet.length - 1 : currentIndex - 1];
                    const nextChar = alphabet[currentIndex === alphabet.length - 1 ? 0 : currentIndex + 1];
                    
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleCharChange(index, 'prev')}
                          disabled={isSolved}
                          className="w-12 h-12 flex items-center justify-center bg-slate-700/50 hover:bg-slate-600/50 border border-cyan-400/30 rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                        >
                          <i className="ri-arrow-left-line text-cyan-400 text-xl"></i>
                        </button>
                        
                        <div className="flex-1 bg-slate-800/80 border border-cyan-400/20 rounded-lg p-4 relative overflow-hidden backdrop-blur-sm">
                          <div className="flex items-center justify-center gap-3">
                            <span className="text-slate-500 text-2xl font-semibold">{prevChar}</span>
                            <div className="relative">
                              <span className="text-white text-4xl font-bold relative z-10">{char}</span>
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-0.5 h-full bg-red-500"></div>
                                <div className="w-0.5 h-full bg-cyan-400 ml-0.5"></div>
                              </div>
                            </div>
                            <span className="text-slate-500 text-2xl font-semibold">{nextChar}</span>
                          </div>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => handleCharChange(index, 'next')}
                          disabled={isSolved}
                          className="w-12 h-12 flex items-center justify-center bg-slate-700/50 hover:bg-slate-600/50 border border-cyan-400/30 rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                        >
                          <i className="ri-arrow-right-line text-cyan-400 text-xl"></i>
                        </button>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-6 text-center">
                  <div className="inline-block px-6 py-3 bg-slate-800/80 border border-cyan-400/30 rounded-lg backdrop-blur-sm">
                    <span className="text-2xl font-mono text-cyan-400 font-bold">
                      {selectedChars.join('')}
                    </span>
                  </div>
                </div>
                
                {error && (
                  <p className="mt-4 text-sm text-red-400 flex items-center gap-2 justify-center">
                    <i className="ri-error-warning-line"></i>
                    {error}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleDeskSubmit}
                  disabled={isSolved}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all whitespace-nowrap"
                >
                  {isSolved ? '이미 해결됨' : '확인'}
                </button>
              </div>
            </div>
          ) : (
            /* 일반 퍼즐 - 숫자 키패드 */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  정답 입력
                </label>
                <div className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-center min-h-[48px] flex items-center justify-center mb-2">
                  <span className={`text-2xl font-mono ${answer ? 'text-white' : 'text-white/40'}`}>
                    {answer || '0'}
                  </span>
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                    <i className="ri-error-warning-line"></i>
                    {error}
                  </p>
                )}
              </div>

              {/* 숫자 키패드 */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setAnswer(answer + num.toString());
                      setError('');
                    }}
                    disabled={isSolved}
                    className="py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setAnswer(answer + '0');
                    setError('');
                  }}
                  disabled={isSolved}
                  className="py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAnswer(answer.slice(0, -1));
                    setError('');
                  }}
                  disabled={isSolved || !answer}
                  className="py-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-white text-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  <i className="ri-delete-back-2-line"></i>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAnswer('');
                    setError('');
                  }}
                  disabled={isSolved || !answer}
                  className="py-4 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-lg text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  초기화
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSolved || !answer}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all whitespace-nowrap"
                >
                  {isSolved ? '이미 해결됨' : '확인'}
                </button>
              </div>
            </form>
          )}

          {hotspot.itemReward && (
            <div className="mt-4 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              <p className="text-xs text-cyan-400 flex items-center gap-2">
                <i className="ri-gift-line"></i>
                이 퍼즐을 해결하면 아이템을 획득합니다
              </p>
            </div>
          )}
        </div>
      </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
