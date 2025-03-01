import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
export async function POST(request : NextRequest) {
    try{
        const cookieStore = cookies();
        const sessionCookie = (await cookieStore).get("session_jwt");
        const cookieHeader = sessionCookie?.name + "=" + sessionCookie?.value;

        const datas = await request.formData();
        let formData = new FormData();
        let files = datas.getAll("files");
        let path = datas.get("path");

        files.forEach(file => formData.append("files" , file));
        if (path) formData.append("path" , path.toString());
        const fastapiResponse = await fetch(
            'http://localhost:8000/cloud/upload_files',
            {
                method : 'POST',
                credentials : 'include',
                headers : {
                    "Cookie" : cookieHeader
                },
                body : formData
            });
        //Falta adaptar la respuesta del backend al endpoint
        if (fastapiResponse.status == 401){
            return NextResponse.json({message : "Expire Credentials"} , {status : 401});
        }
        if (fastapiResponse.status == 403){
            return NextResponse.json({message : "Access Denined"} , {status : 403});
        }
        const fastapiJson = await fastapiResponse.json();
        
        return NextResponse.json({treeLoading : fastapiJson});

    }catch (error){
        console.error(error);
        return NextResponse.json({message : "Expire Credentials"} , {status : 401});
    }
    
}