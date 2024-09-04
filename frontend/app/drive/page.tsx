'use client'
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import CardsDrive from "@/components/custom/cardsDrive"
import NavBar from "@/components/custom/NavBar"
import FolderIcon from "@/public/icons/foldericon.svg"

type DriveItem = {
  id: string; // ID del elemento
  name: string; // Nombre del elemento
  type: "folder" | "file"; // El tipo de elemento a crear
  createdAt: string; // Fecha de creación
  icon: string; // Ruta del icono
};

const initialItems: DriveItem[] = [
  {
    id: "1",
    name: "Carpeta 1",
    type: "folder",
    createdAt: "02/09/2024",
    icon: "/icons/foldericon.svg"
  },
  {
    id: "2",
    name: "Archivo 1",
    type: "file",
    createdAt: "03/09/2024",
    icon: "/icons/fileicon.svg"
  }
];

export default function PageDrive() {
  const [items, setItems] = useState<DriveItem[]>(initialItems);

  const addItem = (item: DriveItem) => {
    setItems([...items, item]);
  };

  return (
    <div className="flex h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center border-b bg-background px-4 md:px-6">
        <NavBar />
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
              <CardsDrive items={items} onAddItem={addItem} />
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
