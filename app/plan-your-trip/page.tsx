"use client";

import { useState, useEffect } from "react";
import PlanYourTripForm from "@/components/PlanYourTripForm";

export default function PlanYourTripPage() {
  const [journeys, setJourneys] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/journeys")
      .then((r) => r.json())
      .then((data) => {
        setJourneys(data.journeys || []);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="max-w-4xl">
            <p className="text-xs tracking-[0.4em] uppercase text-white/40 mb-6">
              Begin The Conversation
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl tracking-[0.15em] font-light mb-6">
              P L A N &nbsp; Y O U R &nbsp; T R I P
            </h1>
            <p className="text-lg md:text-xl text-white/50 max-w-2xl">
              No commitment. No pressure. Just tell us what you're dreaming about.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
          <PlanYourTripForm 
            journeys={journeys} 
            siteId="slow-mauritius" 
            darkMode={true} 
          />
        </div>
      </section>
    </div>
  );
}
