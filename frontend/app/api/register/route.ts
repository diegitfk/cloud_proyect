import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Solicitud POST recibida:', body);

    const response = await fetch('http://localhost:8000/auth/sign', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('Respuesta recibida de FASTAPI:', data);

    if (response.ok) {
      return NextResponse.json(data, { status: 201 });
    } else {
      return NextResponse.json({ reason: data.detail || data }, { status: response.status });
    }
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return NextResponse.json({ reason: 'Error interno del servidor' }, { status: 500 });
  }
}