import Link from 'next/link';
import Image from 'next/image';

interface Story {
  slug: string;
  title: string;
  subtitle?: string;
  category?: string;
  sourceType?: string;
  heroImage?: string;
  excerpt?: string;
  readTime?: string;
}

interface StoryCardProps {
  story: Story;
}

export default function StoryCard({ story }: StoryCardProps) {
  return (
    <Link href={`/story/${story.slug}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[4/5] mb-4 overflow-hidden bg-white/5">
        {story.heroImage ? (
          <Image
            src={story.heroImage}
            alt={story.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white/20 text-sm">No image</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          {story.category && (
            <span className="text-xs uppercase tracking-wide text-white/50">
              {story.category}
            </span>
          )}
          {story.category && story.readTime && (
            <span className="text-white/30">·</span>
          )}
          {story.readTime && (
            <span className="text-xs text-white/40">
              {story.readTime}
            </span>
          )}
        </div>
        <h3 className="font-serif text-xl text-white mb-2 group-hover:text-white/80 transition-colors">
          {story.title}
        </h3>
        {story.subtitle && (
          <p className="text-sm text-white/60 line-clamp-2">
            {story.subtitle}
          </p>
        )}
      </div>
    </Link>
  );
}
