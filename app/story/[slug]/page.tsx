"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import StoryBody from "@/components/StoryBody";

interface Story {
  slug: string;
  title: string;
  subtitle?: string;
  category?: string;
  sourceType?: string;
  heroImage?: string;
  heroCaption?: string;
  excerpt?: string;
  body?: string;
  readTime?: string;
  year?: string;
  textBy?: string;
  imagesBy?: string;
  sources?: string;
  the_facts?: string;
  tags?: string;
  region?: string;
}

interface StoryImage {
  story_slug: string;
  image_order: string;
  image_url: string;
  caption?: string;
}

export default function StoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [story, setStory] = useState<Story | null>(null);
  const [images, setImages] = useState<StoryImage[]>([]);
  const [relatedStories, setRelatedStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Fetch current story
    fetch(`/api/stories/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setStory(data.story);
        setImages(data.images || []);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  // Fetch related stories when main story loads
  useEffect(() => {
    if (!story) return;
    
    fetch("/api/stories")
      .then((res) => res.json())
      .then((data) => {
        const allStories: Story[] = data.stories || [];
        const related = allStories.filter((s) => {
          if (s.slug === slug) return false;
          
          // Match by category
          if (s.category && story.category && s.category === story.category) return true;
          
          // Match by overlapping tags
          if (s.tags && story.tags) {
            const sTags = s.tags.toLowerCase().split(",").map((t) => t.trim());
            const storyTags = story.tags.toLowerCase().split(",").map((t) => t.trim());
            if (sTags.some((t) => storyTags.includes(t))) return true;
          }
          
          // Match by region
          if (s.region && story.region && s.region === story.region) return true;
          
          return false;
        });
        
        setRelatedStories(related.slice(0, 3));
      });
  }, [story, slug]);

  if (loading) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="bg-[#0a0a0a] text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Story not found</h1>
          <Link href="/stories" className="text-white/60 hover:text-white underline">
            Back to Stories
          </Link>
        </div>
      </div>
    );
  }

  // Parse sources (separated by ;;)
  const sources = story.sources
    ? story.sources.split(";;").map((s) => s.trim()).filter(Boolean)
    : [];

  // Parse facts (separated by ;;)
  const facts = story.the_facts
    ? story.the_facts.split(";;").map((f) => f.trim()).filter(Boolean)
    : [];

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      {/* Hero Image */}
      {story.heroImage && (
        <section className="relative w-full h-[60vh] md:h-[70vh]">
          <Image
            src={story.heroImage}
            alt={story.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/30" />
          {story.heroCaption && (
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-white/60 text-sm max-w-4xl mx-auto text-center">
                {story.heroCaption}
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
          <Link href="/stories" className="hover:text-white transition-colors">
            Stories
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white/60">{story.title}</span>
        </nav>

        {/* Meta */}
        <div className="flex items-center gap-3 text-sm text-white/40 mb-6">
          {story.category && (
            <>
              <span className="uppercase tracking-wide">{story.category}</span>
              <span>·</span>
            </>
          )}
          {story.readTime && <span>{story.readTime}</span>}
        </div>

        {/* Source Type Badge */}
        {story.sourceType && (
          <div className="mb-6">
            <span className="inline-block text-xs uppercase tracking-widest text-white/40 border border-white/20 px-3 py-1">
              {story.sourceType}
            </span>
          </div>
        )}

        {/* Tags */}
        {story.tags && (
          <div className="flex flex-wrap gap-2 mb-6">
            {story.tags.split(",").map((tag) => tag.trim()).filter(Boolean).map((tag, index) => (
              <Link
                key={index}
                href={`/stories?q=${encodeURIComponent(tag)}`}
                className="text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/30 px-3 py-1 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-4 leading-tight">
          {story.title}
        </h1>

        {/* Subtitle */}
        {story.subtitle && (
          <p className="text-xl text-white/60 italic mb-8 font-serif">
            {story.subtitle}
          </p>
        )}

        <hr className="border-white/10 mb-12" />

        {/* Body */}
        {story.body && <StoryBody content={story.body} />}

        {/* The Facts */}
        {facts.length > 0 && (
          <>
            <hr className="border-white/10 my-12" />
            <div className="bg-white/5 p-8">
              <h3 className="uppercase tracking-wide text-xs font-medium mb-6 text-white/60">
                The Facts
              </h3>
              <ul className="space-y-3 text-white/70 text-sm">
                {facts.map((fact, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-white/30 mt-1">•</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* Gallery */}
        {images.length > 0 && (
          <>
            <hr className="border-white/10 my-12" />
            <div className="space-y-8">
              {images.map((img, index) => (
                <figure key={index}>
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={img.image_url}
                      alt={img.caption || story.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {img.caption && (
                    <figcaption className="text-sm text-white/40 mt-3 text-center">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </>
        )}

        {/* Sources */}
        {sources.length > 0 && (
          <>
            <hr className="border-white/10 my-12" />
            <div className="text-sm text-white/50">
              <h3 className="uppercase tracking-wide text-xs font-medium mb-4 text-white/40">
                Sources
              </h3>
              <ul className="space-y-2">
                {sources.map((source, index) => (
                  <li key={index}>{source}</li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* Footer */}
        <hr className="border-white/10 my-12" />
        <footer className="text-sm text-white/40 flex flex-wrap gap-x-4 gap-y-1">
          {story.textBy && <span>Text — {story.textBy}</span>}
          {story.imagesBy && <span>Images — {story.imagesBy}</span>}
          {story.year && <span>{story.year}</span>}
        </footer>

        {/* Related Stories */}
        {relatedStories.length > 0 && (
          <>
            <hr className="border-white/10 my-12" />
            <div>
              <h3 className="uppercase tracking-wide text-xs font-medium mb-8 text-white/40">
                Related Stories
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedStories.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/story/${related.slug}`}
                    className="group"
                  >
                    <div className="relative aspect-[4/3] mb-4 overflow-hidden bg-white/5">
                      {related.heroImage ? (
                        <Image
                          src={related.heroImage}
                          alt={related.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/5" />
                      )}
                    </div>
                    <p className="text-xs text-white/40 uppercase tracking-wide mb-2">
                      {related.category}
                    </p>
                    <h4 className="text-white group-hover:text-white/80 transition-colors font-serif">
                      {related.title}
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
            href="/stories"
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
            All Stories
          </Link>
        </div>
      </article>
    </div>
  );
}
