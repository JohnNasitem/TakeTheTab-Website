import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const publicRoutes = ['/login', '/signup']

interface GenericResponse {
  actionSuccess: boolean;
  errorMessage?: string | null;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isPublic = publicRoutes.includes(pathname)

  // Extract tokens from cookies
  const refreshToken = request.cookies.get('refreshToken')?.value
  const accessToken = request.cookies.get('accessToken')?.value

  // Validate tokens
  const isValid = await validateTokens(accessToken, refreshToken)

  const loginUrl = new URL('/login', request.url)
  const homeUrl = new URL('/', request.url)

  // Redirect logic
  if (!isPublic && !isValid) return NextResponse.redirect(loginUrl)
  if (isPublic && isValid) return NextResponse.redirect(homeUrl)

  return NextResponse.next()
}

async function validateTokens(accessToken?: string, refreshToken?: string): Promise<boolean> {
  if (!refreshToken) 
    return false

  // Check access token validity
  let isAccessTokenValid = false
  if (accessToken) {
    try {
      const decoded = jwt.decode(accessToken) as { exp: number }
      if (decoded && decoded.exp * 1000 > Date.now()) {
        // Access token is still valid
        isAccessTokenValid = true
        return true
      }
    } catch {
      // Invalid access token format, will try refresh
    }
  }

  // If access token is missing or expired, call backend to refresh
  try {
    const res = await fetch(`https://api.takethetab.com/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `refreshToken=${refreshToken}`, // forward refresh token manually
      },
    })

    if (!res.ok) 
      return false
    
    const data = await res.json() as GenericResponse
    return data.actionSuccess
  } catch {
    return false
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'], // all pages except static
}
