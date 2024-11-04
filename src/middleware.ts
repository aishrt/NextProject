import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export default async function middleware(request: NextRequest) {
 
  if (request.nextUrl.pathname.startsWith('/user')) {
    console.log("in user route");
  }
  if (request.nextUrl.pathname.startsWith('/auth')) {
    console.log("in auth route");
  }
  return NextResponse.next();
}
 