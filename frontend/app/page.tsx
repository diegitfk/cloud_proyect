import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import NavBarLayout from "@/components/custom/NavBarLayout"
import { BriefcaseIcon, DatabaseIcon, HeadphonesIcon, PieChartIcon, RocketIcon, TabletsIcon } from "lucide-react"

export default function PageHome() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBarLayout />
      <main className="flex-1">
        <section className="w-full py-12 md:py-20 lg:py-22">
          <div className="container grid gap-12 px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Tu elección es CloudingDrive</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  CloudingDrive ofrece una amplia gama de servicios para satisfacer las necesidades del almacenamiento en la NUBE de tu empresa.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              <Card>
                <CardContent className="flex flex-col items-center justify-center gap-4 p-8">
                  <RocketIcon className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold text-center">Migración a la Nube</h3>
                  <p className="text-muted-foreground">
                  Planificación de migración, herramientas de transferencia de datos, y soporte técnico durante y después de la migración.Te acompañamos en todo el proceso.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center justify-center gap-4 p-8">
                  <TabletsIcon className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold text-center">Seguridad e integridad</h3>
                  <p className="text-muted-foreground">Autenticación OAuth2</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center justify-center gap-4 p-8">
                  <DatabaseIcon className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold text-center">Bases de datos no estructuradas</h3>
                  <p className="text-muted-foreground">Los archivos de su empresa se encontraran administrados por la flexibilidad, escalabilidad y baja latencia de las bases de datos no estructuradas.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center justify-center gap-4 p-8">
                  <HeadphonesIcon className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold text-center">Soporte y asistencia</h3>
                  <p className="text-muted-foreground">Brindamos soporte técnico personalizado y oportuno.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center justify-center gap-4 p-8">
                  <BriefcaseIcon className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold text-center">Consultoría de Cloud Storage</h3>
                  <p className="text-muted-foreground">Ofrecemos asesoramiento estratégico para impulsar tu negocio.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center justify-center gap-4 p-8">
                  <PieChartIcon className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold text-center">Análisis de datos</h3>
                  <p className="text-muted-foreground">
                    Ayudamos a tomar decisiones informadas a través del análisis de datos.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 CloudingDrive inc. Todos los derechos reservados.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Términos de servicio
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacidad
          </Link>
        </nav>
      </footer>
    </div>
  )
}