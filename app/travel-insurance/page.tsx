import { Metadata } from "next";
import { Shield, AlertCircle } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Travel Insurance | Slow Mauritius",
  description: "Travel insurance requirements and recommendations for Mauritius journeys.",
};

export default function TravelInsurancePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-24">
      <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
        <h1 className="font-serif text-4xl md:text-5xl text-white/90 mb-8">Travel Insurance</h1>
        
        <div className="bg-white/10 text-white p-6 mb-12 flex gap-4">
          <Shield className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">Insurance is Required</p>
            <p className="text-white/60 text-sm">
              Comprehensive travel insurance is a condition of booking with Slow Mauritius. 
              We require proof of coverage before your journey begins.
            </p>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="font-serif text-2xl text-white/90 mb-4">Why Travel Insurance?</h2>
            <p className="text-white/50 leading-relaxed">
              While we take every precaution to ensure your journey goes smoothly, 
              unexpected events can happen. Travel insurance protects you from 
              significant financial loss and ensures you can access help when you 
              need it.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-white/90 mb-4">Minimum Coverage Requirements</h2>
            <p className="text-white/50 leading-relaxed mb-4">
              Your travel insurance policy must include:
            </p>
            <ul className="space-y-3 text-white/50">
              <li>• <strong>Medical expenses:</strong> Minimum $100,000 USD</li>
              <li>• <strong>Emergency evacuation:</strong> Including repatriation</li>
              <li>• <strong>Trip cancellation:</strong> Coverage for the full trip cost</li>
              <li>• <strong>Trip interruption:</strong> In case you need to cut your trip short</li>
              <li>• <strong>Baggage loss/delay:</strong> For essential items</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-white/90 mb-4">Recommended Coverage</h2>
            <p className="text-white/50 leading-relaxed mb-4">
              We also recommend policies that include:
            </p>
            <ul className="space-y-3 text-white/50">
              <li>• Coverage for adventure activities (camel riding, hiking)</li>
              <li>• 24/7 emergency assistance hotline</li>
              <li>• Coverage for pre-existing medical conditions (if applicable)</li>
              <li>• Cancel for any reason (CFAR) coverage for maximum flexibility</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-white/90 mb-4">When to Purchase</h2>
            <div className="bg-sand p-6 flex gap-4">
              <AlertCircle className="w-6 h-6 text-white/90 flex-shrink-0 mt-0.5" />
              <p className="text-white/50 text-sm">
                Many trip cancellation benefits require you to purchase insurance within 
                14-21 days of your initial deposit. We recommend purchasing insurance 
                when you confirm your booking to ensure maximum coverage.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-white/90 mb-4">Insurance Providers</h2>
            <p className="text-white/50 leading-relaxed mb-4">
              While we don't endorse specific providers, these companies are frequently 
              used by our guests:
            </p>
            <ul className="space-y-2 text-white/50">
              <li>• World Nomads</li>
              <li>• Allianz Travel Insurance</li>
              <li>• Travel Guard</li>
              <li>• IMG Global</li>
              <li>• Travelex Insurance</li>
            </ul>
            <p className="text-white/50 text-sm mt-4">
              Compare policies at InsureMyTrip.com or Squaremouth.com
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-white/90 mb-4">Before You Book</h2>
            <p className="text-white/50 leading-relaxed">
              Read your policy carefully and understand:
            </p>
            <ul className="mt-4 space-y-2 text-white/50">
              <li>• What is and isn't covered</li>
              <li>• How to file a claim</li>
              <li>• Emergency contact numbers</li>
              <li>• Any exclusions that may apply to your situation</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-white/90 mb-4">Submitting Proof of Insurance</h2>
            <p className="text-white/50 leading-relaxed">
              Please send a copy of your insurance policy or certificate to us at least 
              14 days before departure. Email it to hello@slowmauritius.com with your 
              booking reference.
            </p>
          </section>

          <section className="border-t border-white/10 pt-12">
            <p className="text-white/50 text-center">
              Questions about insurance requirements?{" "}
              <Link href="/contact" className="underline hover:text-white/90">
                Contact us
              </Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
