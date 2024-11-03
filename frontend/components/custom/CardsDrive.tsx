'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { Spinner } from "@/components/ui/spinner"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import FileIcon from "@/public/icons/fileicon.svg"
import FolderIcon from "@/public/icons/foldericon.svg"
import { Ellipsis } from "lucide-react"
import { ShareDialog } from './ShareDialog';
import { useState } from 'react';
// Este type maneja la estructura del Json que se enviará al BackEnd
type DriveItem = {
  id: string; // ID del elemento
  name: string; // Nombre del elemento
  type: "folder" | "file"; // El tipo de elemento a crear
  size: number; // Tamaño del elemento
  created_at: string; // Fecha de creación
  path: string;
};

interface CardsDriveProps {
  currentPath: string;
}

const fetcher = async (url: string, path: string): Promise<DriveItem[]> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ path_on_folder: path || ""}) 
  });

  if (!response.ok) {
    throw new Error('Error al cargar los directorios');
  }

  const data = await response.json();
  return data.tree;
};

const CardsDrive: React.FC<CardsDriveProps> = ({ currentPath }) => {
  const router = useRouter();
  const { data, error, isLoading } = useSWR(['/api/tree', currentPath], ([url, path]) => fetcher(url, path), {
    refreshInterval: 10000, // Refresca cada 10 segundos
    revalidateOnFocus: true,
  });
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DriveItem | null>(null);


  const handleFolderClick = (folderPath: string) => {
    router.push(`/drive/${folderPath}`);
  };
  const handleShareClick = (event: React.MouseEvent, item: DriveItem) => {
    event.stopPropagation();
    setSelectedItem(item);
    setShareDialogOpen(true);
  };

  if (isLoading) 
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <Spinner size={"large"}/>
      </div>
    ) 
  if (error) 
    return (
      <div className="flex items-center justify-center h-full bg-red-800/40 rounded-md p-5">
        <p className="text-red-500">Mensaje: {error.message}</p>
      </div>
    );
  // Asegurarse de que data sea un array antes de mapearlo
  const items = Array.isArray(data) ? data : [];

  return (
    <>
      {items.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p>No hay elementos en este directorio</p>
        </div>
      ) : (
        items.map((element: DriveItem, index: number) => (
          <Card key={element.id || index}
          className="flex flex-col justify-center group shadow-md w-full min-h-[180px] cursor-pointer transition-transform duration-200 ease-in-out transform active:scale-100 hover:scale-95"
          onClick={() => element.type === 'folder' ? handleFolderClick(element.path) : null}
          >
            <CardHeader className="flex flex-col p-2">
              <div className='flex items-end justify-end'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full select-none">
                      <Ellipsis className="h-6 w-6" />
                      <span className="select-none sr-only">Más opciones</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Abrir</DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => handleShareClick(e , element)}>Compartir</DropdownMenuItem>
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
              <div className="text-sm text-muted-foreground select-none">{new Date(element.created_at).toLocaleDateString()}</div>
            </CardContent>
          </Card>
        ))
      )}
      {selectedItem && (
        <ShareDialog
          isOpen={shareDialogOpen}
          onClose={() => {
            setShareDialogOpen(false);
            setSelectedItem(null);
          }}
          itemName={selectedItem.name}
          itemPath={selectedItem.path}
        />
      )}
    </>
  );
};

export default CardsDrive;