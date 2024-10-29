'use client'
import Link from "next/link"
import { Button } from "../ui/button"
import { PlusIcon, TrashIcon, FolderIcon, HomeIcon } from "lucide-react"
import DrawerElement from "./DrawerElement"
import { Storage_bar } from "../ui/storage_bar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

type SideBarProps = {
  newFolderName: string;
  setNewFolderName: (name: string) => void;
  handleCreateFolder: () => void;
}

export default function SideBar({ newFolderName, setNewFolderName, handleCreateFolder }: SideBarProps) {
  return (
    <Sidebar variant="sidebar" className="border-r w-64">
      {/* Encabezado del Sidebar */}
      <SidebarHeader className="mt-4">
        <DrawerElement
          newFolderName={newFolderName}
          setNewFolderName={setNewFolderName}
          handleCreateFolder={handleCreateFolder}
        >
          <Button variant="outline" className="w-full hover:bg-[#59B47D] hover:text-white">
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
