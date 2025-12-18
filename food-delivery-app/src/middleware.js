import { NextResponse } from 'next/server';

export function middleware(request) {

  const path = request.url;
  const token = request.cookies.get('token');


  if (path.endsWith('login') || path.endsWith('signup')){
    if (token) {
      return NextResponse.redirect(new URL('/', path))
    }
  }

  else {
    if (!token) return NextResponse.redirect(new URL('/login', request.url));
  } 
  
  return NextResponse.next();

}

// Middleware'in hangi sayfalarda çalışacağını belirtiyoruz
export const config = {
  matcher: [
    /*
     * Aşağıdakiler HARİÇ tüm yollarda çalışır:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public klasöründeki dosyalar
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};  