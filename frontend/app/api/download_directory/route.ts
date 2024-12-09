import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
 try {
   // Get the session cookie
   const cookieStore = cookies();
   const sessionCookie = (await cookieStore).get("session_jwt");
   
   // Check if session cookie exists
   if (!sessionCookie) {
     return NextResponse.json({ error: "No session token found" }, { status: 401 });
   }

   // Extract folder name from query parameters
   const url = new URL(request.url);
   const folderName = url.searchParams.get("name");

   // Validate folder name
   if (!folderName) {
     return NextResponse.json({ error: "Folder name is required" }, { status: 400 });
   }

   // Construct backend download URL
   const backendUrl = new URL(`http://localhost:8000/cloud/download_folder/`);
   backendUrl.searchParams.set("name", folderName);

   // Perform folder download request to backend
   const responseBackend = await fetch(backendUrl.toString(), {
     method: "GET",
     headers: {
       "Cookie": `${sessionCookie.name}=${sessionCookie.value}`,
     },
   });

   // Handle backend response errors
   if (!responseBackend.ok) {
     const errorText = await responseBackend.text();
     console.error("Backend download error:", errorText);
     
     return NextResponse.json({ 
       error: errorText || "Failed to download folder" 
     }, { 
       status: responseBackend.status 
     });
   }

   // Extract safe filename for the ZIP
   const safeFolderName = folderName.split('/').pop() || 'downloaded_folder';
   const zipFileName = `${safeFolderName}.zip`;

   // Create response with ZIP download headers
   const response = new NextResponse(responseBackend.body, {
     status: 200,
     headers: {
       'Content-Type': 'application/zip',
       'Content-Disposition': `attachment; filename="${zipFileName}"`,
     },
   });

   return response;

 } catch (error) {
   console.error("Folder download request error:", error);
   return NextResponse.json({ 
     error: error instanceof Error ? error.message : "Internal server error" 
   }, { status: 500 });
 }
}