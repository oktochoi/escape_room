import { notFound } from 'next/navigation';
import { getExplorationRoomBySlug } from '@/lib/explorationRoomData';
import RoomPageClient from './RoomPageClient';

export async function generateStaticParams() {
  return [
    { slug: 'lost-laboratory' },
    { slug: 'cursed-mansion' },
  ];
}

export default function RoomPage({ params }: { params: { slug: string } }) {
  const room = getExplorationRoomBySlug(params.slug);

  if (!room) {
    notFound();
  }

  return <RoomPageClient room={room} />;
}
