import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    try {
        const cookieStore = cookies();
        const sessionCookie = (await cookieStore).get("session_jwt"); // Obtenemos el cookie de sesión

        if (!sessionCookie) {
            return NextResponse.json({ message: "No hay cookie de sesión" }, { status: 401 });
        }

        const cookieHeader = `${sessionCookie.name}=${sessionCookie.value}`;

        // Obtener el path del cuerpo de la solicitud
        const { path_on_folder } = await request.json();

        // Asegurarse de que path_on_folder sea siempre una cadena
        const sanitizedPath = (path_on_folder || "").replace(/^\//, "");

        try {
            const fastapiResponse = await fetch(`http://localhost:8000/cloud/trash`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Cookie": cookieHeader,
                    "Authorization": `Bearer ${sessionCookie.value}` // Añadimos el token como Bearer token
                },
                body: JSON.stringify({ path_on_folder: sanitizedPath  })
            });

            if (!fastapiResponse.ok) {
                const errorData = await fastapiResponse.json();
                return NextResponse.json(
                    { message: errorData.detail || "Error en el servidor FastAPI" },
                    { status: fastapiResponse.status }
                );
            }

            const fastapiJson = await fastapiResponse.json();

            switch (fastapiResponse.status) {
                case 200:
                    const processedTree = fastapiJson.map((item: any) => ({
                        ...item,
                        path: path_on_folder ? `${path_on_folder}/${item.name}` : `/${item.name}`
                    }));
                    return NextResponse.json({ tree: processedTree }, { status: 200 });
                case 401:
                    return NextResponse.json({ message: "Credenciales expiradas" }, { status: 401 });
                case 403:
                    return NextResponse.json({ message: "Acceso denegado. Verifica tus permisos." }, { status: 403 });
                default:
                    return NextResponse.json(
                        { message: `Error inesperado: ${fastapiResponse.status}` },
                        { status: fastapiResponse.status }
                    );
            }
        } catch (fetchError) {
            if (fetchError instanceof TypeError) {
                return NextResponse.json(
                    { message: "Servidor de FastAPI no disponible" },
                    { status: 503 }
                );
            }
            throw fetchError;
        }
    } catch (error) {
        console.error('Error inesperado:', error);
        return NextResponse.json(
            { message: "Error interno del servidor" },
            { status: 500 }
        );
    }
}