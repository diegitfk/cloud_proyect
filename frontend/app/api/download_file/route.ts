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

    // Extract filename from query parameters
    const url = new URL(request.url);
    const fileName = url.searchParams.get("name");

    // Validate filename
    if (!fileName) {
      return NextResponse.json({ error: "File name is required" }, { status: 400 });
    }

    // Construct backend download URL
    const backendUrl = new URL(`http://localhost:8000/cloud/download_file/`);
    backendUrl.searchParams.set("name", fileName);

    // Perform file download request to backend
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
        error: errorText || "Failed to download file" 
      }, { 
        status: responseBackend.status 
      });
    }

    // Extract filename, ensuring it's safe
    const safeFileName = fileName.split('/').pop() || 'downloaded_file';

    // Create response with file download headers
    const response = new NextResponse(responseBackend.body, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${safeFileName}"`,
      },
    });

    return response;

  } catch (error) {
    console.error("Download request error:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Internal server error" 
    }, { status: 500 });
  }
}