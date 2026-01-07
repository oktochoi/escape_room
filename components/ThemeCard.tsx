'use client';

import Link from 'next/link';
import { RoomTheme } from '@/lib/roomData';

interface ThemeCardProps {
  theme: RoomTheme;
}

export default function ThemeCard({ theme }: ThemeCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'normal':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '쉬움';
      case 'normal':
        return '보통';
      case 'hard':
        return '어려움';
      default:
        return difficulty;
    }
  };

  const getDifficultyStars = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '⭐';
      case 'normal':
        return '⭐⭐';
      case 'hard':
        return '⭐⭐⭐';
      default:
        return '⭐';
    }
  };

  return (
    <div className="group bg-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20 cursor-pointer">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={theme.thumbnailUrl} 
          alt={theme.title}
          className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(theme.difficulty)}`}>
            {getDifficultyText(theme.difficulty)}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
          {theme.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {theme.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-star-fill text-yellow-400 text-base"></i>
            </div>
            <span className="text-sm text-gray-300">{getDifficultyStars(theme.difficulty)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-time-line text-cyan-400 text-base"></i>
            </div>
            <span className="text-sm text-gray-300">{theme.playTime}분</span>
          </div>
        </div>

        <Link 
          href={`/room/${theme.slug}`}
          className="block w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-center font-medium rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all whitespace-nowrap"
        >
          시작하기
        </Link>
      </div>
    </div>
  );
}
