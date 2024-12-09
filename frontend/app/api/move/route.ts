import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
export async function POST(request : NextRequest) {
    //Se espera un json como {path_resource : '' , path_move_to : ''}
    try{
        const cookieStore = cookies();
        const sessionCookie = (await cookieStore).get("session_jwt"); // Obtenemos el cookie de sesión
        
        if (!sessionCookie) {
            return NextResponse.json({ message: "No hay cookie de sesión" }, { status: 401 });
        }

        const cookieHeader = `${sessionCookie.name}=${sessionCookie.value}`;
        
        const data = await request.json();

        const fastapiResponse = await fetch(
            'http://localhost:8000/cloud/mv_resource',
            {
                method : 'POST',
                credentials : 'include',
                headers : {
                    "Content-Type" : "application/json",
                    "Cookie" : cookieHeader
                },
                body : JSON.stringify(data)
            });
        //Falta adaptar la respuesta del backend al endpoint
        if (fastapiResponse.status == 401){
            return NextResponse.json({message : "Expire Credentials"} , {status : 401});

        }
        const fastapiJson = await fastapiResponse.json();
        
        return NextResponse.json({newDir : fastapiJson} , {status : 200});

    }catch (error){
        console.error(error);
        return NextResponse.json({error : "Error de solicitud"} , {status : 500});
    }
    
}