'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, Component, ReactNode } from 'react';
import Link from 'next/link';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
  onError?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function MapFallback({ stories }: { stories: Array<{ slug: string; title: string; region?: string; category?: string }> }) {
  const byRegion = stories.reduce((acc, story) => {
    const region = story.region || 'Mauritius';
    if (!acc[region]) acc[region] = [];
    acc[region].push(story);
    return acc;
  }, {} as Record<string, typeof stories>);

  const sortedRegions = Object.keys(byRegion).sort();

  return (
    <div className="w-full bg-[#111] px-6 py-8 border border-white/10">
      <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-6">
        Stories by Region
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
        {sortedRegions.slice(0, 9).map(region => (
          <div key={region}>
            <h3 className="text-sm text-white/70 mb-2">{region}</h3>
            <ul className="space-y-1">
              {byRegion[region].slice(0, 3).map(story => (
                <li key={story.slug}>
                  <Link
                    href={`/story/${story.slug}`}
                    className="text-sm text-white/40 hover:text-white transition-colors"
                  >
                    {story.title}
                  </Link>
                </li>
              ))}
              {byRegion[region].length > 3 && (
                <li className="text-xs text-white/30">+ {byRegion[region].length - 3} more</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

const MauritiusMap = dynamic(() => import('./MauritiusMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] md:h-[500px] bg-[#1a1a1a] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  ),
});

const MAURITIUS_COORDINATES: Record<string, [number, number]> = {
  'Port Louis': [57.4989, -20.1609],
  'Curepipe': [57.5167, -20.3167],
  'Grand Baie': [57.5833, -20.0167],
  'Flic en Flac': [57.3667, -20.2833],
  'Belle Mare': [57.7667, -20.1833],
  'Le Morne': [57.3167, -20.4500],
  'Mahebourg': [57.7000, -20.4083],
  'Black River Gorges': [57.4500, -20.4167],
  'Chamarel': [57.3833, -20.4333],
  'North': [57.5833, -20.0333],
  'South': [57.5167, -20.4333],
  'East': [57.7500, -20.2000],
  'West': [57.3667, -20.3000],
  'Central': [57.5000, -20.2500],
  'Mauritius': [57.5522, -20.2759],
  'Multiple': [57.5522, -20.2759],
};

const prepareStoriesForMauritiusMap = (stories: Array<{
  slug: string;
  title: string;
  subtitle?: string;
  category?: string;
  region?: string;
}>) => {
  const getCoordinates = (region: string): [number, number] => {
    if (!region) return MAURITIUS_COORDINATES['Mauritius'];
    if (MAURITIUS_COORDINATES[region]) return MAURITIUS_COORDINATES[region];

    const lowerRegion = region.toLowerCase();
    for (const [key, coords] of Object.entries(MAURITIUS_COORDINATES)) {
      if (key.toLowerCase() === lowerRegion) return coords;
      if (lowerRegion.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerRegion)) return coords;
    }
    return MAURITIUS_COORDINATES['Mauritius'];
  };

  return stories.map(story => ({
    slug: story.slug,
    title: story.title,
    subtitle: story.subtitle,
    category: story.category,
    region: story.region,
    coordinates: getCoordinates(story.region || ''),
  }));
};

interface MauritiusMapWrapperProps {
  stories: Array<{
    slug: string;
    title: string;
    subtitle?: string;
    category?: string;
    region?: string;
  }>;
  className?: string;
}

export default function MauritiusMapWrapper({ stories, className }: MauritiusMapWrapperProps) {
  const [mapError, setMapError] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (stories.length === 0) {
    return (
      <div className="w-full h-[300px] bg-[#1a1a1a] flex items-center justify-center">
        <p className="text-white/40 text-sm">No stories to display on map</p>
      </div>
    );
  }

  if (!isClient || mapError) {
    return <MapFallback stories={stories} />;
  }

  const mappedStories = prepareStoriesForMauritiusMap(stories);

  return (
    <ErrorBoundary fallback={<MapFallback stories={stories} />} onError={() => setMapError(true)}>
      <MauritiusMap stories={mappedStories} className={className} />
    </ErrorBoundary>
  );
}
