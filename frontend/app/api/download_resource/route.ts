import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const sessionCookie = (await cookieStore).get("session_jwt");
    
    if (!sessionCookie) {
      return NextResponse.json({ error: "No session cookie found" }, { status: 401 });
    }

    const cookieHeader = `${sessionCookie.name}=${sessionCookie.value}`;
    const url = new URL(request.url);
    const nameFile = url.searchParams.get("name");

    if (!nameFile) {
      return NextResponse.json({ error: "File name is required" }, { status: 400 });
    }

    const responseBackend = await fetch(
      `http://localhost:8000/share/download_resource/?name=${encodeURIComponent(nameFile)}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Cookie": cookieHeader,
        },
      }
    );

    // Improved error handling
    if (!responseBackend.ok) {
      let errorMessage = "Unknown error occurred";
      try {
        const errorData = await responseBackend.text(); // Use text() instead of json()
        console.error("Backend error response:", errorData);
        errorMessage = errorData || "Error downloading file";
      } catch (parseError) {
        console.error("Error parsing error response:", parseError);
      }

      return NextResponse.json({ error: errorMessage }, { status: responseBackend.status });
    }

    // Get content type and filename
    const contentType = responseBackend.headers.get('Content-Type') || 'application/octet-stream';
    const fileName = nameFile.split("/").pop() || "downloaded_file";
    const contentDisposition = `attachment; filename="${fileName}"`;

    // Return the file as a response
    return new Response(responseBackend.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition,
      },
    });

  } catch (error) {
    console.error("Download request error:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Error de solicitud" 
    }, { status: 500 });
  }
}