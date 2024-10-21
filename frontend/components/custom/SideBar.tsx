import Link from "next/link"
import { Button } from "../ui/button"
import { PlusIcon, TrashIcon, FolderIcon, HomeIcon } from "lucide-react"
import DrawerElement from "./DrawerElement"
import { Storage_bar } from "../ui/storage_bar"

type SideBarProps = {
  newFolderName: string;
  setNewFolderName: (name: string) => void;
  handleCreateFolder: () => void;
};

export default function SideBar({newFolderName, setNewFolderName, handleCreateFolder}: SideBarProps) {  
  return (
    <div className="w-64 h-full flex-shrink-0 flex-col border-r bg-background p-4 md:flex overflow-y-auto" aria-label="Menú lateral">
      {/* Botón Nuevo que activa el Drawer de Escritorio */}
      <DrawerElement 
        newFolderName={newFolderName}
        setNewFolderName={setNewFolderName}
        handleCreateFolder={handleCreateFolder}
      >
        <Button variant="outline" className="mb-4 hover:bg-[#59B47D] hover:text-white">
          <PlusIcon className="mr-2 h-4 w-4" />
          Nuevo
        </Button>
      </DrawerElement>
      <nav className="flex flex-col gap-2">
        <Link
          href="/drive"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
          prefetch={false}
        >
          <HomeIcon className="h-4 w-4" />
          Mi Almacenamiento
        </Link>
        <Link
          href="/drive/shared"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
          prefetch={false}
        >
          <FolderIcon className="h-4 w-4" />
          Compartido conmigo
        </Link>
        <Link
          href="/drive/trash"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
          prefetch={false}
        >
          <TrashIcon className="h-4 w-4" />
          Papelera
        </Link>

        {/* BARRA DE ALMACENAMIENTO DISPONIBLE */}
          <Storage_bar />

      </nav>
    </div>
  )
}