'use client'
import React from 'react';
import Image from "next/image"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import FileIcon from "@/public/icons/fileicon.svg"
import FolderIcon from "@/public/icons/foldericon.svg"

// Este type maneja la estructura del Json que se enviará al BackEnd
type DriveItem = {
  id: string; // ID del elemento
  name: string; // Nombre del elemento
  type: "folder" | "file"; // El tipo de elemento a crear
  createdAt: string; // Fecha de creación
  icon: string; // Ruta del icono
};

type CardsDriveProps = {
  items: DriveItem[];
  onAddItem: (item: DriveItem) => void;
}

const CardsDrive: React.FC<CardsDriveProps> = ({ items, onAddItem }) => {
  return (
    <>
      {items.map((element: DriveItem) => (
        <Card key={element.id} className="group shadow-md max-w-[260px] cursor-pointer transition-transform duration-200 ease-in-out transform active:scale-95 hover:scale-105">
          <CardHeader className="flex flex-row-reverse items-center justify-center p-2">
            <div className='flex justify-end'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full select-none">
                    <Image src='icons/movehorizontal.svg' alt='imagen' width={24} height={24} />
                    <span className="select-none sr-only">Más opciones</span>
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
            </div>
            <div className="flex items-center justify-center gap-2 grow">
              <div className="flex flex-row p-2 text-sm font-medium select-none">{element.name}</div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-2 p-4">
            {element.type === 'file' ? (
              <FileIcon className="h-6 w-6" />
            ) : (
              <FolderIcon className="h-6 w-6" />
            )}
            <div className="text-sm text-muted-foreground select-none">{element.createdAt}</div>
          </CardContent>
        </Card>

      ))}
    </>
  );
};

export default CardsDrive;
