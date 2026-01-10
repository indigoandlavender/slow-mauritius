"use client";

import Link from "next/link";
import Image from "next/image";

interface Place {
  slug: string;
  name: string;
  subtitle?: string;
  region?: string;
  heroImage?: string;
  excerpt?: string;
}

interface PlaceCardProps {
  place: Place;
}

export default function PlaceCard({ place }: PlaceCardProps) {
  return (
    <Link href={`/places/${place.slug}`} className="group block">
      {/* Image */}
      <div className="aspect-[4/3] bg-white/5 mb-4 overflow-hidden relative">
        {place.heroImage ? (
          <Image
            src={place.heroImage}
            alt={place.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5" />
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        {/* Region tag */}
        {place.region && (
          <p className="text-xs tracking-[0.2em] uppercase text-white/40">
            {place.region}
          </p>
        )}

        {/* Title */}
        <h3 className="text-lg font-light group-hover:text-white/70 transition-colors">
          {place.name}
        </h3>

        {/* Subtitle */}
        {place.subtitle && (
          <p className="text-sm text-white/50 font-serif italic line-clamp-2">
            {place.subtitle}
          </p>
        )}
      </div>
    </Link>
  );
}
