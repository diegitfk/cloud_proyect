import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import LogoCloudingDrive from "@/public/icons/cloudicon.svg";
import CardsDrive from "@/components/custom/cardsDrive"

export default function PageDrive() {
  return (
    <div className="flex h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center border-b bg-background px-4 md:px-6">
        <Link href="#" className="mr-6 flex items-center gap-2" prefetch={false}>
          <LogoCloudingDrive width={38} height={38} />
          <span className="text-lg font-semibold">CloudingDrive</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <SearchIcon className="h-5 w-5" />
            <span className="sr-only">Buscar</span>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <LayoutGridIcon className="h-5 w-5" />
            <span className="sr-only">Apps</span>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <BellIcon className="h-5 w-5" />
            <span className="sr-only">Notificaciones</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Image src="/icons/placeholder.svg"
                  width={32}
                  height={32}
                  alt="Avatar"
                  className="rounded-full"
                  style={{ aspectRatio: "32/32", objectFit: "cover" }}>
                </Image>
                <span className="sr-only">Menú de Usuario</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sesión iniciada como</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Tu drive</DropdownMenuItem>
              <DropdownMenuItem>Compartido conmigo</DropdownMenuItem>
              <DropdownMenuItem>Favoritos</DropdownMenuItem>
              <DropdownMenuItem>Papelera</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Configuraciones</DropdownMenuItem>
              <DropdownMenuItem>Ayuda</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </header>
      <div className="flex flex-1">
        <div className="hidden w-64 flex-col border-r bg-background p-4 md:flex">
          <Button variant="outline" className="mb-4">
            <PlusIcon className="mr-2 h-4 w-4" />
            Nuevo
          </Button>
          <nav className="flex flex-col gap-2">
            <Link
              href="#"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
              prefetch={false}
            >
              <HomeIcon className="h-4 w-4" />
              Mi Almacenamiento
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
              prefetch={false}
            >
              <FolderIcon className="h-4 w-4" />
              Compartido conmigo
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
              prefetch={false}
            >
              <StarIcon className="h-4 w-4" />
              Favoritos
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
              prefetch={false}
            >
              <TrashIcon className="h-4 w-4" />
              Papelera
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex items-center gap-4 border-b bg-background p-4 md:px-6">
            <Breadcrumb className="flex-1">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="#" prefetch={false}>
                      My Drive
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Documentos</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <LayoutGridIcon className="h-5 w-5" />
                <span className="sr-only">Grid view</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <ListIcon className="h-5 w-5" />
                <span className="sr-only">List view</span>
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4 md:px-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <CardsDrive />
            </div>
          </div>
        </div>
      </div>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" className="fixed bottom-4 right-4 z-10 md:hidden">
            <PlusIcon className="mr-2 h-4 w-4" />
            Nuevo
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Nuevo</DrawerTitle>
            <DrawerDescription>Crear una nueva carpeta.</DrawerDescription>
          </DrawerHeader>
          <div className="space-y-4 p-4">
            <Button variant="outline" className="w-full">
              <FolderIcon className="mr-2 h-4 w-4" />
              Nueva Carpeta
            </Button>
            <div>
              <div>
                <div className="flex flex-col items-center justify-center gap-2">
                  <UploadIcon className="h-8 w-8" />
                  <div className="text-sm font-medium">Arrastre y suelte los archivos aquí o haga clic para cargar</div>
                </div>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

function BellIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}
function FolderIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  );
}

function HardDriveIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <title>{"CountingWorks PRO"}</title>
      <path d="M11.327.512c-3.806.034-7.447 3.19-7.181 7.75.102 1.547.88 3.382 2.981 5.733a.365.365 0 0 0 .635-.23l.053-2.266a.36.36 0 0 0-.1-.255 5.047 5.047 0 0 1 3.407-8.502c2.27-.104 4.011 1.236 4.753 2.744.34.693.527 1.45.55 2.222a.357.357 0 0 0 .343.344c.482.015.962.064 1.437.147a.359.359 0 0 0 .424-.344 7.237 7.237 0 0 0-2.769-5.788C15.02 1.404 13.564.52 11.327.512zm4.94 8.362a14.8 14.8 0 0 0-2.515.26.364.364 0 0 0-.17.635l1.695 1.435a.36.36 0 0 0 .316.073 5.026 5.026 0 0 1 3.123.281c1.78.787 2.92 2.414 3.042 4.304.208 3.187-2.48 5.539-5.277 5.37a5.032 5.032 0 0 1-1.751-.412.365.365 0 0 0-.443.115c-.289.385-.603.75-.94 1.094a.367.367 0 0 0 .09.573c1.887 1.073 3.936 1.16 6.014.32 3.303-1.304 4.63-4.523 4.545-6.847-.096-2.641-1.48-5.072-4.085-6.402-.921-.47-2.04-.812-3.643-.799zm-12.931 1.2a.364.364 0 0 0-.152.052c-1.41.827-2.216 2.057-2.798 3.777-.285.892-.386 1.51-.386 2.436a7.276 7.276 0 0 0 7.157 7.141c1.129.017 2.104-.235 2.962-.583 1.45-.62 3.142-1.597 4.65-4.912a.363.363 0 0 0-.459-.489l-2.365.867a.357.357 0 0 0-.195.174 5.03 5.03 0 0 1-2.268 2.224C6 22.428 2.473 19.784 2.235 16.74c-.145-1.741.494-3.053 1.37-3.982.293-.308.41-.477.663-.662a.36.36 0 0 0 .098-.471 9.173 9.173 0 0 1-.653-1.326.366.366 0 0 0-.377-.225z" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function LayoutGridIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg

      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}
