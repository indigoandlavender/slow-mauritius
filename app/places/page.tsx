"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PlaceCard from "@/components/PlaceCard";
import MauritiusMapWrapper from "@/components/MauritiusMapWrapper";
import { Search } from "lucide-react";

interface Place {
  slug: string;
  name: string;
  subtitle?: string;
  region?: string;
  heroImage?: string;
  excerpt?: string;
}

function PlacesContent() {
  const searchParams = useSearchParams();
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");

  // Get unique regions from places
  const [regions, setRegions] = useState<string[]>([]);

  // Set search query from URL on mount
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setSearchQuery(q);
    }
    const region = searchParams.get("region");
    if (region) {
      setSelectedRegion(region);
    }
  }, [searchParams]);

  useEffect(() => {
    fetch("/api/places")
      .then((res) => res.json())
      .then((data) => {
        const placesData = data.places || [];
        setPlaces(placesData);
        setFilteredPlaces(placesData);

        // Extract unique regions
        const uniqueRegions = Array.from(
          new Set(
            placesData
              .map((p: Place) => p.region)
              .filter((r: string | undefined): r is string => !!r)
          )
        ) as string[];
        setRegions(uniqueRegions.sort());

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Apply search and filters
  useEffect(() => {
    let filtered = [...places];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(query) ||
          p.subtitle?.toLowerCase().includes(query) ||
          p.excerpt?.toLowerCase().includes(query) ||
          p.region?.toLowerCase().includes(query)
      );
    }

    // Region filter
    if (selectedRegion !== "all") {
      filtered = filtered.filter(
        (p) => p.region?.toLowerCase() === selectedRegion.toLowerCase()
      );
    }

    setFilteredPlaces(filtered);
  }, [places, searchQuery, selectedRegion]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedRegion("all");
  };

  const hasActiveFilters = searchQuery || selectedRegion !== "all";

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="max-w-4xl">
            <p className="text-xs tracking-[0.4em] uppercase text-white/40 mb-6">
              Destinations
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl tracking-[0.15em] font-light mb-6">
              P L A C E S
            </h1>
            <p className="text-lg md:text-xl text-white/50 max-w-2xl font-serif italic">
              The villages, towns, and landscapes of Mauritius worth knowing
            </p>
          </div>
        </div>
      </section>

      {/* Map Section */}
      {places.length > 0 && !loading && (
        <section className="pb-16">
          <div className="container mx-auto px-6 lg:px-16">
            <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-6">
              Explore by Location
            </p>
            <MauritiusMapWrapper
              stories={places.map(p => ({
                slug: p.slug,
                title: p.name,
                region: p.region
              }))}
            />
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
                placeholder="Search places, regions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-4 py-3 bg-transparent border-b border-white/20 focus:border-white/60 focus:outline-none text-base placeholder:text-white/30 transition-colors text-white"
              />
            </div>
          </div>

          {/* Region Filter */}
          {regions.length > 0 && (
            <div className="flex flex-col md:flex-row md:items-start gap-8">
              <div>
                <h2 className="text-xs tracking-[0.2em] uppercase text-white/40 mb-4">
                  Region
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setSelectedRegion("all")}
                    className={`text-xs tracking-[0.15em] uppercase px-4 py-3 border transition-colors ${
                      selectedRegion === "all"
                        ? "bg-white text-[#0a0a0a] border-white"
                        : "bg-transparent text-white/60 border-white/20 hover:border-white/40"
                    }`}
                  >
                    All
                  </button>
                  {regions.map((region) => (
                    <button
                      key={region}
                      onClick={() =>
                        setSelectedRegion(
                          region === selectedRegion ? "all" : region
                        )
                      }
                      className={`text-xs tracking-[0.15em] uppercase px-4 py-3 border transition-colors ${
                        selectedRegion === region
                          ? "bg-white text-[#0a0a0a] border-white"
                          : "bg-transparent text-white/60 border-white/20 hover:border-white/40"
                      }`}
                    >
                      {region}
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
          )}

          {/* Results count */}
          <div className="mt-8 text-sm text-white/40">
            {filteredPlaces.length} {filteredPlaces.length === 1 ? "place" : "places"}
            {hasActiveFilters && " found"}
          </div>
        </div>
      </section>

      {/* Places Grid */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-16">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          ) : filteredPlaces.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPlaces.map((place) => (
                <PlaceCard key={place.slug} place={place} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-white/50 mb-4">No places match your search.</p>
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
function PlacesLoading() {
  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="max-w-4xl">
            <p className="text-xs tracking-[0.4em] uppercase text-white/40 mb-6">
              Destinations
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl tracking-[0.15em] font-light mb-6">
              P L A C E S
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
export default function PlacesPage() {
  return (
    <Suspense fallback={<PlacesLoading />}>
      <PlacesContent />
    </Suspense>
  );
}
