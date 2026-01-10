import { NextResponse } from "next/server";
import { getSheetData, convertDriveUrl } from "@/lib/sheets";

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    // Fetch Places tab
    const placesData = await getSheetData("Places");
    
    if (!placesData || placesData.length === 0) {
      return NextResponse.json({ places: [] });
    }

    // Filter published and sort by order
    const places = placesData
      .filter((place: any) => place.published === "true" || place.published === true)
      .map((place: any) => ({
        ...place,
        heroImage: convertDriveUrl(place.heroImage || ""),
        // Convert <br> tags back to newlines
        body: place.body?.replace(/<br>/g, "\n") || "",
        the_facts: place.the_facts?.replace(/<br>/g, "\n") || "",
      }))
      .sort((a: any, b: any) => {
        const orderA = Number(a.order) || 999;
        const orderB = Number(b.order) || 999;
        return orderA - orderB;
      });

    return NextResponse.json({ places });
  } catch (error) {
    console.error("Error fetching places:", error);
    return NextResponse.json(
      { error: "Failed to fetch places" },
      { status: 500 }
    );
  }
}
