import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest){
    // OBTENIENDO LA COOKIE DEL INICIO DE SESION
    const token = request.cookies.get('session_jwt')?.value;

    // EN CASO DE NO EXISTIR TOKEN, ESTE REDIRIGIRA A login/ 
    if(!token){
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // SI NO SE CUMPLE LA CONDICION, SEGUIRA LA A LA REDIRECCION DE LAS RUTAS DEFINIDAS
    return NextResponse.next();
}

// RUTAS DEFINIDAS, SERAN LAS RUTAS QUE TENDRAN RESTRICCIONES O SERAN PROTEGIDAS
export const config = {
    matcher: ['/drive/:path*', ] // APLICAR RESTRICCION DESDE /drive Y TODAS SUS SUBRUTAS
}