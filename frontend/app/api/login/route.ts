import { NextResponse } from 'next/server'
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const fastapiResponse = await fetch('http://localhost:8000/auth/login', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials : 'include',
      body: JSON.stringify(body),
    })

    if (fastapiResponse.status == 400){
      const fastapiJson = await fastapiResponse.json();
      return NextResponse.json({message : fastapiJson.detail} , {status : 400})
    }
    const userData = await fastapiResponse.json()
  
    const response = NextResponse.json(
      userData,  // Sin anidamiento adicional
      { status: 200 }
    );

    let backendCookies = fastapiResponse.headers.getSetCookie();
    backendCookies.forEach(cookie => {
      response.headers.append('set-cookie', cookie);
    })
    // You might want to set cookies or perform other actions here
    // based on your authentication strategy
    const cookieStore = cookies();
    const sessionCookie = (await cookieStore).get('session_jwt');
    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}