import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const PROTECTED_PATHS = ["/trips"];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some(
    (path) =>
      pathname === path ||
      pathname.startsWith(`${path}/`) ||
      routing.locales.some(
        (locale) =>
          pathname === `/${locale}${path}` ||
          pathname.startsWith(`/${locale}${path}/`),
      ),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isProtectedPath(pathname)) {
    const accessToken = request.cookies.get("accessToken")?.value;
    if (!accessToken) {
      const loginUrl = new URL("/", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  // Exclut les API routes, fichiers _next et fichiers avec extension (images, fonts…)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
