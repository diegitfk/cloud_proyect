import Link from "next/link"
import { Button } from "../ui/button"
import { PlusIcon, TrashIcon, FolderIcon, HomeIcon } from "lucide-react"
import DrawerElement from "./DrawerElement"

export default function SideBar() {
  return (
    <div className="hidden w-64 flex-col border-r bg-background p-4 md:flex">
      {/* Botón Nuevo que activa el Drawer */}
      <DrawerElement>
        <Button variant="outline" className="mb-4">
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
      </nav>
    </div>
  )
}