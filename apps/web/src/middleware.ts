export { auth as middleware } from "@/lib/auth";

export const config = {
  // Protect all dashboard routes, but not login or API auth routes
  matcher: [
    "/clients/:path*",
    "/pipeline/:path*",
    "/pods/:path*",
    "/analytics/:path*",
    "/settings/:path*",
  ],
};
