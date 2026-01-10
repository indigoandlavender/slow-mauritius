'use client';

import { useEffect, useRef, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mapboxgl: any = null;

interface StoryLocation {
  slug: string;
  title: string;
  subtitle?: string;
  category?: string;
  region?: string;
  coordinates: [number, number]; // [lng, lat]
}

interface MauritiusMapProps {
  stories: StoryLocation[];
  className?: string;
}

// Mauritius coordinates
const MAURITIUS_COORDINATES: Record<string, [number, number]> = {
  // Cities & Towns
  'Port Louis': [57.4989, -20.1609],
  'Curepipe': [57.5167, -20.3167],
  'Quatre Bornes': [57.4833, -20.2667],
  'Vacoas': [57.4833, -20.2833],
  'Phoenix': [57.4833, -20.2833],
  'Beau Bassin': [57.4667, -20.2333],
  'Rose Hill': [57.4667, -20.2333],
  'Mahebourg': [57.7000, -20.4083],
  'Goodlands': [57.6500, -20.0333],
  'Centre de Flacq': [57.7167, -20.1833],
  'Triolet': [57.5500, -20.0583],

  // Beach Areas
  'Grand Baie': [57.5833, -20.0167],
  'Flic en Flac': [57.3667, -20.2833],
  'Belle Mare': [57.7667, -20.1833],
  'Trou aux Biches': [57.5500, -20.0333],
  'Mont Choisy': [57.5667, -20.0167],
  'Pereybere': [57.5833, -20.0333],
  'Blue Bay': [57.7167, -20.4417],
  'Le Morne': [57.3167, -20.4500],
  'Tamarin': [57.3667, -20.3250],

  // Regions
  'North': [57.5833, -20.0333],
  'South': [57.5167, -20.4333],
  'East': [57.7500, -20.2000],
  'West': [57.3667, -20.3000],
  'Central': [57.5000, -20.2500],
  'Port Louis District': [57.5000, -20.1667],
  'Pamplemousses': [57.5667, -20.1000],
  'Rivière du Rempart': [57.6667, -20.1000],
  'Flacq': [57.7167, -20.1833],
  'Grand Port': [57.6833, -20.4000],
  'Savanne': [57.5167, -20.4667],
  'Black River': [57.3833, -20.3500],
  'Plaines Wilhems': [57.5000, -20.3000],
  'Moka': [57.5000, -20.2167],

  // Attractions
  'Black River Gorges': [57.4500, -20.4167],
  'Chamarel': [57.3833, -20.4333],
  'Seven Coloured Earths': [57.3833, -20.4333],
  'Île aux Cerfs': [57.8000, -20.2667],
  'Casela': [57.4000, -20.3167],
  'SSR Botanical Garden': [57.5667, -20.1000],
  'Pamplemousses Garden': [57.5667, -20.1000],
  'Ganga Talao': [57.4833, -20.4167],
  'Grand Bassin': [57.4833, -20.4167],

  // Default
  'Mauritius': [57.5522, -20.2759],
  'Multiple': [57.5522, -20.2759],
};

function getCoordinatesForStory(region: string): [number, number] | null {
  if (!region) return MAURITIUS_COORDINATES['Mauritius'];

  if (MAURITIUS_COORDINATES[region]) {
    return MAURITIUS_COORDINATES[region];
  }

  const lowerRegion = region.toLowerCase();
  for (const [key, coords] of Object.entries(MAURITIUS_COORDINATES)) {
    if (key.toLowerCase() === lowerRegion) {
      return coords;
    }
  }

  for (const [key, coords] of Object.entries(MAURITIUS_COORDINATES)) {
    if (lowerRegion.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerRegion)) {
      return coords;
    }
  }

  return MAURITIUS_COORDINATES['Mauritius'];
}

