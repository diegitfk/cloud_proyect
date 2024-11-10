import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
    try {
        const cookieStore = cookies();
        const sessionCookie = (await cookieStore).get("session_jwt");
        const cookieHeader = sessionCookie ? `${sessionCookie.name}=${sessionCookie.value}` : "";

        const fastapiResponse = await fetch(
            'http://localhost:8000/cloud/get_diroot_size',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    "Cookie": cookieHeader,
                },
            }
        );

        if (fastapiResponse.status === 401) {
            return NextResponse.json({ message: "Expire Credentials" }, { status: 401 });
        }

        const fastapiJson = await fastapiResponse.json();

        // Agrega un console.log para ver el contenido de fastapiJson
        //console.log("Datos recibidos del backend:", fastapiJson);

        return NextResponse.json({ newDir: fastapiJson }, { status: 200 });
    } catch (error) {
        console.error("Error en la solicitud al backend:", error);
        return NextResponse.json({ error: "Error de solicitud" }, { status: 500 });
    }
}
