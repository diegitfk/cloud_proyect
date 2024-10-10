'use client'
import { useState } from "react"
import Link from 'next/link';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import LogoCloudingDrive from "@/public/icons/cloudicon.svg";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from 'lucide-react';
import { formSchema } from "./components/RegisterForm.form"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

type FormData = z.infer<typeof formSchema>;

export default function PageRegister() {
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()


  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      nombre: "",
      apellido: "",
      email: "",
      password: "",
      plan: "",
    },
  })

  async function onSubmit(form_register: z.infer<typeof formSchema>) {
    // Comunicación con endpoint de nextjs para registrar usuario
    setIsLoading(true)
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form_register),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Te has registrado correctamente",
          description: `Bienvenido a CloudingDrive, ${data.username}. Tu cuenta ha sido creada correctamente, ahora puedes iniciar sesión.`,
          duration: 3000,
        })
        // Redireccionar al usuario a la página de inicio de sesión con un delay de 3 segundos
        setTimeout(() => {
          router.push("/login")
        }, 3000);

      } else {
        throw new Error(data.message || "Error en el registro")
      }
    } catch (error) {
      console.error("Error al registrar el usuario:", error)
      toast({
        title: "Error en el registro",
        description: error instanceof Error ? error.message : "Hubo un problema al crear tu cuenta. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      // Mantener isLoading en true durante el tiempo adicional de carga
      setTimeout(() => {
        setIsLoading(false)
      }, 5000) // Tiempo adicional de 5 segundos para simular carga
    }
  }
  return (
    <div className="flex-col place-content-center min-h-screen">
      <div className="flex items-center justify-center animate-fade-down animate-once animate-duration-200 animate-delay-100 animate-ease-out animate-normal animate-fill-backwards">
          <LogoCloudingDrive width={70} height={70}/>
          <h1 className="xl:text-6xl md:text-2xl font-bold ml-4">CloudingDrive</h1>
      </div>
      <Card className="mx-auto w-full max-w-2xl shadow-lg p-2 mt-10">
        <CardHeader className="animate-fade animate-duration-100 animate-delay-200 animate-ease-out animate-fill-backwards">
          <CardTitle className="text-2xl mx-auto">Creación de cuenta</CardTitle>
          <CardDescription className="text-muted-foreground">
            Ingrese sus datos a continuación para registrarse en nuestra plataforma.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="animate-fade-left animate-once animate-duration-[80ms] animate-delay-[200ms] animate-ease-out animate-normal animate-fill-backwards">
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="John47" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem className="animate-fade-left animate-once animate-duration-[80ms] animate-delay-[400ms] animate-ease-out animate-normal animate-fill-backwards">
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="apellido"
                render={({ field }) => (
                  <FormItem className="animate-fade-left animate-once animate-duration-[80ms] animate-delay-[600ms] animate-ease-out animate-normal animate-fill-backwards">
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="animate-fade-left animate-once animate-duration-[80ms] animate-delay-[800ms] animate-ease-out animate-normal animate-fill-backwards">
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="example@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="animate-fade-left animate-once animate-duration-[80ms] animate-delay-[1000ms] animate-ease-out animate-normal animate-fill-backwards">
                    <FormLabel>Contraseña</FormLabel>
                    <div className="relative">
                      <Input
                        placeholder="********"
                        type={mostrarContraseña ? "text" : "password"}
                        {...field}
                        className="w-full"
                      />
                      <div
                        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                        onClick={() => setMostrarContraseña(!mostrarContraseña)}
                      >
                        {mostrarContraseña ?
                          <Eye className="text-white" /> :
                          <EyeOff className="text-white" /> 
                        }
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="plan"
                render={({ field }) => (
                  <FormItem className="animate-fade-left animate-once animate-duration-[80ms] animate-delay-[1200ms] animate-ease-out animate-normal animate-fill-backwards">
                    <FormLabel>Plan de Suscripción</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione su plan de suscripción" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="pro">Pro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex-col animate-fade-up animate-once animate-duration-300 animate-delay-[1300ms] animate-ease-in-out animate-normal animate-fill-backwards">
              <Button
                className="w-full hover:bg-green-600 hover:text-white"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  "Registrarse"
                )}
              </Button>
              <div className="mt-4 text-center text-sm">
                ¿Si ya tienes una cuenta?{" "}
                <Link href="/login" className="underline" prefetch={false}>
                  Inicia Sesión
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div >
  )
}