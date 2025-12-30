import { Metadata } from "next";
import { AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Visa Information | Slow Mauritius",
  description: "Visa requirements and travel documentation for visiting Mauritius.",
};

export default function VisaInfoPage() {
  const visaFreeCountries = [
    "United States", "United Kingdom", "Canada", "Australia", "New Zealand",
    "European Union countries", "Switzerland", "Norway", "Japan", "South Korea",
    "Brazil", "Argentina", "Chile", "Mexico", "South Africa", "UAE", "Qatar",
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-24">
      <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
        <h1 className="font-serif text-4xl md:text-5xl text-white/90 mb-8">Visa Information</h1>
        
        <div className="bg-sand p-6 mb-12 flex gap-4">
          <AlertCircle className="w-6 h-6 text-white/90 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">Important Notice</p>
            <p className="text-white/50 text-sm">
              Visa requirements can change. Always verify current requirements with the 
              Moroccan Embassy or Consulate in your country before traveling.
            </p>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="font-serif text-2xl text-white/90 mb-4">Visa-Free Entry</h2>
            <p className="text-white/50 leading-relaxed mb-6">
              Citizens of many countries can enter Mauritius without a visa for stays up to 
              90 days. Countries with visa-free access include:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {visaFreeCountries.map((country) => (
                <span key={country} className="text-white/50 text-sm py-1">
                  {country}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-white/90 mb-4">Passport Requirements</h2>
            <ul className="space-y-3 text-white/50">
              <li>• Passport must be valid for at least 6 months beyond your planned departure from Mauritius</li>
              <li>• At least one blank page for entry/exit stamps</li>
              <li>• Passport should be in good condition without significant damage</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-white/90 mb-4">On Arrival</h2>
            <p className="text-white/50 leading-relaxed">
              Upon arrival in Mauritius, you'll need to complete an entry card with your 
              personal details and accommodation address. Immigration officers may ask 
              about the purpose of your visit and your accommodation arrangements. Having 
              your Slow Mauritius itinerary confirmation can be helpful.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-white/90 mb-4">Visa Required Countries</h2>
            <p className="text-white/50 leading-relaxed">
              If your country is not on the visa-free list, you'll need to apply for a 
              visa at a Moroccan Embassy or Consulate before traveling. The process 
              typically requires:
            </p>
            <ul className="mt-4 space-y-2 text-white/50">
              <li>• Completed visa application form</li>
              <li>• Valid passport with blank pages</li>
              <li>• Passport-sized photographs</li>
              <li>• Proof of accommodation</li>
              <li>• Return flight tickets</li>
              <li>• Proof of sufficient funds</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-white/90 mb-4">Extending Your Stay</h2>
            <p className="text-white/50 leading-relaxed">
              If you wish to stay longer than 90 days, you'll need to apply for an 
              extension at the local police station (Préfecture de Police) before your 
              initial 90 days expire. Extensions are granted at the discretion of 
              Moroccan authorities.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-white/90 mb-4">Need Assistance?</h2>
            <p className="text-white/50 leading-relaxed">
              If you have questions about visa requirements for your specific situation, 
              we're happy to help guide you to the right resources. Contact us at 
              hello@slowmauritius.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
