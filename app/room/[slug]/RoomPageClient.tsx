'use client';

import { useState } from 'react';
import { ExplorationRoom } from '@/lib/explorationRoomData';
import ExplorationGame from './ExplorationGame';
import MansionStudyGame from './MansionStudyGame';
import RoomIntro from './RoomIntro';

interface RoomPageClientProps {
  room: ExplorationRoom;
}

export default function RoomPageClient({ room }: RoomPageClientProps) {
  const [gameStarted, setGameStarted] = useState(false);

  if (!gameStarted) {
    return <RoomIntro room={room} onStart={() => setGameStarted(true)} />;
  }

  // 저택 방은 새로운 MansionStudyGame 사용
  if (room.slug === 'cursed-mansion') {
    return <MansionStudyGame room={room} />;
  }

  return <ExplorationGame room={room} />;
}

