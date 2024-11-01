'use client'
import React from 'react';
import useSWR from 'swr';
import Image from "next/image"
import { Spinner } from "@/components/ui/spinner"
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
  size: number; // Tamaño del elemento
  createdAt: string; // Fecha de creación
};

interface ApiResponse {
  tree: DriveItem[];
}

const fetcher = async (url: string): Promise<DriveItem[]> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ path_on_folder: "" }) 
  });

  if (!response.ok) {
    throw new Error('Error al cargar los directorios');
  }

  const data: ApiResponse = await response.json();
  return data.tree;
};

const CardsDrive = () => {
  const { data, error, isLoading } = useSWR<DriveItem[]>('/api/tree', fetcher, {
    refreshInterval: 10000, // Refresca cada 10 segundos
    revalidateOnFocus: true,
  });

  if (isLoading) 
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <Spinner size={"large"}/>
      </div>
    ) 
  if (error) 
    return <div>Error al cargar las carpetas</div>;

  // Asegurarse de que data sea un array antes de mapearlo
  const items = Array.isArray(data) ? data : [];
  return (
    <>
      {items.map((element: DriveItem, index: number) => (
        <Card key={element.id || index } className="flex flex-col justify-center group shadow-md w-full min-h-[180px] cursor-pointer transition-transform duration-200 ease-in-out transform active:scale-100 hover:scale-95">
          <CardHeader className="flex flex-col p-2">
            <div className='flex items-end justify-end'>
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
            <div className='flex items-center justify-center gap-2 grow'>
              {element.type === 'file' ? (
                <FileIcon className="h-6 w-6" />
              ) : (
                <FolderIcon className="h-6 w-6" />
              )}
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-2 p-4">
            <div className="flex items-center justify-center gap-2 grow">
              <div className="flex flex-row p-2 text-lg font-medium select-none">{element.name}</div>
            </div>
            <div className="text-sm text-muted-foreground select-none">{element.createdAt}</div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};
export default CardsDrive;
