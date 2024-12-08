import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session_jwt');

  // Verifica si la ruta coincide con /drive o sus subrutas
  if (request.nextUrl.pathname.startsWith('/drive')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Si el token existe, permite el acceso
  return NextResponse.next();
}

// Configuración de las rutas en las que se aplica el middleware
export const config = {
  matcher: ['/drive/:path*'], // Aplica a /drive y cualquier subdirectorio
};
