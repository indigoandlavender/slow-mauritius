import { NextResponse } from "next/server";
import { getSheetData } from "@/lib/sheets";

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    // Fetch Places tab
    const placesData = await getSheetData("Places");
    
    if (!placesData || placesData.length === 0) {
      return NextResponse.json({ places: [] });
    }

    // Get headers and data rows
    const headers = placesData[0] as string[];
    const rows = placesData.slice(1);

    // Map rows to objects
    const places = rows
      .map((row: unknown[]) => {
        const place: Record<string, unknown> = {};
        headers.forEach((header: string, index: number) => {
          let value = row[index];
          // Convert <br> tags back to newlines for text fields
          if (typeof value === "string" && value.includes("<br>")) {
            value = value.replace(/<br>/g, "\n");
          }
          place[header] = value;
        });
        return place;
      })
      .filter((place: Record<string, unknown>) => place.published === "true" || place.published === true)
      .sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
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
