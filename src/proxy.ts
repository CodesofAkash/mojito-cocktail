import { NextResponse, type NextRequest } from "next/server";

const LOCALE_PATTERN = /^[a-z]{2}-[A-Z]{2}$/;
const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? "en-IN";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const [, first = ""] = pathname.split("/");

  // Already locale-prefixed — leave it alone.
  if (LOCALE_PATTERN.test(first)) return NextResponse.next();

  // Rewrite, not redirect: the visitor keeps the clean "/" URL while the app
  // renders the default locale's route underneath.
  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    // Everything except Next internals, the Studio, API routes and real files.
    "/((?!_next|studio|api|images|videos|fonts|favicon.ico|robots.txt|sitemap.xml|llms.txt).*)",
  ],
};
