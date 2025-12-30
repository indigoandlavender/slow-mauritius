export default function FAQPage() {
  const faqs = [
    {
      question: "How far in advance should I book?",
      answer:
        "We recommend booking 3-6 months in advance, especially for travel during peak seasons (April-June, September-November). However, we can sometimes accommodate last-minute requests depending on availability.",
    },
    {
      question: "Are your journeys private or group tours?",
      answer:
        "All our journeys are completely private. We don't do group tours. Your journey is designed specifically for you and travels with you alone (or your chosen companions).",
    },
    {
      question: "What's included in the price?",
      answer:
        "Each journey includes accommodations, private transportation, an expert guide, most meals, and all activities mentioned in your itinerary. International flights and personal expenses are not included.",
    },
    {
      question: "Can I customize a journey?",
      answer:
        "Absolutely. Most of our journeys are fully customized. Our featured journeys serve as inspiration, but we'll design something unique based on your interests, pace, and preferences.",
    },
    {
      question: "Do I need a visa to visit Mauritius?",
      answer:
        "Many nationalities can obtain an e-Visa online before travel. Some countries have visa-free access for short stays. Check our Visa Information page for details specific to your nationality.",
    },
    {
      question: "Is Mauritius safe for travelers?",
      answer:
        "Yes, Mauritius is generally very safe for travelers, especially in the tourist regions we operate in. We work with experienced guides who know the country well and prioritize your safety and comfort throughout your journey.",
    },
    {
      question: "What's your cancellation policy?",
      answer:
        "We offer flexible cancellation terms. Full details are available on our Cancellation Policy page, but in short: we understand that plans change and try to be as accommodating as possible.",
    },
    {
      question: "Do you offer payment plans?",
      answer:
        "Yes. We require a deposit to secure your booking, with the balance due 60 days before departure. We can also arrange custom payment schedules for longer or more complex journeys.",
    },
  ];

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-white/40 mb-6">
            Support
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-white/50 text-lg">
            Quick answers to common questions
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-white/10 pb-8">
                <h3 className="font-serif text-xl text-white/90 mb-3">{faq.question}</h3>
                <p className="text-white/50 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center border border-white/10 p-8 md:p-12">
            <h2 className="font-serif text-2xl text-white/90 mb-4">
              Don't See Your Question?
            </h2>
            <p className="text-white/50 mb-8">
              We're happy to answer any questions you have.
            </p>
            <a 
              href="/contact" 
              className="inline-block border border-white/20 px-10 py-4 text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-[#0a0a0a] transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
