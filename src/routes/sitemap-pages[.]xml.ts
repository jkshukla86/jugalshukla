import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

export const Route = createFileRoute("/sitemap-pages.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { getPageEntries, renderUrlset, xmlResponse } = await import("@/lib/sitemap.server");
        return xmlResponse(renderUrlset(await getPageEntries()));
      },
    },
  },
});
