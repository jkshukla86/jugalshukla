import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

export const Route = createFileRoute("/sitemap-blog.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { getPostEntries, renderUrlset, xmlResponse } = await import("@/lib/sitemap.server");
        return xmlResponse(renderUrlset(await getPostEntries()));
      },
    },
  },
});
