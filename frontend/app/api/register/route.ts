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
      return NextResponse.json({invalidCredentials : "El usuario o contraseña no son válidos"} , {status : 400});
    }

    const userData= await fastapiResponse.json();
    
    return NextResponse.json({userData} , {status : 201});

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return NextResponse.json({ reason: 'Error interno del servidor' }, { status: 500 });
  }
}