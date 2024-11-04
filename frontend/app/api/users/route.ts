import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const sessionCookie = (await cookieStore).get("session_jwt");
    const cookieHeader = sessionCookie?.name + "=" + sessionCookie?.value;
    const response = await fetch(
        'http://localhost:8000/cloud/share/users' , 
        {
            method : "GET",
            headers : {
                "Content-Type" : "application/json",
                "Cookie" : cookieHeader
            }
        }
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 }
    );
  }
}