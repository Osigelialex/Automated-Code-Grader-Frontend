import { NextResponse } from 'next/server'
import { withAuth } from './withAuth'

export const lecturerMiddleware = withAuth(
  async () => NextResponse.next(),
  ['LECTURER']
)