import { withAuth } from './withAuth'
import { NextResponse } from 'next/server'

export const studentMiddleware = withAuth(
  async () => NextResponse.next(),
  ['STUDENT']
)