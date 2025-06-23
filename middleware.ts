import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale, Locale } from "./src/i18n";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bỏ qua các file tĩnh và API
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/");
  const maybeLocale = segments[1] as Locale;

  if (locales.includes(maybeLocale)) {
    // Nếu URL có prefix locale (/vi/xxx) ⇒ set cookie & rewrite bỏ prefix
    const res = NextResponse.rewrite(
      new URL(pathname.replace(`/${maybeLocale}`, "") || "/", request.url)
    );
    res.cookies.set("NEXT_LOCALE", maybeLocale, { path: "/" });
    return res;
  }

  // Nếu không có prefix ⇒ đọc cookie hoặc dùng default
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value as Locale | undefined;
  const locale: Locale = cookieLocale && locales.includes(cookieLocale)
    ? cookieLocale
    : defaultLocale;

  // Redirect sang /{locale}/...
  return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
}

export const config = {
  matcher: "/((?!static|.*\..*|_next|api).*)",
};
