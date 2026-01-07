'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RoomTheme, GameQuestion } from '@/lib/roomData';

interface GameRoomProps {
  room: RoomTheme;
  questions: GameQuestion[];
}

export default function GameRoom({ room, questions }: GameRoomProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  useEffect(() => {
    if (!isComplete) {
      const timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [startTime, isComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userAnswer.trim()) {
      setFeedback('답을 입력해주세요');
      return;
    }

    const currentQ = questions[currentQuestion];
    const normalizedAnswer = userAnswer.trim().toLowerCase();
    const correctAnswer = currentQ.answer.toLowerCase();

    if (normalizedAnswer === correctAnswer) {
      setFeedback('정답입니다! 🎉');
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setUserAnswer('');
          setFeedback('');
          setShowHint(false);
        } else {
          setIsComplete(true);
        }
      }, 1500);
    } else {
      setWrongAttempts(wrongAttempts + 1);
      setFeedback('오답입니다. 다시 시도해보세요.');
      setTimeout(() => setFeedback(''), 2000);
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30 text-center">
          <div className="w-24 h-24 flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full mx-auto mb-6">
            <i className="ri-trophy-line text-white text-5xl"></i>
          </div>
          <h1 className="text-4xl font-orbitron font-bold text-white mb-4">
            축하합니다! 🎉
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            {room.title}을(를) 클리어했습니다!
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">소요 시간</div>
              <div className="text-2xl font-bold text-cyan-400">{formatTime(elapsedTime)}</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">오답 횟수</div>
              <div className="text-2xl font-bold text-cyan-400">{wrongAttempts}</div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link 
              href="/"
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all cursor-pointer whitespace-nowrap"
            >
              홈으로 돌아가기
            </Link>
            <button
              onClick={() => {
                setCurrentQuestion(0);
                setUserAnswer('');
                setShowHint(false);
                setFeedback('');
                setIsComplete(false);
                setStartTime(Date.now());
                setElapsedTime(0);
                setWrongAttempts(0);
              }}
              className="px-8 py-3 bg-gray-800/50 text-white font-medium rounded-lg hover:bg-gray-700/50 transition-all cursor-pointer whitespace-nowrap border border-cyan-500/30"
            >
              다시 도전하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950/95 backdrop-blur-sm border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer">
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-arrow-left-line text-xl"></i>
              </div>
              <span className="text-sm font-medium whitespace-nowrap">돌아가기</span>
            </Link>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-time-line text-cyan-400 text-base"></i>
                </div>
                <span className="text-sm text-gray-300 font-mono">{formatTime(elapsedTime)}</span>
              </div>
              <div className="text-sm text-gray-300">
                <span className="text-cyan-400 font-bold">{currentQuestion + 1}</span>
                <span className="text-gray-500"> / </span>
                <span>{questions.length}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-16 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/20 mb-6">
            <div className="mb-6">
              <h1 className="text-3xl font-orbitron font-bold text-white mb-2">
                {room.title}
              </h1>
              <p className="text-gray-400">
                {room.story}
              </p>
            </div>

            <div className="w-full bg-gray-800/50 rounded-full h-2 mb-8">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>

            {currentQ.imageUrl && (
              <div className="mb-6 rounded-lg overflow-hidden">
                <img 
                  src={currentQ.imageUrl} 
                  alt="문제 이미지"
                  className="w-full h-64 object-cover object-top"
                />
              </div>
            )}

            <div className="bg-gray-800/30 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-white mb-4">
                문제 {currentQuestion + 1}
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                {currentQ.question}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mb-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="답을 입력하세요"
                  className="flex-1 px-4 py-3 bg-gray-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 text-sm"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all cursor-pointer whitespace-nowrap"
                >
                  제출
                </button>
              </div>
            </form>

            {feedback && (
              <div className={`p-4 rounded-lg mb-4 ${
                feedback.includes('정답') 
                  ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
                  : 'bg-red-500/20 border border-red-500/30 text-red-400'
              }`}>
                {feedback}
              </div>
            )}

            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors cursor-pointer"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-lightbulb-line text-base"></i>
              </div>
              <span className="text-sm font-medium whitespace-nowrap">
                {showHint ? '힌트 숨기기' : '힌트 보기'}
              </span>
            </button>

            {showHint && (
              <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-400 text-sm">
                  💡 {currentQ.hint}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
