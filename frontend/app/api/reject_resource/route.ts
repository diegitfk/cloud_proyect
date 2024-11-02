import { NextRequest , NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PUT(request : NextRequest){
    try{
        const cookieStore = cookies();
        const sessionCookie = (await cookieStore).get("session_jwt");
        const cookieHeader = sessionCookie?.name + "=" + sessionCookie?.value;

        const url : URL = new URL(request.url);
        const idPending = url.searchParams.get("idPending");

        const fastapiResponse = await fetch(
            `http://localhost:8000/cloud/share/reject_share/${idPending?.toString()}`, 
        {
            method : 'PUT',
            headers : {
                "Content-Type" : "application/json",
                "Cookie" : cookieHeader
            },
        })
        const fastapiJson = await fastapiResponse.json()
        return NextResponse.json(fastapiJson)
    }catch (error){
        return NextResponse.json({e : error} , {status : 500})
    }
}