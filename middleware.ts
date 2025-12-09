import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to redirect old query parameter URLs to new clean URLs
 * Example: /?carat1=0.5&shape1=round&carat2=1&shape2=oval
 *          → /compare/0.5-round-vs-1-oval
 */
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Only handle homepage with query parameters
  if (pathname === '/' && searchParams.size > 0) {
    const carat1 = searchParams.get('carat1');
    const shape1 = searchParams.get('shape1');
    const carat2 = searchParams.get('carat2');
    const shape2 = searchParams.get('shape2');

    // If all required params exist, redirect to new URL structure
    if (carat1 && shape1 && carat2 && shape2) {
      // Format carats: remove trailing zeros
      const formatCarat = (c: string) => {
        const num = parseFloat(c);
        return num % 1 === 0 ? num.toString() : num.toFixed(2).replace(/\.?0+$/, '');
      };

      const slug = `${formatCarat(carat1)}-${shape1}-vs-${formatCarat(carat2)}-${shape2}`;
      const newUrl = new URL(`/compare/${slug}`, request.url);

      // Use 301 permanent redirect (passes SEO juice)
      return NextResponse.redirect(newUrl, 301);
    }
  }

  // Allow request to proceed normally
  return NextResponse.next();
}

// Only run middleware on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (svg, images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg).*)',
  ],
};
