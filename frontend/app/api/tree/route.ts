import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request : NextRequest) {
    try{
        const cookieStore = cookies();
        const sessionCookie = (await cookieStore).get("session_jwt");

        if (!sessionCookie) {
            return NextResponse.json({ message: "No hay cookie de sesión" }, { status: 401 });
        }

        const cookieHeader = `${sessionCookie.name}=${sessionCookie.value}`;

        try {
            const fastapiResponse = await fetch(`http://localhost:8000/cloud/tree`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Cookie": cookieHeader
                },
                body: JSON.stringify({ path_on_folder: "" })
            });

            const fastapiJson = await fastapiResponse.json();

            switch (fastapiResponse.status) {
                case 200:
                    return NextResponse.json({ tree: fastapiJson }, { status: 200 });
                case 401:
                    return NextResponse.json({ message: "Credenciales expiradas" }, { status: 401 });
                case 403:
                    return NextResponse.json({ message: "Acceso denegado" }, { status: 403 });
                default:
                    return NextResponse.json(
                        { message: `Unexpected status: ${fastapiResponse.status}` },
                        { status: fastapiResponse.status }
                    );
            }
        } catch (fetchError) {
            if (fetchError instanceof TypeError) {
                // Error de red o servidor no disponible
                return NextResponse.json(
                    { message: "Servidor de FastAPI no disponible" },
                    { status: 503 }
                );
            }
            throw fetchError; // Re-lanza otros errores
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { message: "Error interno del servidor" },
            { status: 500 }
        );
    }
}

