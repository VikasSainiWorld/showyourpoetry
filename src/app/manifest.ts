import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Show Your Poetry",
    short_name: "ShowYourPoetry",
    description:
      "Speak your poetry in any language and share it with the world. Record, transcribe, and publish your poems with AI-powered voice technology.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0812",
    theme_color: "#d4a017",
    orientation: "portrait",
    scope: "/",
    categories: ["productivity", "lifestyle", "social"],
    icons: [
      {
        src: "/icon",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Write a Poem",
        url: "/create",
        description: "Start writing a new poem",
      },
      {
        name: "My Poems",
        url: "/dashboard",
        description: "View your saved poems",
      },
    ],
  };
}
