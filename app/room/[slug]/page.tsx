import { notFound } from 'next/navigation';
import { getExplorationRoomBySlug } from '@/lib/explorationRoomData';
import RoomPageClient from './RoomPageClient';

export async function generateStaticParams() {
  return [
    { slug: 'lost-laboratory' },
    { slug: 'cursed-mansion' },
  ];
}

export default async function RoomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const room = getExplorationRoomBySlug(slug);

  if (!room) {
    notFound();
  }

  return <RoomPageClient room={room} />;
}
