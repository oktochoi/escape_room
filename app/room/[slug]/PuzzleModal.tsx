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
  const [showHint, setShowHint] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

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
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className={`relative max-w-3xl w-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border-2 border-cyan-400/30 shadow-[0_0_50px_rgba(34,211,238,0.2)] overflow-hidden ${isShaking ? 'animate-shake' : ''}`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          <i className="ri-close-line text-xl text-white"></i>
        </button>

        {hotspot.puzzle.imageUrl && (
          <div className="relative w-full h-64 overflow-hidden bg-slate-800">
            <img
              src={hotspot.puzzle.imageUrl}
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
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
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
            <p className="text-white/90 leading-relaxed text-lg">{hotspot.puzzle.question}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                정답 입력
              </label>
              <input
                type="text"
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                  setError('');
                }}
                placeholder="답을 입력하세요..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all text-sm"
                autoFocus
              />
              {error && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                  <i className="ri-error-warning-line"></i>
                  {error}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all whitespace-nowrap"
              >
                확인
              </button>
              
              <button
                type="button"
                onClick={() => {
                  if (!hintUsed && !showHint) {
                    setHintUsed(true);
                    onHintUsed?.();
                  }
                  setShowHint(!showHint);
                }}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
              >
                <div className="flex items-center gap-2">
                  <i className="ri-lightbulb-line"></i>
                  <span>힌트</span>
                </div>
              </button>
            </div>
          </form>

          {showHint && (
            <div className="mt-4 space-y-4">
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <i className="ri-lightbulb-flash-line text-xl text-yellow-400 mt-0.5"></i>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-400 mb-1">힌트</p>
                    <p className="text-sm text-white/80">{hotspot.puzzle.hint}</p>
                  </div>
                </div>
              </div>
              {hotspot.puzzle.imageUrl && (
                <div className="relative w-full h-48 overflow-hidden rounded-lg border-2 border-yellow-500/30">
                  <img
                    src={hotspot.puzzle.imageUrl}
                    alt={`${hotspot.name} 힌트 이미지`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-yellow-900/50 to-transparent" />
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-yellow-500/80 backdrop-blur-sm rounded text-xs text-white font-medium">
                    힌트 이미지
                  </div>
                </div>
              )}
            </div>
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

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
