import Link from "next/link";
import { getSheetData } from "@/lib/sheets";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageSection {
  page_id: string;
  page_title: string;
  section_order: number;
  section_title: string;
  section_content: string;
  section_type: string;
}

interface AboutSettings {
  hero_title: string;
  hero_subtitle: string;
  quote: string;
  quote_subtext: string;
}

async function getAboutContent() {
  try {
    const pagesData = await getSheetData("Website_Pages");
    const aboutSections = pagesData
      .filter((row: any) => row.page_id === "about")
      .sort((a: any, b: any) => (parseInt(a.section_order) || 0) - (parseInt(b.section_order) || 0));

    const settingsData = await getSheetData("Website_Settings");
    const settings: { [key: string]: string } = {};
    settingsData.forEach((row: any) => {
      if (row.Key) settings[row.Key] = row.Value || "";
    });

    return {
      sections: aboutSections as PageSection[],
      settings: {
        hero_title: settings.about_hero_title || "A B O U T",
        hero_subtitle: settings.about_hero_subtitle || "Travel doesn't expand your mind. Access does.",
        quote: settings.about_quote || "We'd rather lose a booking than send you somewhere we wouldn't go ourselves.",
        quote_subtext: settings.about_quote_subtext || "",
      },
    };
  } catch (error) {
    console.error("Error fetching about content:", error);
    return {
      sections: [],
      settings: {
        hero_title: "A B O U T",
        hero_subtitle: "Travel doesn't expand your mind. Access does.",
        quote: "We'd rather lose a booking than send you somewhere we wouldn't go ourselves.",
        quote_subtext: "",
      },
    };
  }
}

export default async function AboutPage() {
  const { sections, settings } = await getAboutContent();

  const introSection = sections.find(s => s.section_type === "intro");
  const peopleSection = sections.find(s => s.section_type === "people");
  const accessSection = sections.find(s => s.section_type === "access");
  const listPositive = sections.find(s => s.section_type === "list_positive");
  const listNegative = sections.find(s => s.section_type === "list_negative");
  const ctaSection = sections.find(s => s.section_type === "cta");

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      {/* Hero - Full viewport, centered */}
      <section className="min-h-screen flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[url('/images/texture-grain.png')] opacity-[0.03] pointer-events-none" />
        <div className="container mx-auto px-6 lg:px-16 text-center max-w-4xl relative z-10">
          <p className="text-xs tracking-[0.4em] uppercase text-white/40 mb-8">
            Slow Mauritius
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl tracking-[0.2em] font-light mb-8">
            {settings.hero_title}
          </h1>
          <p className="text-xl md:text-2xl text-white/60 font-serif italic max-w-2xl mx-auto">
            {settings.hero_subtitle}
          </p>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="w-[1px] h-16 bg-gradient-to-b from-white/0 via-white/20 to-white/0" />
        </div>
      </section>

      {/* The Problem - Magazine two-column */}
      {introSection && (
        <section className="py-24 md:py-32 border-t border-white/10">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 max-w-6xl mx-auto">
              <div className="lg:col-span-4">
                <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-4">
                  {introSection.section_title}
                </p>
                <h2 className="font-serif text-3xl md:text-4xl leading-tight text-white/90">
                  Tourists don't gain wisdom — they collect backdrops.
                </h2>
              </div>
              <div className="lg:col-span-8 space-y-6 text-white/60 leading-relaxed text-lg">
                {introSection.section_content.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Pull Quote - Full width dark */}
      <section className="py-20 md:py-28 bg-[#0d0d0d]">
        <div className="container mx-auto px-6 lg:px-16 max-w-4xl text-center">
          <p className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight text-white/80 italic">
            "The best guide in Le Morne doesn't work for a tour company. He's a retired geology professor who only takes guests he likes."
          </p>
        </div>
      </section>

      {/* The People Who Stayed - Staggered layout */}
      {peopleSection && (
        <section className="py-24 md:py-32 border-t border-white/10">
          <div className="container mx-auto px-6 lg:px-16 max-w-5xl">
            <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-16 text-center">
              {peopleSection.section_title}
            </p>
            
            <div className="space-y-16">
              {peopleSection.section_content.split('\n\n').map((para, i) => (
                <div 
                  key={i} 
                  className={`max-w-2xl ${i % 2 === 0 ? 'mr-auto' : 'ml-auto text-right'}`}
                >
                  <p className={`text-lg md:text-xl leading-relaxed ${i === 0 ? 'font-serif text-2xl md:text-3xl text-white/90' : 'text-white/60'}`}>
                    {para}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* The Access - Dark inset */}
      {accessSection && (
        <section className="py-24 md:py-32 bg-[#0d0d0d]">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
                <div>
                  <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-6">
                    {accessSection.section_title}
                  </p>
                  <h2 className="font-serif text-3xl md:text-4xl leading-tight text-white/90">
                    Some doors don't open for tourists.
                  </h2>
                </div>
                <div className="space-y-6 text-white/60 leading-relaxed">
                  {accessSection.section_content.split('\n\n').slice(1).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quote Banner */}
      {settings.quote && (
        <section className="py-16 md:py-20 border-y border-white/10 bg-[#0a0a0a]">
          <div className="container mx-auto px-6 lg:px-16 max-w-4xl">
            <div className="flex items-start gap-6">
              <span className="font-serif text-6xl md:text-8xl text-white/20 leading-none">"</span>
              <div>
                <p className="font-serif text-xl md:text-2xl leading-relaxed text-white/80">
                  {settings.quote}
                </p>
                {settings.quote_subtext && (
                  <p className="text-white/40 text-sm mt-4">
                    {settings.quote_subtext}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Who This Is For - Two columns with contrast */}
      {(listPositive || listNegative) && (
        <section className="border-b border-white/10">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Positive - Dark */}
              {listPositive && (
                <div className="py-20 md:py-28 px-6 lg:px-16 bg-[#0a0a0a]">
                  <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-8">
                    {listPositive.section_title}
                  </p>
                  <ul className="space-y-4">
                    {listPositive.section_content.split('|').map((item, i) => (
                      <li key={i} className="text-white/70 text-lg flex items-start gap-3">
                        <span className="text-white/30 mt-1">→</span>
                        <span>{item.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Negative - Darker */}
              {listNegative && (
                <div className="py-20 md:py-28 px-6 lg:px-16 bg-[#050505]">
                  <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-8">
                    {listNegative.section_title}
                  </p>
                  <ul className="space-y-4">
                    {listNegative.section_content.split('|').map((item, i) => (
                      <li key={i} className="text-white/40 text-lg flex items-start gap-3">
                        <span className="text-white/20 mt-1">×</span>
                        <span>{item.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-[#0a0a0a]">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl text-center">
          {ctaSection && (
            <>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-8 text-white/90">
                {ctaSection.section_content.split('\n\n')[0]}
              </h2>
              <p className="text-white/50 leading-relaxed mb-12 text-lg">
                {ctaSection.section_content.split('\n\n')[1]}
              </p>
            </>
          )}
          <Link
            href="/plan-your-trip"
            className="inline-block border border-white/20 px-12 py-4 text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-[#0a0a0a] transition-colors"
          >
            Begin The Conversation
          </Link>
        </div>
      </section>
    </div>
  );
}
