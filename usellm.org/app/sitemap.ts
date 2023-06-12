import { docsConfig } from "@/config/docs";
import { MetadataRoute } from "next";

export default function Sitemap(): MetadataRoute.Sitemap {
  const sitemap = [
    {
      url: "https://usellm.org",
      lastModified: new Date().toISOString(),
    },
  ];

  docsConfig.sidebarNav.forEach((section) => {
    section.items?.forEach((item) => {
      sitemap.push({
        url: `https://usellm.org${item.href}`,
        lastModified: new Date().toISOString(),
      });
    });
  });

  return sitemap;
}
