'use client'
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import axios from '@/app/api/axios'

interface LoginCredentials {
  email: string;
  password: string;
}

const LoginUrl = '/auth/login'

export default function PageLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    try {
      const response = await axios.post(LoginUrl, {
        email: email,
        password: password

      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md shadow-lg py-5">
        <CardHeader>
          <CardTitle className="text-2xl mx-auto">Iniciar Sesión</CardTitle>
          <CardDescription>Ingrese su correo electrónico y contraseña.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              required
              id="email"
              type="email"
              placeholder="example@email.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              required
              id="password"
              type="password"
              placeholder='********'
              onChange={(e) => setPassword(e.target.value)}
            />
            <Link href="#" className="ml-auto inline-block text-sm underline " prefetch={false}>
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </CardContent>
        <CardFooter className='flex-col'>
          <Button className="w-full" onClick={handleLogin}>
            Iniciar Sesión
          </Button>
          <div className="mt-4 text-center text-sm">
            ¿No tienes una cuenta?{" "}
            <Link href="/login/register" className="underline" prefetch={false}>
              Regístrate
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};