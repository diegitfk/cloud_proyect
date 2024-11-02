'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import LoadingButton from "@/components/custom/ButtonLoading"
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function PageLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsRedirecting(true)
        toast({
          title: "Inicio de sesión exitoso",
          description: `Bienvenido a CloudingDrive, ${data.username}.`,
          duration: 3000,
        })
        setTimeout(() => {
          router.push("/drive")
        }, 3000);
      } else {
        throw new Error(data.message || "Error en el inicio de sesión")
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      toast({
        title: "Error en el inicio de sesión",
        description: error instanceof Error ? error.message : "Hubo un problema al iniciar sesión. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
      setError('Correo electrónico o contraseña inválidos')
      setIsLoading(false)
      setIsRedirecting(false)
    }
  }

  const isButtonLoading = isLoading || isRedirecting;

  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md shadow-lg py-5 animate-fade animate-once animate-duration-[600ms] animate-delay-[40ms] animate-ease-out animate-normal animate-fill-backwards">
          <CardHeader className='animate-fade-down animate-once animate-duration-[200ms] animate-delay-[100ms] animate-ease-out animate-normal animate-fill-backwards'>
            <CardTitle className="text-2xl mx-auto">Iniciar Sesión</CardTitle>
            <CardDescription>Ingrese su correo electrónico y contraseña.</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="grid gap-2 animate-fade-left animate-once animate-duration-[80ms] animate-delay-[200ms] animate-ease-out animate-normal animate-fill-backwards">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  required
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isButtonLoading}
                />
              </div>
              <div className="grid gap-2 animate-fade-left animate-once animate-duration-[80ms] animate-delay-[400ms] animate-ease-out animate-normal animate-fill-backwards">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  required
                  id="password"
                  type="password"
                  placeholder='********'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isButtonLoading}
                />
                <Link href="#" className="ml-auto inline-block text-sm underline animate-fade-left animate-once animate-duration-[80ms] animate-delay-[600ms] animate-ease-out animate-normal animate-fill-backwards " prefetch={false}>
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </CardContent>
            <CardFooter className='flex-col animate-fade-up animate-once animate-duration-[100ms] animate-delay-[800ms] animate-ease-out animate-normal animate-fill-backwards'>
              <LoadingButton
                isLoading={isLoading}
                isRedirecting={isRedirecting} 
                disabled={isButtonLoading}
                >
                  Iniciar Sesión
              </LoadingButton>
              <div className="mt-4 text-center text-sm">
                ¿No tienes una cuenta?{" "}
                <Link href="/login/register" className="underline" prefetch={false}>
                  Regístrate
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
};
