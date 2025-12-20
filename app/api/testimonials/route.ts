import { NextResponse } from "next/server";
import { getSheetData } from "@/lib/sheets";

export async function GET() {
  try {
    const testimonials = await getSheetData("Website_Testimonials");
    
    // Map to consistent format and filter published only
    const formattedTestimonials = testimonials
      .filter((t: any) => t.Published === true || t.Published === "TRUE" || t.Published === "true")
      .map((t: any) => ({
        id: t.Testimonial_ID || "",
        quote: t.Quote || "",
        author: t.Author || "",
        journeyTitle: t.Journey_Title || "",
        order: parseInt(t.Order) || 0,
      }))
      .sort((a: any, b: any) => a.order - b.order);

    return NextResponse.json({ success: true, testimonials: formattedTestimonials });
  } catch (error: any) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { success: false, testimonials: [], error: error.message },
      { status: 500 }
    );
  }
}
