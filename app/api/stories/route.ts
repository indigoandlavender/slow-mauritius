import { NextResponse } from "next/server";
import { getSheetData, convertDriveUrl } from "@/lib/sheets";

export const revalidate = 60;

export async function GET() {
  try {
    const stories = await getSheetData("Stories");
    
    // Filter only published stories
    const publishedStories = stories
      .filter((story: any) => story.published?.toLowerCase() === "true")
      .map((story: any) => ({
        slug: story.slug || "",
        title: story.title || "",
        subtitle: story.subtitle || "",
        category: story.category || "",
        sourceType: story.sourceType || "",
        heroImage: convertDriveUrl(story.heroImage || ""),
        heroCaption: story.heroCaption || "",
        excerpt: story.excerpt || "",
        body: story.body?.replace(/<br>/g, "\n") || "",
        readTime: story.readTime || "",
        year: story.year || "",
        textBy: story.textBy || "",
        imagesBy: story.imagesBy || "",
        sources: story.sources || "",
        organizations: story.organizations || "",
        the_facts: story.the_facts?.replace(/<br>/g, "\n") || "",
        tags: story.tags || "",
        featured: story.featured || "",
        published: "true",
        order: parseInt(story.order) || 99,
        mj_prompt: story.mj_prompt || "",
      }))
      .sort((a: any, b: any) => a.order - b.order);

    // Get story images
    const storyImages = await getSheetData("Story_Images");
    
    // Map images to stories
    const storiesWithImages = publishedStories.map((story: any) => {
      const images = storyImages
        .filter((img: any) => img.story_slug === story.slug)
        .sort((a: any, b: any) => parseInt(a.image_order || "0") - parseInt(b.image_order || "0"))
        .map((img: any) => ({
          url: convertDriveUrl(img.image_url || ""),
          caption: img.caption || "",
          alt: img.alt_text || "",
          aspectRatio: img.aspect_ratio || "16:9",
          fullBleed: img.full_bleed?.toLowerCase() === "true",
        }));
      
      return {
        ...story,
        images,
      };
    });

    return NextResponse.json({ 
      success: true, 
      stories: storiesWithImages 
    });
  } catch (error) {
    console.error("Error fetching stories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stories" },
      { status: 500 }
    );
  }
}
