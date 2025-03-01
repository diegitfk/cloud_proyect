'use client'
import Link from "next/link"
import { Button } from "../ui/button"
import { PlusIcon, TrashIcon, FolderIcon, HomeIcon } from "lucide-react"
import DrawerElement from "./DrawerElement"
import { Storage_bar } from "./StorageBar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

type SideBarProps = {
  setActiveView: (view: string) => void;
}

export default function SideBar({ setActiveView }: SideBarProps) {
  return (
    <Sidebar variant="sidebar" className="border-r w-64">
      {/* Encabezado del Sidebar */}
      <SidebarHeader className="mt-4">
        <DrawerElement>
          <Button variant="outline" className="w-full hover:bg-green-600 hover:text-white">
            <PlusIcon className="mr-2 h-4 w-4" />
            Nuevo
          </Button>
        </DrawerElement>
      </SidebarHeader>

      {/* Contenido Principal del Sidebar */}
      <SidebarContent>
        <SidebarGroup>
          <Link
            href="/drive"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
            prefetch={false}
            onClick={() => setActiveView("mi-almacenamiento")}
          >
            <HomeIcon className="h-4 w-4" />
            Mi Almacenamiento
          </Link>
          <Link
            href="/drive/shared"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
            prefetch={false}
            onClick={() => setActiveView("compartidos-conmigo")}
          >
            <FolderIcon className="h-4 w-4" />
            Compartido conmigo
          </Link>
          <Link
            href="/drive/trash"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
            prefetch={false}
            onClick={() => setActiveView("papelera")}
          >
            <TrashIcon className="h-4 w-4" />
            Papelera
          </Link>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer del Sidebar con Barra de Almacenamiento */}
      <SidebarFooter>
        <Storage_bar />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
