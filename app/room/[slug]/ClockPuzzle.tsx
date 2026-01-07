'use client';

import { useState } from 'react';

interface ClockPuzzleProps {
  onSolve: (time: string) => void;
  onClose: () => void;
}

export default function ClockPuzzle({ onSolve, onClose }: ClockPuzzleProps) {
  const [hour, setHour] = useState(10);
  const [minute, setMinute] = useState(0);

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 0 && value <= 23) {
      setHour(value);
    }
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 0 && value <= 59) {
      setMinute(value);
    }
  };

  const handleSubmit = () => {
    const timeString = `${hour.toString().padStart(2, '0')}${minute.toString().padStart(2, '0')}`;
    onSolve(timeString);
  };

  // 시침 각도 (12시 = 0도, 시계방향)
  const hourAngle = (hour % 12) * 30 + minute * 0.5;
  // 분침 각도 (12시 = 0도, 시계방향)
  const minuteAngle = minute * 6;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative max-w-2xl w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-2xl border-2 border-amber-900/50 shadow-[0_0_80px_rgba(180,83,9,0.4)] overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          <i className="ri-close-line text-xl text-white"></i>
        </button>

        <div className="p-8 bg-gradient-to-b from-slate-950/50 to-transparent">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-amber-200 mb-2 drop-shadow-[0_2px_8px_rgba(180,83,9,0.6)]">시계 맞추기</h3>
            <p className="text-amber-300/80">시침과 분침을 조절하여 정확한 시간을 맞추세요</p>
          </div>

          {/* 시계 UI */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
            <div className="relative w-80 h-80 md:w-96 md:h-96">
              {/* 시계 배경 이미지 */}
              <div 
                className="absolute inset-0 rounded-full bg-cover bg-center shadow-2xl border-8 border-amber-900/80"
                style={{
                  backgroundImage: "url('/images/cursed_house/first_room_clock.png')",
                  filter: 'brightness(0.7) contrast(1.1)',
                }}
              />
              
              {/* 어두운 오버레이 */}
              <div className="absolute inset-0 rounded-full bg-black/30" />
              
              {/* 시계 숫자 (로마 숫자 스타일) */}
              {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, index) => {
                const angle = (index * 30 - 90) * (Math.PI / 180);
                const radius = 38;
                const x = 50 + radius * Math.cos(angle);
                const y = 50 + radius * Math.sin(angle);
                return (
                  <div
                    key={num}
                    className="absolute text-amber-200 font-bold text-xl md:text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.9), 0 0 8px rgba(251, 191, 36, 0.3)',
                    }}
                  >
                    {num}
                  </div>
                );
              })}

              {/* 시계 눈금 (작은 눈금) */}
              {Array.from({ length: 60 }).map((_, index) => {
                if (index % 5 === 0) return null; // 큰 눈금은 숫자로 대체
                const angle = (index * 6 - 90) * (Math.PI / 180);
                const radius = 42;
                const x = 50 + radius * Math.cos(angle);
                const y = 50 + radius * Math.sin(angle);
                return (
                  <div
                    key={`tick-${index}`}
                    className="absolute w-0.5 h-2 bg-amber-300/60"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: `translate(-50%, -50%) rotate(${index * 6}deg)`,
                    }}
                  />
                );
              })}

              {/* 큰 눈금 (12, 3, 6, 9 위치) */}
              {[0, 3, 6, 9].map((index) => {
                const angle = (index * 30 - 90) * (Math.PI / 180);
                const radius = 42;
                const x = 50 + radius * Math.cos(angle);
                const y = 50 + radius * Math.sin(angle);
                return (
                  <div
                    key={`major-tick-${index}`}
                    className="absolute w-1 h-4 bg-amber-400/80"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: `translate(-50%, -50%) rotate(${index * 30}deg)`,
                    }}
                  />
                );
              })}

              {/* 시침 (더 두껍고 어두운 색) */}
              <div
                className="absolute top-1/2 left-1/2 origin-bottom z-20"
                style={{
                  transform: `translate(-50%, -100%) rotate(${hourAngle}deg)`,
                  transformOrigin: '50% 100%',
                }}
              >
                <div className="w-3 h-24 bg-gradient-to-b from-amber-900 to-amber-700 rounded-full shadow-lg border border-amber-800" />
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-amber-800 rounded-full border-2 border-amber-900 shadow-lg" />
              </div>

              {/* 분침 (더 길고 얇게) */}
              <div
                className="absolute top-1/2 left-1/2 origin-bottom z-20"
                style={{
                  transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)`,
                  transformOrigin: '50% 100%',
                }}
              >
                <div className="w-2 h-32 bg-gradient-to-b from-amber-800 to-amber-600 rounded-full shadow-lg border border-amber-700" />
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-amber-700 rounded-full border-2 border-amber-800 shadow-lg" />
              </div>

              {/* 중심점 (더 크고 고딕 스타일) */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-to-br from-amber-900 to-amber-700 rounded-full border-3 border-amber-800 shadow-2xl z-30" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-amber-600 rounded-full z-30" />
            </div>

            {/* 시간 조절 컨트롤 */}
            <div className="space-y-6">
              <div>
                <label className="block text-white font-semibold mb-2">시 (0-23)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="23"
                    value={hour}
                    onChange={handleHourChange}
                    className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <span className="text-2xl font-bold text-cyan-400 w-12 text-center">
                    {hour.toString().padStart(2, '0')}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">분 (0-59)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="59"
                    value={minute}
                    onChange={handleMinuteChange}
                    className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                  />
                  <span className="text-2xl font-bold text-yellow-400 w-12 text-center">
                    {minute.toString().padStart(2, '0')}
                  </span>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 border border-cyan-400/30">
                <p className="text-white/70 text-sm mb-1">현재 시간</p>
                <p className="text-3xl font-bold text-white font-mono">
                  {hour.toString().padStart(2, '0')}:{minute.toString().padStart(2, '0')}
                </p>
              </div>
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all shadow-lg"
            >
              시간 확인
            </button>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

