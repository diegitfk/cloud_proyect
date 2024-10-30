import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Solicitud POST recibida:', body);

    const fastapiResponse = await fetch('http://localhost:8000/auth/sign', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (fastapiResponse.status == 400){
      return NextResponse.json({invalidCredentials : "Username or Email Exists"} , {status : 400});
    }
    if (fastapiResponse.status == 200){
      return NextResponse.json({planError : "Plan selected Invalid"})
    }

    const fastapiJson = await fastapiResponse.json();
    
    return NextResponse.json({fastapiJson} , {status : 200});
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return NextResponse.json({ reason: 'Error interno del servidor' }, { status: 500 });
  }
}