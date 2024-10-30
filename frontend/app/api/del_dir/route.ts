import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
export async function DELETE(request : NextRequest) {
    try{
        const cookieStore = cookies();
        const sessionCookie = (await cookieStore).get("session_jwt");
        const cookieHeader = sessionCookie?.name + "=" + sessionCookie?.value;
        const datas = await request.json();

        
        const fastapiResponse = await fetch(
            `http://localhost:8000/cloud/dir`,
            {
                method : 'DELETE',
                credentials : 'include',
                headers : {
                    "Content-Type" : "application/json",
                    "Cookie" : cookieHeader
                }, 
                body : JSON.stringify(datas)           
            });
        //Falta adaptar la respuesta del backend al endpoint
        if (fastapiResponse.status == 401){
            return NextResponse.json({message : "Expire Credentials"} , {status : 401});
        }
        if (fastapiResponse.status == 403){
            return NextResponse.json({message : "Access Denined"} , {status : 403});
        }
        const fastapiJson = await fastapiResponse.json();
        return NextResponse.json({remove : fastapiJson} , {status : 200});

    }catch (error){
        console.error(error);
        return NextResponse.json({error : "Error de solicitud"})
    }
    
}