export default function MauritiusMap({ stories, className = '' }: MauritiusMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const map = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);
  const [mapError, setMapError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    const initMap = async () => {
      try {
        if (!mapboxgl) {
          const mb = await import('mapbox-gl');
          mapboxgl = mb.default;
          mapboxgl.accessToken = 'pk.eyJ1IjoiaW5kaWdvYW5kbGF2ZW5kZXIiLCJhIjoiY21kN3B0OTZvMGllNjJpcXY0MnZlZHVlciJ9.1-jV-Pze3d7HZseOAhmkCg';

          if (!document.getElementById('mapbox-gl-css')) {
            const link = document.createElement('link');
            link.id = 'mapbox-gl-css';
            link.rel = 'stylesheet';
            link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css';
            document.head.appendChild(link);
          }
        }

        if (!mapContainer.current) return;

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [57.5522, -20.2759], // Center on Mauritius
          zoom: 9.5,
          minZoom: 8,
          maxZoom: 14,
          attributionControl: false,
          scrollZoom: false,
          maxBounds: [
            [56.5, -21.0], // Southwest
            [58.5, -19.5]  // Northeast
          ],
        });

        map.current.on('error', () => {
          setMapError(true);
        });

        map.current.addControl(
          new mapboxgl.NavigationControl({ showCompass: false }),
          'top-right'
        );

        map.current.on('click', () => {
          map.current?.scrollZoom.enable();
        });

        mapContainer.current?.addEventListener('mouseleave', () => {
          map.current?.scrollZoom.disable();
        });

        map.current.on('load', () => {
          setIsLoading(false);

          markersRef.current.forEach(m => m.remove());
          markersRef.current = [];

          const storyGroups: Record<string, StoryLocation[]> = {};

          stories.forEach((story) => {
            const coords = story.coordinates;
            if (!coords) return;

            const key = `${coords[0].toFixed(2)},${coords[1].toFixed(2)}`;
            if (!storyGroups[key]) {
              storyGroups[key] = [];
            }
            storyGroups[key].push(story);
          });

          Object.entries(storyGroups).forEach(([key, groupStories]) => {
            const [lng, lat] = key.split(',').map(Number);

            const el = document.createElement('div');
            el.className = 'mauritius-story-marker';
            el.innerHTML = `
              <div style="position: relative;">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="10" fill="#0a0a0a" stroke="#ffffff" stroke-width="2"/>
                  ${groupStories.length > 1 ? `<text x="14" y="18" text-anchor="middle" fill="white" font-size="10" font-weight="500">${groupStories.length}</text>` : ''}
                </svg>
              </div>
            `;
            el.style.cursor = 'pointer';

            const popupContent = groupStories.length === 1
              ? `
                <a href="/story/${groupStories[0].slug}" style="display: block; padding: 12px 16px; max-width: 240px; background: #0a0a0a; text-decoration: none;">
                  <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: rgba(255,255,255,0.4); margin-bottom: 6px;">
                    ${groupStories[0].category || 'Story'}
                  </p>
                  <p style="font-family: 'Libre Baskerville', serif; font-size: 14px; font-weight: 400; color: white; margin-bottom: 4px; line-height: 1.3;">
                    ${groupStories[0].title}
                  </p>
                  ${groupStories[0].region ? `<p style="font-size: 11px; color: rgba(255,255,255,0.5);">${groupStories[0].region}</p>` : ''}
                </a>
              `
              : `
                <div style="padding: 12px 16px; max-width: 260px; background: #0a0a0a;">
                  <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: rgba(255,255,255,0.4); margin-bottom: 8px;">
                    ${groupStories.length} Stories
                  </p>
                  ${groupStories.slice(0, 5).map(s => `
                    <a href="/story/${s.slug}" style="display: block; padding: 6px 0; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.1);">
                      <p style="font-size: 13px; color: white; margin: 0; line-height: 1.3;">${s.title}</p>
                    </a>
                  `).join('')}
                  ${groupStories.length > 5 ? `<p style="font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 8px;">+ ${groupStories.length - 5} more</p>` : ''}
                </div>
              `;

            const popup = new mapboxgl!.Popup({
              offset: 20,
              closeButton: true,
              closeOnClick: false,
              className: 'mauritius-popup',
            }).setHTML(popupContent);

            const marker = new mapboxgl!.Marker(el)
              .setLngLat([lng, lat])
              .setPopup(popup)
              .addTo(map.current!);

            markersRef.current.push(marker);

            el.addEventListener('click', () => {
              markersRef.current.forEach(m => m.getPopup()?.remove());
              popup.addTo(map.current!);
            });
          });
        });
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError(true);
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      markersRef.current.forEach(m => m.remove());
      map.current?.remove();
      map.current = null;
    };
  }, [stories]);

  if (mapError) {
    return (
      <div className={`relative ${className}`}>
        <div className="w-full h-[400px] md:h-[500px] bg-[#1a1a1a] flex items-center justify-center">
          <p className="text-white/40 text-sm">Map unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center z-10">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}
      <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <p className="text-xs text-black/50 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
          Tap map to enable scroll
        </p>
      </div>
      <div
        ref={mapContainer}
        className="w-full h-[400px] md:h-[500px]"
        style={{ backgroundColor: '#f5f0e8' }}
      />
      <style jsx global>{`
        .mapboxgl-popup-content {
          background: #0a0a0a;
          border-radius: 0;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          padding: 0;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .mapboxgl-popup-close-button {
          color: rgba(255,255,255,0.5);
          font-size: 18px;
          padding: 4px 8px;
        }
        .mapboxgl-popup-close-button:hover {
          color: white;
          background: transparent;
        }
        .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
          border-top-color: #0a0a0a;
        }
        .mapboxgl-popup-anchor-top .mapboxgl-popup-tip {
          border-bottom-color: #0a0a0a;
        }
        .mapboxgl-popup-anchor-left .mapboxgl-popup-tip {
          border-right-color: #0a0a0a;
        }
        .mapboxgl-popup-anchor-right .mapboxgl-popup-tip {
          border-left-color: #0a0a0a;
        }
        .mauritius-story-marker {
          transition: transform 0.2s ease;
        }
        .mauritius-story-marker:hover {
          transform: scale(1.15);
        }
        .mapboxgl-ctrl-group {
          border-radius: 0 !important;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1) !important;
          background: #0a0a0a !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
        }
        .mapboxgl-ctrl-group button {
          border-radius: 0 !important;
          background: #0a0a0a !important;
        }
        .mapboxgl-ctrl-group button span {
          filter: invert(1);
        }
        .mapboxgl-ctrl-group button:hover {
          background: #1a1a1a !important;
        }
      `}</style>
    </div>
  );
}

export function prepareStoriesForMauritiusMap(stories: Array<{
  slug: string;
  title: string;
  subtitle?: string;
  category?: string;
  region?: string;
}>): StoryLocation[] {
  const result: StoryLocation[] = [];

  for (const story of stories) {
    const coordinates = getCoordinatesForStory(story.region || '');
    if (coordinates) {
      result.push({
        slug: story.slug,
        title: story.title,
        subtitle: story.subtitle,
        category: story.category,
        region: story.region,
        coordinates,
      });
    }
  }

  return result;
}
