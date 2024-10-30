import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request : NextRequest) {
    try{
        const cookieStore = cookies();
        const sessionCookie = (await cookieStore).get("session_jwt");
        const cookieHeader = sessionCookie?.name + "=" + sessionCookie?.value;

        const url = new URL(request.url);
        const filePath = url.searchParams.get("path");
        
        const responseBackend = await fetch(
            `http://localhost:8000/cloud/file?${url.searchParams.toString()}`,
            {
                method : 'GET',
                credentials : 'include',
                headers : {
                    "Cookie" : cookieHeader
                }, 
            });
        //Falta adaptar la respuesta del backend al endpoint
        const blob = await responseBackend.blob();
        
        return new Response(blob, {
            status: 200,
            headers: {
                "Content-Type": "application/octet-stream",
                "Content-Disposition": `attachment; filename="${filePath?.split('/').pop()}"`,
            },
        });

    }catch (error){
        console.error(error);
        return NextResponse.json({error : "Error de solicitud"})
    }
    
}