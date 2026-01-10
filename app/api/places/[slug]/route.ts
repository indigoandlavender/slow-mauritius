import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { convertDriveUrl } from "@/lib/sheets";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    // Fetch Places tab
    const placesResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Places!A:Z",
    });

    const placesRows = placesResponse.data.values || [];
    if (placesRows.length < 2) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }

    const placesHeaders = placesRows[0];
    const placesData = placesRows.slice(1);

    // Find the place by slug
    const slugIndex = placesHeaders.indexOf("slug");
    const placeRow = placesData.find((row) => row[slugIndex] === slug);

    if (!placeRow) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }

    // Convert row to object
    const place: Record<string, string> = {};
    placesHeaders.forEach((header: string, index: number) => {
      place[header] = placeRow[index] || "";
    });

    // Convert heroImage URL
    if (place.heroImage) {
      place.heroImage = convertDriveUrl(place.heroImage);
    }

    // Convert <br> tags to newlines in body
    if (place.body) {
      place.body = place.body.replace(/<br\s*\/?>/gi, "\n");
    }
    if (place.description) {
      place.description = place.description.replace(/<br\s*\/?>/gi, "\n");
    }

    return NextResponse.json(place);
  } catch (error) {
    console.error("Error fetching place:", error);
    return NextResponse.json(
      { error: "Failed to fetch place" },
      { status: 500 }
    );
  }
}
