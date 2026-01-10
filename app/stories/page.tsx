"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import StoryCard from "@/components/StoryCard";
import MauritiusMapWrapper from "@/components/MauritiusMapWrapper";
import { Search } from "lucide-react";

interface Story {
  slug: string;
  title: string;
  subtitle?: string;
  category?: string;
  sourceType?: string;
  heroImage?: string;
  excerpt?: string;
  readTime?: string;
  featured?: string;
  tags?: string;
  region?: string;
}

// Inner component that uses useSearchParams
function StoriesContent() {
  const searchParams = useSearchParams();
  const [stories, setStories] = useState<Story[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  // Search and filter states - initialize from URL query param
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Set search query from URL on mount
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  // Categories - The Edit's filters (alphabetically sorted)
  const categories = [
    { slug: "all", label: "All" },
    { slug: "Architecture", label: "Architecture" },
    { slug: "Art", label: "Art" },
    { slug: "Design", label: "Design" },
    { slug: "Food", label: "Food" },
    { slug: "History", label: "History" },
    { slug: "Movies", label: "Movies" },
    { slug: "Music", label: "Music" },
    { slug: "People", label: "People" },
    { slug: "Systems", label: "Systems" },
  ];

  useEffect(() => {
    fetch("/api/stories")
      .then((res) => res.json())
      .then((data) => {
        setStories(data.stories || []);
        setFilteredStories(data.stories || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Apply search and filters
  useEffect(() => {
    let filtered = [...stories];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.title?.toLowerCase().includes(query) ||
          s.subtitle?.toLowerCase().includes(query) ||
          s.excerpt?.toLowerCase().includes(query) ||
          s.tags?.toLowerCase().includes(query) ||
          s.region?.toLowerCase().includes(query) ||
          s.category?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (s) => s.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredStories(filtered);
  }, [stories, searchQuery, selectedCategory]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  const hasActiveFilters = searchQuery || selectedCategory !== "all";

  const featuredStories = filteredStories.filter(
    (s) => s.featured?.toLowerCase() === "true"
  );
  const otherStories = filteredStories.filter(
    (s) => s.featured?.toLowerCase() !== "true"
  );

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="max-w-4xl">
            <p className="text-xs tracking-[0.4em] uppercase text-white/40 mb-6">
              The Edit
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl tracking-[0.15em] font-light mb-6">
              S T O R I E S
            </h1>
            <p className="text-lg md:text-xl text-white/50 max-w-2xl font-serif italic">
              The history, craft, and culture that make Mauritius make sense
            </p>
          </div>
        </div>
      </section>

      {/* Map Section */}
      {stories.length > 0 && !loading && (
        <section className="pb-16">
          <div className="container mx-auto px-6 lg:px-16">
            <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-6">
              Explore by Location
            </p>
            <MauritiusMapWrapper stories={stories} />
          </div>
        </section>
      )}

      {/* Search & Filters */}
      <section className="py-8 border-y border-white/10">
        <div className="container mx-auto px-6 lg:px-16">
          {/* Search Bar */}
          <div className="max-w-xl mb-10">
            <div className="relative">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search stories, topics, regions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-4 py-3 bg-transparent border-b border-white/20 focus:border-white/60 focus:outline-none text-base placeholder:text-white/30 transition-colors text-white"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div>
              <h2 className="text-xs tracking-[0.2em] uppercase text-white/40 mb-4">
                Category
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() =>
                      setSelectedCategory(
                        cat.slug === selectedCategory ? "all" : cat.slug
                      )
                    }
                    className={`text-xs tracking-[0.15em] uppercase px-4 py-3 border transition-colors ${
                      selectedCategory === cat.slug
                        ? "bg-white text-[#0a0a0a] border-white"
                        : "bg-transparent text-white/60 border-white/20 hover:border-white/40"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <div className="md:ml-auto md:self-end">
                <button
                  onClick={clearFilters}
                  className="text-xs tracking-[0.15em] uppercase text-white/40 hover:text-white transition-colors underline underline-offset-4 py-3 px-2 -mx-2"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          {/* Results count */}
          <div className="mt-8 text-sm text-white/40">
            {filteredStories.length} {filteredStories.length === 1 ? "story" : "stories"}
            {hasActiveFilters && " found"}
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-16">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          ) : filteredStories.length > 0 ? (
            <>
              {/* Featured Stories */}
              {featuredStories.length > 0 && !hasActiveFilters && (
                <div className="mb-20">
                  <p className="text-xs tracking-[0.3em] text-white/40 mb-8">
                    FEATURED
                  </p>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredStories.map((story) => (
                      <StoryCard key={story.slug} story={story} />
                    ))}
                  </div>
                </div>
              )}

              {/* All/Filtered Stories */}
              {(hasActiveFilters ? filteredStories : otherStories).length > 0 && (
                <div>
                  {featuredStories.length > 0 && !hasActiveFilters && (
                    <p className="text-xs tracking-[0.3em] text-white/40 mb-8">
                      ALL STORIES
                    </p>
                  )}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(hasActiveFilters ? filteredStories : otherStories).map(
                      (story) => (
                        <StoryCard key={story.slug} story={story} />
                      )
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-white/50 mb-4">No stories match your search.</p>
              <button
                onClick={clearFilters}
                className="text-white/70 hover:text-white underline underline-offset-4"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// Loading fallback
function StoriesLoading() {
  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="max-w-4xl">
            <p className="text-xs tracking-[0.4em] uppercase text-white/40 mb-6">
              The Edit
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl tracking-[0.15em] font-light mb-6">
              S T O R I E S
            </h1>
          </div>
        </div>
      </section>
      <div className="flex justify-center py-24">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    </div>
  );
}

// Main export with Suspense boundary
export default function StoriesPage() {
  return (
    <Suspense fallback={<StoriesLoading />}>
      <StoriesContent />
    </Suspense>
  );
}
