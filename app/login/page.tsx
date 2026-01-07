'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LoginPage() {

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16 flex items-center justify-center p-4 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-40 left-40 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-40 right-40 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-md w-full bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-cyan-500/20">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-orbitron font-bold text-white mb-2">
              로그인
            </h1>
            <p className="text-lg md:text-xl text-cyan-400 font-medium">
              현재 준비중입니다
            </p>
          </div>

          <div className="mt-5 md:mt-6 text-center">
            <Link 
              href="/"
              className="inline-block px-6 py-2.5 md:py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all cursor-pointer whitespace-nowrap text-sm md:text-base"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
