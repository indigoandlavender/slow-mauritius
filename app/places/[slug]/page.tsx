"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import StoryBody from "@/components/StoryBody";

interface Place {
  slug: string;
  name: string;
  subtitle?: string;
  region?: string;
  heroImage?: string;
  heroCaption?: string;
  excerpt?: string;
  body?: string;
  description?: string;
  highlights?: string;
  getting_there?: string;
  best_time?: string;
}

export default function PlacePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [place, setPlace] = useState<Place | null>(null);
  const [relatedPlaces, setRelatedPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/places/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setPlace(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  // Fetch related places when main place loads
  useEffect(() => {
    if (!place) return;

    fetch("/api/places")
      .then((res) => res.json())
      .then((data) => {
        const allPlaces: Place[] = data.places || [];
        const related = allPlaces.filter((p) => {
          if (p.slug === slug) return false;
          // Match by region
          if (p.region && place.region && p.region === place.region) return true;
          return false;
        });
        setRelatedPlaces(related.slice(0, 3));
      });
  }, [place, slug]);

  if (loading) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="bg-[#0a0a0a] text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Place not found</h1>
          <Link href="/places" className="text-white/60 hover:text-white underline">
            Back to Places
          </Link>
        </div>
      </div>
    );
  }

  // Parse highlights (separated by ;;)
  const highlights = place.highlights
    ? place.highlights.split(";;").map((h) => h.trim()).filter(Boolean)
    : [];

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      {/* Hero Image */}
      {place.heroImage && (
        <section className="relative w-full h-[60vh] md:h-[70vh]">
          <Image
            src={place.heroImage}
            alt={place.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/30" />
          {place.heroCaption && (
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-white/60 text-sm max-w-4xl mx-auto text-center">
                {place.heroCaption}
              </p>
            </div>
          )}
        </section>
      )}

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 py-16">
        {/* Breadcrumb */}
        <nav className="text-sm text-white/40 mb-8">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/places" className="hover:text-white transition-colors">
            Places
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white/60">{place.name}</span>
        </nav>

        {/* Region */}
        {place.region && (
          <div className="mb-6">
            <Link
              href={`/places?region=${encodeURIComponent(place.region)}`}
              className="text-xs uppercase tracking-wide text-white/40 hover:text-white transition-colors"
            >
              {place.region}
            </Link>
          </div>
        )}

        {/* Title */}
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-4 leading-tight">
          {place.name}
        </h1>

        {/* Subtitle */}
        {place.subtitle && (
          <p className="text-xl text-white/60 italic mb-8 font-serif">
            {place.subtitle}
          </p>
        )}

        <hr className="border-white/10 mb-12" />

        {/* Body or Description */}
        {(place.body || place.description) && (
          <StoryBody content={place.body || place.description || ""} />
        )}

        {/* Highlights */}
        {highlights.length > 0 && (
          <>
            <hr className="border-white/10 my-12" />
            <div className="bg-white/5 p-8">
              <h3 className="uppercase tracking-wide text-xs font-medium mb-6 text-white/60">
                Highlights
              </h3>
              <ul className="space-y-3 text-white/70 text-sm">
                {highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-white/30 mt-1">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* Practical Info */}
        {(place.getting_there || place.best_time) && (
          <>
            <hr className="border-white/10 my-12" />
            <div className="grid md:grid-cols-2 gap-8">
              {place.getting_there && (
                <div>
                  <h3 className="uppercase tracking-wide text-xs font-medium mb-4 text-white/40">
                    Getting There
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {place.getting_there}
                  </p>
                </div>
              )}
              {place.best_time && (
                <div>
                  <h3 className="uppercase tracking-wide text-xs font-medium mb-4 text-white/40">
                    Best Time to Visit
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {place.best_time}
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Related Places */}
        {relatedPlaces.length > 0 && (
          <>
            <hr className="border-white/10 my-12" />
            <div>
              <h3 className="uppercase tracking-wide text-xs font-medium mb-8 text-white/40">
                Nearby in {place.region}
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPlaces.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/places/${related.slug}`}
                    className="group"
                  >
                    <div className="relative aspect-[4/3] mb-4 overflow-hidden bg-white/5">
                      {related.heroImage ? (
                        <Image
                          src={related.heroImage}
                          alt={related.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/5" />
                      )}
                    </div>
                    <p className="text-xs text-white/40 uppercase tracking-wide mb-2">
                      {related.region}
                    </p>
                    <h4 className="text-white group-hover:text-white/80 transition-colors font-serif">
                      {related.name}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Back Link */}
        <div className="mt-12">
          <Link
            href="/places"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <polyline points="10,3 5,8 10,13" />
            </svg>
            All Places
          </Link>
        </div>
      </article>
    </div>
  );
}
