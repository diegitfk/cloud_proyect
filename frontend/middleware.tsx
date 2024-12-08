import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Obtener la cookie `session_jwt`
  const token = request.cookies.get('session_jwt')?.value;

  console.log('Middleware triggered for path:', request.nextUrl.pathname);
  console.log('Token found:', token);

  // Verificar si la ruta es parte de /drive y si el token no está presente
  if (request.nextUrl.pathname.startsWith('/drive') && !token) {
    console.log('No token found, redirecting to /login');
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Permitir acceso si el token está presente
  return NextResponse.next();
}

// Configuración para que el middleware se aplique solo a rutas relevantes
export const config = {
  matcher: ['/drive/:path*'], // Aplica solo a /drive y sus subrutas
};
