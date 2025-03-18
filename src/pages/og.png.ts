import type { APIRoute } from "astro";
import { generateOgImageForSite } from "@utils/generateOgImages.tsx";

export const GET: APIRoute = async () => {
  try {
    const imageBuffer = await generateOgImageForSite();
    return new Response(imageBuffer, {
      headers: { "Content-Type": "image/png" },
    });
  } catch (error) {
    // Return a fallback image or a simple text-based OG image
    console.error("Failed to generate OG image:", error);
    return new Response("Failed to generate OG image", { status: 500 });
  }
};
