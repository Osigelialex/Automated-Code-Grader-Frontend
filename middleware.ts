import { studentMiddleware } from './middleware/studentDashboard'
import { lecturerMiddleware } from './middleware/lecturerDashboard'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/dashboard/student')) {
    return studentMiddleware(request)
  }
  
  if (request.nextUrl.pathname.startsWith('/dashboard/lecturer')) {
    return lecturerMiddleware(request)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}