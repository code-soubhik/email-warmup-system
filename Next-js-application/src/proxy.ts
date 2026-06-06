import { NextRequest, NextResponse } from 'next/server'

// 🔐 Routes that require authentication
const authRequiredRoutes = ['/dashboard', '/emails']

// 🚪 Routes only for unauthenticated users
const guestOnlyRoutes = ['/login', '/signup']

export default function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const session = req.cookies.get('session')?.value

  const isAuthRequired = authRequiredRoutes.some(route =>
    path.startsWith(route)
  )

  const isGuestOnly = guestOnlyRoutes.includes(path)

  // 🚫 Block unauthenticated users from protected routes
  if (isAuthRequired && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // 🚫 Block logged-in users from login/signup pages
  if (isGuestOnly && session) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}