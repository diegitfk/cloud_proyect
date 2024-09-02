import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function PageRegister() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1E1E1E]">
        <Card className="w-full max-w-md shadow-md bg-[#2d2d2d] border-none">
          <CardHeader>
            <CardTitle className="text-2xl mx-auto text-[#FFFFFF]">Creación de cuenta</CardTitle>
            <CardDescription className="text-[#e0e0e0]">Ingrese sus datos a continuación para registrarse en nuestra plataforma.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-[#FFFFFF]">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Nombre Completo
                <span className="text-red-500 absolute ml-1">*</span>
                <Input className="mt-2 bg-[#454545]" id="name" placeholder="John Doe" required />
              </Label>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">
                Correo Electrónico
                <span className="text-red-500 absolute ml-1">*</span>
                <Input className="mt-2 bg-[#454545]" id="email" type="email" placeholder="example@email.com" />
              </Label>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">
                Contraseña
                <span className="text-red-500 absolute ml-1">*</span>
                <Input className="mt-2 bg-[#454545]" id="password" type="password" />
              </Label>             
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">
                Confirmar contraseña
                <span className="text-red-500 absolute ml-1">*</span>
                <Input className="mt-2 bg-[#454545]" id="confirm-password" type="password" />
              </Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-gradient-to-r from-[rgb(46,139,87)] to-[rgb(97,188,132)]">Registrarse</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  