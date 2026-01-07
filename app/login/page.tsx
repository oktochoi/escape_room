'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(isLogin ? '로그인 기능은 준비 중입니다' : '회원가입 기능은 준비 중입니다');
  };

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
              {isLogin ? '로그인' : '회원가입'}
            </h1>
            <p className="text-sm md:text-base text-gray-400">
              {isLogin ? 'Escape Room에 오신 것을 환영합니다' : '새로운 모험을 시작하세요'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  이름
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름을 입력하세요"
                  className="w-full px-4 py-2.5 md:py-3 bg-gray-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 text-sm"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
                className="w-full px-4 py-2.5 md:py-3 bg-gray-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full px-4 py-2.5 md:py-3 bg-gray-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 text-sm"
                required
              />
            </div>

            {isLogin && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm">
                <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-cyan-500/30 bg-gray-800/50" />
                  <span>로그인 상태 유지</span>
                </label>
                <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer whitespace-nowrap">
                  비밀번호 찾기
                </a>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 md:py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all cursor-pointer whitespace-nowrap text-sm md:text-base"
            >
              {isLogin ? '로그인' : '회원가입'}
            </button>
          </form>

          <div className="mt-5 md:mt-6 text-center">
            <p className="text-gray-400 text-sm">
              {isLogin ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer whitespace-nowrap font-medium"
              >
                {isLogin ? '회원가입' : '로그인'}
              </button>
            </p>
          </div>

          <div className="mt-6 md:mt-8 pt-5 md:pt-6 border-t border-cyan-500/20">
            <p className="text-center text-gray-400 text-sm mb-4">또는 소셜 로그인</p>
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              <button className="py-2.5 md:py-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all cursor-pointer border border-cyan-500/20 flex items-center justify-center">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-google-fill text-white text-lg md:text-xl"></i>
                </div>
              </button>
              <button className="py-2.5 md:py-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all cursor-pointer border border-cyan-500/20 flex items-center justify-center">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-kakao-talk-fill text-white text-lg md:text-xl"></i>
                </div>
              </button>
              <button className="py-2.5 md:py-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all cursor-pointer border border-cyan-500/20 flex items-center justify-center">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-github-fill text-white text-lg md:text-xl"></i>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-5 md:mt-6 text-center">
            <Link 
              href="/"
              className="text-sm text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer whitespace-nowrap"
            >
              게스트로 계속하기
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
