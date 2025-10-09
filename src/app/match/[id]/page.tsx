import { notFound } from 'next/navigation';
import MatchDetails from '@/components/MatchDetails';

interface MatchPageProps {
  params: {
    id: string;
  };
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { id } = params;

  if (!id || typeof id !== 'string') {
    notFound();
  }

  return <MatchDetails matchId={id} />;
}

export async function generateMetadata({ params }: MatchPageProps) {
  return {
    title: `Match ${params.id} - AI League Coach`,
    description: 'Detailed match analysis with AI insights',
  };
}
