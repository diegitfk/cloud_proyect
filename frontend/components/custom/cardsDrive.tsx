'use client'
import { useState } from 'react';
import Image from "next/image"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import FileIcon from "@/public/icons/fileicon.svg"
import FolderIcon from "@/public/icons/foldericon.svg"

// 
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
    icon: FolderIcon,
  },
  {
    id: "2",
    name: "Archivo 1",
    type: "file",
    createdAt: "03/09/2024",
    icon: FileIcon,
  },
];

export default function CardsDrive() {
  const [items, setItems] = useState<DriveItem[]>(initialItems);

  const handleCreateFolder = () => {
    const newFolder: DriveItem = {
      id: (items.length + 1).toString(),
      name: `Carpeta ${items.length + 1}`,
      type: "folder",
      createdAt: new Date().toLocaleDateString(),
      icon: FolderIcon,
    };
    setItems([...items, newFolder]);
  };

  const handleCreateFile = () => {
    const newFile: DriveItem = {
      id: (items.length + 1).toString(),
      name: `Archivo ${items.length + 1}`,
      type: "file",
      createdAt: new Date().toLocaleDateString(),
      icon: FileIcon,
    };
    setItems([...items, newFile]);
  };

  type CardsDriveProps = {
    items: DriveItem[];
    onAddItem: (item: DriveItem) => void;
  }
  return (
    <>
      {items.map((element: DriveItem) => (
        <Card key={element.id} className="group">
            <CardHeader className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {element.type === 'file' ? (
                    <FileIcon className="h-6 w-6" />
                  ) : (
                    <FolderIcon className="h-6 w-6" />
                  )}
                  <div className="text-sm font-medium">{element.name}</div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Image src='icons/movehorizontal.svg' alt='imagen' width={24} height={24}/>
                            <span className="sr-only">Más opciones</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Abrir</DropdownMenuItem>
                        <DropdownMenuItem>Compartir</DropdownMenuItem>
                        <DropdownMenuItem>Renombrar</DropdownMenuItem>
                        <DropdownMenuItem>Mover a</DropdownMenuItem>
                        <DropdownMenuItem>Eliminar</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-2 p-4">
                <Image src="icons/placeholder.svg"
                    width="100"
                    height="100"
                    alt={element.name}
                    className="rounded"
                    style={{ aspectRatio: "100/100", objectFit: "cover" }}>
                </Image>
                <div className="text-sm text-muted-foreground">{element.createdAt}</div>
            </CardContent>
        </Card>

      ))}
    </>
  );
};

