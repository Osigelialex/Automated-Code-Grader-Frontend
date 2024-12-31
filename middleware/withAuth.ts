import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  role: string;
  exp: number;
}

export function withAuth(handler: (req: NextRequest) => Promise<NextResponse>, allowedRoles: string[]) {
  return async function (req: NextRequest) {
    const token = req.cookies.get('refresh_token')
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    try {
      const decoded: DecodedToken = jwtDecode(token.value)
      const isExpired = Date.now() >= decoded.exp * 1000;
      
      if (isExpired) {
        return NextResponse.redirect(new URL('/login', req.url))
      }

      if (!allowedRoles.includes(decoded.role)) {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }

      return handler(req)
    } catch {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }
}