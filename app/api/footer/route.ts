import { NextResponse } from "next/server";
import { getNexusData, getSheetData } from "@/lib/sheets";

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SITE_ID = process.env.SITE_ID || "slow-mauritius";

// Convert Google Drive sharing URL to direct image URL
function convertGoogleDriveUrl(url: string): string {
  if (!url) return "";
  if (!url.includes("drive.google.com")) return url;
  
  let fileId = "";
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) fileId = fileMatch[1];
  
  const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (openMatch) fileId = openMatch[1];
  
  if (fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1920`;
  }
  return url;
}

export async function GET() {
  try {
    // Get newsletter config from Website_Settings (brand-specific sheet)
    let newsletterConfig = {
      show: true,
      backgroundImage: "",
      title: "Notes from Mauritius",
      description: "Quiet. Irregular. Real.",
      brandName: "Slow Mauritius",
    };
    
    let contactLinks: any[] = [];
    
    try {
      const settingsData = await getSheetData("Website_Settings");
      const settingsMap: { [key: string]: string } = {};
      settingsData.forEach((row: any) => {
        if (row.Key) settingsMap[row.Key] = row.Value || "";
      });
      
      newsletterConfig = {
        show: settingsMap.newsletter_show !== "false",
        backgroundImage: convertGoogleDriveUrl(settingsMap.newsletter_background_image) || newsletterConfig.backgroundImage,
        title: settingsMap.newsletter_title || newsletterConfig.title,
        description: settingsMap.newsletter_description || newsletterConfig.description,
        brandName: settingsMap.site_name || "Slow Mauritius",
      };
      
      // Build contact links from settings
      if (settingsMap.contact_address_line1) {
        contactLinks.push({ order: 1, label: settingsMap.contact_address_line1, href: null, type: "address" });
      }
      if (settingsMap.contact_address_line2) {
        contactLinks.push({ order: 2, label: settingsMap.contact_address_line2, href: null, type: "address" });
      }
      if (settingsMap.contact_email) {
        contactLinks.push({ order: 3, label: settingsMap.contact_email, href: `mailto:${settingsMap.contact_email}`, type: "email" });
      }
      if (settingsMap.social_pinterest) {
        contactLinks.push({ order: 4, label: "Pinterest", href: settingsMap.social_pinterest, type: "social" });
      }
      if (settingsMap.social_instagram) {
        contactLinks.push({ order: 5, label: "Instagram", href: settingsMap.social_instagram, type: "social" });
      }
      if (settingsMap.social_youtube) {
        contactLinks.push({ order: 6, label: "YouTube", href: settingsMap.social_youtube, type: "social" });
      }
      if (settingsMap.social_tiktok) {
        contactLinks.push({ order: 7, label: "TikTok", href: settingsMap.social_tiktok, type: "social" });
      }
    } catch (e) {
      console.warn("Could not fetch Website_Settings:", e);
    }
    
    // Get footer links from brand-specific sheet (Footer_Links tab)
    let footerLinks: any[] = [];
    try {
      footerLinks = await getSheetData("Footer_Links");
    } catch (e) {
      console.warn("Could not fetch Footer_Links from brand sheet:", e);
    }

    // Known slugs for auto-linking (if href is missing, use these)
    const autoLinks: { [key: string]: string } = {
      // Places/Regions
      'all places': '/places',
      'cities': '/places?region=cities',
      'mountains': '/places?region=mountains',
      'coastal': '/places?region=coastal',
      'desert': '/places?region=desert',
      // Journeys
      'all journeys': '/journeys',
      'epic journeys': '/epic',
      'plan your trip': '/plan-your-trip',
      "what's included": '/whats-included',
      'whats included': '/whats-included',
      'faq': '/faq',
      // About
      'about': '/about',
      'about us': '/about',
      'contact': '/contact',
      'contact us': '/contact',
      // Country info
      'visa info': '/visa-info',
      'visa information': '/visa-info',
      'health & safety': '/health-safety',
      'health and safety': '/health-safety',
      'travel insurance': '/travel-insurance',
      'cancellation policy': '/cancellation-policy',
    };

    // Group links by column
    const columnMap: { [key: number]: any } = {};
    
    footerLinks.forEach((link: any) => {
      const colNum = parseInt(link.column_number) || 1;
      if (!columnMap[colNum]) {
        columnMap[colNum] = {
          number: colNum,
          title: link.column_title || "",
          links: [],
        };
      }
      
      // Auto-generate href for known labels if missing
      let href = link.link_href || null;
      const labelLower = (link.link_label || "").toLowerCase().trim();
      if (!href && autoLinks[labelLower]) {
        href = autoLinks[labelLower];
      }
      
      columnMap[colNum].links.push({
        order: parseInt(link.link_order) || 0,
        label: link.link_label || "",
        href: href,
        type: link.link_type || "link",
      });
    });

    // Sort links within each column
    Object.values(columnMap).forEach((col: any) => {
      col.links.sort((a: any, b: any) => a.order - b.order);
      
      // If this is a "Places" column and doesn't have "All Places", add it at the top
      if (col.title.toLowerCase() === 'places') {
        const hasAllPlaces = col.links.some((l: any) => 
          l.label.toLowerCase() === 'all places'
        );
        if (!hasAllPlaces) {
          col.links.unshift({
            order: 0,
            label: 'All Places',
            href: '/places',
            type: 'link',
          });
        }
      }
    });

    // Convert to sorted array
    const columns = Object.values(columnMap).sort((a: any, b: any) => a.number - b.number);

    // Get legal pages from Nexus (shared across all brands)
    let legal: any[] = [];
    try {
      const legalPages = await getNexusData("Nexus_Legal_Pages");
      const siteLegalPages = legalPages.filter((p: any) => 
        !p.brand_id || p.brand_id === SITE_ID || p.brand_id === "all"
      );
      legal = siteLegalPages
        .filter((p: any) => p.page_slug && p.page_title)
        .map((p: any) => ({
          label: p.page_title,
          href: `/${p.page_slug}`,
        }));
    } catch (e) {
      console.warn("Could not fetch legal pages from Nexus:", e);
    }

    // Fallback legal if Nexus is empty
    const finalLegal = legal.length > 0 ? legal : [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Disclaimer", href: "/disclaimer" },
      { label: "Intellectual Property", href: "/intellectual-property" },
    ];

    // Get site name for "About [Country]" column title
    const countryName = newsletterConfig.brandName.replace('Slow ', '') || 'Us';

    // ALWAYS build Column 1 (Contact/Brand) from Website_Settings
    // This column has logo, blurb, address, social icons
    const contactColumn = {
      number: 1,
      title: "Contact", // Footer component replaces this with logo
      links: contactLinks.length > 0 ? contactLinks : [
        { order: 1, label: "Contact us", href: "/contact", type: "link" },
      ],
    };

    // Build final columns array
    let finalColumns: any[] = [];
    
    if (columns.length > 0) {
      // If Footer_Links has data, ensure Column 1 is always the contact column
      // and other columns come from the sheet (starting at column 2)
      finalColumns = [contactColumn, ...columns];
    } else {
      // Fallback columns if brand sheet Footer_Links is empty
      finalColumns = [
        contactColumn,
        {
          number: 2,
          title: "Places",
          links: [
            { order: 1, label: "All Places", href: "/places", type: "link" },
            { order: 2, label: "Cities", href: "/places?region=cities", type: "link" },
            { order: 3, label: "Mountains", href: "/places?region=mountains", type: "link" },
            { order: 4, label: "Coastal", href: "/places?region=coastal", type: "link" },
            { order: 5, label: "Desert", href: "/places?region=desert", type: "link" },
          ],
        },
        {
          number: 3,
          title: "Journeys",
          links: [
            { order: 1, label: "All Journeys", href: "/journeys", type: "link" },
            { order: 2, label: "Plan Your Trip", href: "/plan-your-trip", type: "link" },
            { order: 3, label: "What's Included", href: "/whats-included", type: "link" },
            { order: 4, label: "FAQ", href: "/faq", type: "link" },
            { order: 5, label: "About Us", href: "/about", type: "link" },
            { order: 6, label: "Contact Us", href: "/contact", type: "link" },
          ],
        },
        {
          number: 4,
          title: `About ${countryName}`,
          links: [
            { order: 1, label: "Visa Info", href: "/visa-info", type: "link" },
            { order: 2, label: "Health & Safety", href: "/health-safety", type: "link" },
            { order: 3, label: "Travel Insurance", href: "/travel-insurance", type: "link" },
            { order: 4, label: "Cancellation Policy", href: "/cancellation-policy", type: "link" },
          ],
        },
      ];
    }

    const footerData = {
      brandId: SITE_ID,
      newsletter: newsletterConfig,
      columns: finalColumns,
      legal: finalLegal,
      copyright: {
        year: new Date().getFullYear(),
        name: newsletterConfig.brandName,
      },
    };

    const response = NextResponse.json({
      success: true,
      data: footerData,
    });
    
    // Prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error: any) {
    console.error("Footer fetch error:", error);
    
    // Return fallback on error
    return NextResponse.json({
      success: true,
      data: {
        brandId: SITE_ID,
        newsletter: {
          show: true,
          backgroundImage: "",
          title: "Notes from Mauritius",
          description: "Quiet. Irregular. Real.",
          brandName: "Slow Mauritius",
        },
        columns: [
          {
            number: 1,
            title: "Contact",
            links: [
              { order: 1, label: "Contact us", href: "/contact", type: "link" },
            ],
          },
          {
            number: 2,
            title: "Places",
            links: [
              { order: 1, label: "All Places", href: "/places", type: "link" },
              { order: 2, label: "Cities", href: "/places?region=cities", type: "link" },
              { order: 3, label: "Mountains", href: "/places?region=mountains", type: "link" },
              { order: 4, label: "Coastal", href: "/places?region=coastal", type: "link" },
              { order: 5, label: "Desert", href: "/places?region=desert", type: "link" },
            ],
          },
          {
            number: 3,
            title: "Journeys",
            links: [
              { order: 1, label: "All Journeys", href: "/journeys", type: "link" },
              { order: 2, label: "Plan Your Trip", href: "/plan-your-trip", type: "link" },
              { order: 3, label: "FAQ", href: "/faq", type: "link" },
            ],
          },
        ],
        legal: [
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Terms of Service", href: "/terms" },
          { label: "Disclaimer", href: "/disclaimer" },
        ],
        copyright: {
          year: new Date().getFullYear(),
          name: "Slow Mauritius",
        },
      },
    });
  }
}
