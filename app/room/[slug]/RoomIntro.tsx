'use client';

import { useState } from 'react';
import { ExplorationRoom } from '@/lib/explorationRoomData';

interface RoomIntroProps {
  room: ExplorationRoom;
  onStart: () => void;
}

export default function RoomIntro({ room, onStart }: RoomIntroProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const bannerImage = room.slug === 'cursed-mansion' 
    ? '/images/cursed_house/main_banner.png'
    : room.subRooms[0]?.backgroundUrl || '';

  const totalPuzzles = room.subRooms.reduce((total, subRoom) => total + subRoom.hotspots.length, 0);
  const difficultyLabels = {
    easy: '쉬움',
    normal: '보통',
    hard: '어려움',
  };
  const difficultyColors = {
    easy: 'text-green-400 border-green-400/30 bg-green-500/10',
    normal: 'text-yellow-400 border-yellow-400/30 bg-yellow-500/10',
    hard: 'text-red-400 border-red-400/30 bg-red-500/10',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          {/* 배너 이미지 */}
          <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
            {bannerImage && (
              <>
                <img
                  src={bannerImage}
                  alt={room.title}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 animate-pulse" />
                )}
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
            
            {/* 난이도 배지 */}
            <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full border backdrop-blur-sm ${difficultyColors[room.difficulty]}`}>
              <span className="text-sm font-semibold">{difficultyLabels[room.difficulty]}</span>
            </div>
          </div>

          {/* 콘텐츠 */}
          <div className="p-6 md:p-8 lg:p-10">
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
                {room.title}
              </h1>
              <p className="text-lg md:text-xl text-white/80 leading-relaxed">
                {room.story}
              </p>
            </div>

            {/* 게임 정보 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <i className="ri-puzzle-line text-cyan-400 text-xl"></i>
                  <span className="text-white/70 text-sm">퍼즐</span>
                </div>
                <div className="text-2xl font-bold text-white">{totalPuzzles}개</div>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <i className="ri-door-open-line text-yellow-400 text-xl"></i>
                  <span className="text-white/70 text-sm">방</span>
                </div>
                <div className="text-2xl font-bold text-white">{room.subRooms.length}개</div>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <i className="ri-timer-line text-green-400 text-xl"></i>
                  <span className="text-white/70 text-sm">제한 시간</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {Math.floor(room.timeLimit / 60)}분
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <i className="ri-bar-chart-line text-purple-400 text-xl"></i>
                  <span className="text-white/70 text-sm">난이도</span>
                </div>
                <div className={`text-2xl font-bold ${difficultyColors[room.difficulty].split(' ')[0]}`}>
                  {difficultyLabels[room.difficulty]}
                </div>
              </div>
            </div>

            {/* 설명 */}
            <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-lg p-4 md:p-6 mb-8">
              <div className="flex items-start gap-3">
                <i className="ri-information-line text-cyan-400 text-2xl mt-1"></i>
                <div>
                  <h3 className="text-white font-semibold mb-2">게임 플레이 팁</h3>
                  <ul className="text-white/80 text-sm md:text-base space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>마우스를 움직여 상호작용 가능한 오브젝트를 찾으세요</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>모바일은 가로버전으로 진행해주세요</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>오브젝트를 클릭하면 70% 확률로 문제를 발견할 수 있습니다</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>상단에 마우스를 놓으면 인벤토리가 보입니다</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>상단에 있는 소리 버튼을 켜면 더 집중해서 플레이할 수 있습니다</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>모든 퍼즐을 해결하고 모든 방을 통과하면 탈출에 성공합니다</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>시간 내에 탈출하지 못하면 게임 오버입니다</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onStart}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold text-lg rounded-lg transition-all shadow-lg hover:shadow-cyan-500/50 flex items-center justify-center gap-2"
              >
                <i className="ri-play-line text-2xl"></i>
                <span>탐색 시작하기</span>
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all border border-white/20"
              >
                <i className="ri-arrow-left-line mr-2"></i>
                돌아가기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

