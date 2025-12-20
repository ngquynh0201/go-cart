import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

// Paths that don't require authentication
const publicPaths = ['/'];

interface DecodedToken {
    userId: string;
    role: string;
}

export async function proxy(request: NextRequest) {
    const token = request.cookies.get('token');

    // If user is logged in and trying to access public paths, handle role-based redirect
    if (token && publicPaths.includes(request.nextUrl.pathname)) {
        try {
            return NextResponse.next();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            // Invalid token: Treat as unauthenticated
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // If no token and trying to access protected paths, redirect to /
    if (!token && !publicPaths.includes(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // If has token, check role-based access for protected paths
    if (token) {
        try {
            // Decode token to get user role
            const decoded = jwtDecode(token.value) as DecodedToken;

            // Check if path starts with /admin
            if (request.nextUrl.pathname.startsWith('/admin')) {
                // Only allow admin role to access admin paths
                if (decoded.role !== 'admin') {
                    return NextResponse.redirect(new URL('/', request.url));
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            // If token is invalid, redirect to /
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

// Update matcher to include admin paths
export const config = {
    matcher: [
        '/',
        '/admin',
        '/admin/:path*', // Match all paths starting with /admin
    ],
};
