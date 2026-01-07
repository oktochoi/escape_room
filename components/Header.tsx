'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950/95 backdrop-blur-sm border-b border-cyan-500/20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
            <img 
              src="https://public.readdy.ai/ai/img_res/7bf25753-0c8f-47ee-b845-4accd2087fb2.png" 
              alt="Escape Room Logo" 
              className="h-10 w-10 object-contain"
            />
            <span className="text-xl font-orbitron font-bold text-cyan-400">ESCAPE ROOM</span>
          </Link>

          <div className="flex items-center gap-8">
            <Link 
              href="/" 
              className={`text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                pathname === '/' ? 'text-cyan-400' : 'text-gray-300 hover:text-cyan-400'
              }`}
            >
              홈
            </Link>
            <Link 
              href="/#themes" 
              className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors cursor-pointer whitespace-nowrap"
            >
              테마
            </Link>
            <Link 
              href="/#about" 
              className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors cursor-pointer whitespace-nowrap"
            >
              소개
            </Link>
          </div>

          <Link 
            href="/login"
            className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all cursor-pointer whitespace-nowrap"
          >
            로그인
          </Link>
        </div>
      </nav>
    </header>
  );
}
