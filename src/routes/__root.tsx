import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { getSiteSettings } from "@/lib/cms.functions";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Jugal K. Shukla — Digital Marketing & Growth Expert" },
      {
        name: "description",
        content:
          "Independent digital marketing, automation and growth expert. SEO, paid media and AI workflows engineered around qualified pipeline.",
      },
      { name: "author", content: "Jugal K. Shukla" },
      { property: "og:title", content: "Jugal K. Shukla — Digital Marketing & Growth Expert" },
      {
        property: "og:description",
        content: "SEO, paid media and AI-powered automation built around one number: qualified pipeline.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap",
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
  }),

  // Custom code (GTM, verification tags, chat widgets) managed from Admin → Custom code.
  loader: async () => {
    try {
      return await getSiteSettings();
    } catch {
      return { head_code: "", body_code: "", footer_code: "" };
    }
  },

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const settings = Route.useLoaderData();
  const code = settings ?? { head_code: "", body_code: "", footer_code: "" };
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {code.head_code ? <CustomCode html={code.head_code} target="head" /> : null}
      </head>
      <body>
        {code.body_code ? <CustomCode html={code.body_code} target="body" /> : null}
        {children}
        {code.footer_code ? <CustomCode html={code.footer_code} target="body" /> : null}
        <Scripts />
      </body>
    </html>
  );
}

/**
 * Injects an admin-provided snippet (GTM, pixels, verification tags) so that any
 * <script> inside it actually executes — cloned nodes from innerHTML never run.
 */
function CustomCode({ html, target }: { html: string; target: "head" | "body" }) {
  const injector = `(function(){try{var t=document.createElement("template");t.innerHTML=${JSON.stringify(html)};var out=document.createDocumentFragment();Array.prototype.forEach.call(t.content.childNodes,function(n){if(n.nodeName==="SCRIPT"){var s=document.createElement("script");Array.prototype.forEach.call(n.attributes,function(a){s.setAttribute(a.name,a.value)});s.text=n.textContent||"";out.appendChild(s)}else{out.appendChild(n.cloneNode(true))}});document.${target}.appendChild(out)}catch(e){console.warn("Custom code failed",e)}})();`;
  return <script dangerouslySetInnerHTML={{ __html: injector }} suppressHydrationWarning />;
}



function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
