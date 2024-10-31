import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
export async function GET(request : NextRequest) {
    try{
        const cookieStore = cookies();
        const sessionCookie = (await cookieStore).get("session_jwt");
        const cookieHeader = sessionCookie?.name + "=" + sessionCookie?.value;
        
        const fastapiResponse = await fetch(
            `http://localhost:8000/cloud/share/pending_share`,
            {
                method : 'GET',
                credentials : 'include',
                headers : {
                    "Content-Type" : "application/json",
                    "Cookie" : cookieHeader
                }, 
            });
        //Falta adaptar la respuesta del backend al endpoint
        const fastapiJson = await fastapiResponse.json();
        if (fastapiResponse.status == 401){
            return NextResponse.json({message : "Expire Credentials"} , {status : 401});
        }
        if (fastapiResponse.status == 403){
            return NextResponse.json({message : "Access Denined"} , {status : 403});
        }
        return NextResponse.json({tree : fastapiJson} , {status : 200});

    }catch (error){
        console.error(error);
        return NextResponse.json({message : "Expire Credentials"} , {status : 401});
    }
    
}