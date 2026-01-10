import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;

interface StoryImage {
  story_slug: string;
  image_order: number;
  image_url: string;
  caption: string;
  alt_text: string;
  aspect_ratio: string;
  full_bleed: boolean;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    // Fetch Stories tab
    const storiesResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Stories!A:Z",
    });

    const storiesRows = storiesResponse.data.values || [];
    if (storiesRows.length < 2) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    const storiesHeaders = storiesRows[0];
    const storiesData = storiesRows.slice(1);

    // Find the story by slug
    const slugIndex = storiesHeaders.indexOf("slug");
    const storyRow = storiesData.find((row) => row[slugIndex] === slug);

    if (!storyRow) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    // Convert row to object
    const story: Record<string, string> = {};
    storiesHeaders.forEach((header: string, index: number) => {
      story[header] = storyRow[index] || "";
    });

    // Convert <br> tags to newlines in body
    if (story.body) {
      story.body = story.body.replace(/<br\s*\/?>/gi, "\n");
    }

    // Fetch Story_Images tab
    let images: StoryImage[] = [];
    try {
      const imagesResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: "Story_Images!A:G",
      });

      const imagesRows = imagesResponse.data.values || [];
      if (imagesRows.length >= 2) {
        const imagesHeaders = imagesRows[0];
        const imagesData = imagesRows.slice(1);

        images = imagesData
          .filter((row) => row[imagesHeaders.indexOf("story_slug")] === slug)
          .map((row) => ({
            story_slug: row[imagesHeaders.indexOf("story_slug")] || "",
            image_order: parseInt(row[imagesHeaders.indexOf("image_order")] || "0", 10),
            image_url: row[imagesHeaders.indexOf("image_url")] || "",
            caption: row[imagesHeaders.indexOf("caption")] || "",
            alt_text: row[imagesHeaders.indexOf("alt_text")] || "",
            aspect_ratio: row[imagesHeaders.indexOf("aspect_ratio")] || "16:9",
            full_bleed: row[imagesHeaders.indexOf("full_bleed")]?.toLowerCase() === "true",
          }))
          .sort((a, b) => a.image_order - b.image_order);
      }
    } catch {
      // Story_Images tab might not exist yet
    }

    return NextResponse.json({
      story,
      images,
    });
  } catch (error) {
    console.error("Error fetching story:", error);
    return NextResponse.json(
      { error: "Failed to fetch story" },
      { status: 500 }
    );
  }
}
