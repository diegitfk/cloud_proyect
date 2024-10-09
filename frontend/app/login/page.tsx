'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function PageLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
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
        toast({
          title: "Inicio de sesión exitoso",
          description: `Bienvenido a CloudingDrive, ${data.username}.`,
          duration: 3000,
        })
        // Redireccionar al usuario a la página de inicio de sesión con un delay de 3 segundos
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
      setError('Invalid email or password')
    } finally {
      // Mantener isLoading en true durante el tiempo adicional de carga
      setTimeout(() => {
        setIsLoading(false)
      }, 5000) // Tiempo adicional de 5 segundos para simular carga
    }
  }
  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md shadow-lg py-5">
          <CardHeader>
            <CardTitle className="text-2xl mx-auto">Iniciar Sesión</CardTitle>
            <CardDescription>Ingrese su correo electrónico y contraseña.</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  required
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Link href="#" className="ml-auto inline-block text-sm underline " prefetch={false}>
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </CardContent>
            <CardFooter className='flex-col'>
              <Button
                className="w-full hover:bg-green-600 hover:text-white"
                type='submit'
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
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