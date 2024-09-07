'use client'
import { LayoutGrid, List } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import CardsDrive from "@/components/custom/CardsDrive"
import SideBar from "@/components/custom/SideBar"
import DrawerElement from "@/components/custom/DrawerElement"
import { PlusIcon } from "lucide-react"

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
    <>
      <div className="flex flex-1">
        <div className="flex-1 overflow-auto p-4 md:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <CardsDrive items={items} onAddItem={addItem} />
          </div>
        </div>
      </div>
      {/* Sección de Drawer, controla la creación de nuevos elementos */}
      <DrawerElement>
        <Button variant="outline" className="fixed bottom-4 right-4 z-10 md:hidden">
          <PlusIcon className="mr-2 h-4 w-4" />
          Nuevo
        </Button>
      </DrawerElement>
    </>
  )
}