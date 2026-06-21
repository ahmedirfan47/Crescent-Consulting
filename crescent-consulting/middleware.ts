import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken } from '@/lib/adminAuth'

const PUBLIC_ADMIN_PATHS = ['/admin/login', '/api/admin/login']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin')
  if (!isAdminRoute) {
    return NextResponse.next()
  }

  const token = req.cookies.get('crescent_admin_session')?.value

const secret = process.env.ADMIN_SESSION_SECRET
if (!token || !secret || !(await verifySessionToken(token, secret))) {

if (pathname.startsWith('/api/')) {

return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

}

const loginUrl = new URL('/admin/login', req.url)

return NextResponse.redirect(loginUrl)

}
return NextResponse.next()

}
export const config = {

matcher: ['/admin/:path*', '/api/admin/:path*'],

}