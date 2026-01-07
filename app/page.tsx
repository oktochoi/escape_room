'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { explorationRooms } from '@/lib/explorationRoomData';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />

      <main className="pt-16 md:pt-20">
        <section className="relative py-12 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent_50%)]" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-block mb-3 md:mb-4 px-3 md:px-4 py-1.5 md:py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
              <span className="text-cyan-400 text-xs md:text-sm font-medium">탐색형 방탈출 게임</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 font-['Orbitron']">
              방을 선택하세요
            </h1>
            <p className="text-base md:text-xl text-white/70 max-w-2xl mx-auto mb-6 md:mb-8 px-4">
              실제 방을 탐색하듯 오브젝트를 클릭하고 퍼즐을 해결하세요
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 text-xs md:text-sm text-white/50">
              <div className="flex items-center gap-2">
                <i className="ri-mouse-line text-cyan-400"></i>
                <span>마우스로 탐색</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-white/30 rounded-full" />
              <div className="flex items-center gap-2">
                <i className="ri-search-line text-cyan-400"></i>
                <span>오브젝트 클릭</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-white/30 rounded-full" />
              <div className="flex items-center gap-2">
                <i className="ri-puzzle-line text-cyan-400"></i>
                <span>퍼즐 해결</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="flex justify-center">
                <div className="w-full max-w-lg animate-pulse">
                  <div className="bg-white/5 rounded-2xl overflow-hidden">
                    <div className="h-60 md:h-80 bg-white/10" />
                    <div className="p-4 md:p-6 space-y-3">
                      <div className="h-6 bg-white/10 rounded w-3/4" />
                      <div className="h-4 bg-white/10 rounded w-full" />
                      <div className="h-4 bg-white/10 rounded w-2/3" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-full max-w-lg">
                  {explorationRooms.map((room, index) => {
                    // 저택 방은 메인 배너 이미지 사용
                    const bannerImage = room.slug === 'cursed-mansion' 
                      ? '/images/cursed_house/main_banner.png'
                      : room.subRooms[0]?.backgroundUrl || '';
                    
                    return (
                    <Link
                      key={room.id}
                      href={`/room/${room.slug}`}
                      className="group relative bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(34,211,238,0.3)]"
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      <div className="relative h-60 md:h-80 overflow-hidden">
                        <img
                          src={bannerImage}
                          alt={room.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                        
                        <div className="absolute top-3 md:top-4 right-3 md:right-4 px-2.5 md:px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full border border-cyan-400/30">
                          <div className="flex items-center gap-1.5 md:gap-2">
                            <i className="ri-puzzle-line text-cyan-400 text-xs md:text-sm"></i>
                            <span className="text-white text-xs md:text-sm font-medium">
                              {room.subRooms.reduce((total, subRoom) => total + subRoom.hotspots.length, 0)}개 퍼즐
                            </span>
                          </div>
                        </div>
                        
                        {room.subRooms.length > 1 && (
                          <div className="absolute top-3 md:top-4 left-3 md:left-4 px-2.5 md:px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full border border-yellow-400/30">
                            <div className="flex items-center gap-1.5 md:gap-2">
                              <i className="ri-door-open-line text-yellow-400 text-xs md:text-sm"></i>
                              <span className="text-white text-xs md:text-sm font-medium">
                                {room.subRooms.length}개 방
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-4 md:p-6">
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-cyan-400 transition-colors">
                          {room.title}
                        </h3>
                        <p className="text-sm md:text-base text-white/70 mb-3 md:mb-4 line-clamp-2">
                          {room.story}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm">
                            <div className="flex items-center gap-1.5 md:gap-2 text-white/60">
                              <i className="ri-map-pin-line text-cyan-400"></i>
                              <span>탐색형</span>
                            </div>
                          <div className="flex items-center gap-1.5 md:gap-2 text-white/60">
                            <i className="ri-time-line text-cyan-400"></i>
                            <span>8분</span>
                          </div>
                          </div>

                          <div className="px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm md:text-base font-semibold rounded-lg group-hover:from-cyan-600 group-hover:to-blue-600 transition-all whitespace-nowrap">
                            탐색 시작
                          </div>
                        </div>
                      </div>

                      <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-400/20 rounded-2xl transition-all pointer-events-none" />
                    </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-2xl border border-cyan-400/30 p-6 md:p-8 lg:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6 text-center">게임 방법</h2>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full">
                    <i className="ri-search-eye-line text-2xl md:text-3xl text-white"></i>
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-white mb-2">1. 탐색</h3>
                  <p className="text-xs md:text-sm text-white/70">
                    마우스를 움직여 상호작용 가능한 오브젝트를 찾으세요
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full">
                    <i className="ri-cursor-line text-2xl md:text-3xl text-white"></i>
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-white mb-2">2. 클릭</h3>
                  <p className="text-xs md:text-sm text-white/70">
                    오브젝트를 클릭하여 자세히 조사하고 퍼즐을 확인하세요
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full">
                    <i className="ri-key-line text-2xl md:text-3xl text-white"></i>
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-white mb-2">3. 해결</h3>
                  <p className="text-xs md:text-sm text-white/70">
                    퍼즐을 풀고 아이템을 획득하여 다음 단계로 진행하세요
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
