export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Slow Morocco",
    description: "Thoughtful private journeys across Morocco — designed for travellers who prefer ease and deep immersion.",
    url: "https://slowmorocco.com",
    telephone: "+212618070450",
    email: "hello@slowmorocco.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Marrakech",
      addressCountry: "MA",
    },
    areaServed: {
      "@type": "Country",
      name: "Morocco",
    },
    image: "https://slowmorocco.com/og-image.jpg",
    priceRange: "€€€",
    sameAs: [
      "https://www.instagram.com/slowmorocco",
      "https://www.pinterest.com/slowmorocco",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Morocco Private Journeys",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "TouristTrip",
            name: "3-Day Sahara Circle",
            description: "Desert adventure from Marrakech to Merzouga",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "TouristTrip",
            name: "8-Day Imperial Cities",
            description: "Discover Marrakech, Fes, Meknes, and Rabat",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "TouristTrip",
            name: "12-Day Grand Tour",
            description: "The complete Morocco experience",
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
