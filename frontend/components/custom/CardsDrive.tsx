'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useSWR from 'swr';
import { Spinner } from "@/components/ui/spinner";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import FileIcon from "@/public/icons/fileicon.svg";
import FolderIcon from "@/public/icons/foldericon.svg";
import { Ellipsis } from "lucide-react";
import { ShareDialog } from './ShareDialog';
import useDriveState from '@/states/useDriveState';

// Type for Drive Item
type DriveItem = {
  id: string;
  name: string;
  type: "folder" | "file";
  size: number;
  created_at: string;
  path: string;
};

// Fetcher function for getting drive items
const fetcher = async (url: string, path: string): Promise<DriveItem[]> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ path_on_folder: path || "" })
  });

  if (!response.ok) {
    throw new Error('Error al cargar los directorios');
  }

  const data = await response.json();
  return data.tree;
};

const CardsDrive = () => {
  const { getCurrentPath, setPath } = useDriveState();
  const router = useRouter();
  const pathname = usePathname();
  const currentPath = getCurrentPath();
  const { data, error, isLoading } = useSWR(['/api/tree', currentPath], ([url, path]) => fetcher(url, path), {
    refreshInterval: 10000,
    revalidateOnFocus: true,
  });

  useEffect(() => {
    const pathFromUrl = pathname.replace('/drive', '').replace(/^\/+|\/+$/g, '');
    setPath(pathFromUrl);
  }, [pathname, setPath]);

  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DriveItem | null>(null);

  async function downloadFolder(folderName: string) {
    try {
      const response = await fetch(`/api/download_folder?name=${encodeURIComponent(folderName)}`, {
        method: 'GET',
      });
   
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Download failed');
      }
   
      // Get the filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition?.match(/filename="?(.+)"?/i);
      const suggestedFilename = filenameMatch ? filenameMatch[1] : 'carpeta_descargada.zip';
   
      // Create a blob and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = suggestedFilename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
   
      // Mostrar toast de éxito
      console.log('Carpeta descargada correctamente', {
        description: `Se ha descargado: ${suggestedFilename}`
      });
   
    } catch (error) {
      console.error('Error de descarga de carpeta:', error);
      // Mostrar toast de error
      console.error('Error al descargar carpeta', {
        description: error instanceof Error ? error.message : 'Intente nuevamente'
      });
    }
   }

  async function downloadFile(fileName: string) {
    try {
      const response = await fetch(`/api/download_file?name=${encodeURIComponent(fileName)}`, {
        method: 'GET',
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Download failed');
      }
  
      // Get the filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition?.match(/filename="?(.+)"?/i);
      const suggestedFilename = filenameMatch ? filenameMatch[1] : 'downloaded_file';
  
      // Create a blob and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = suggestedFilename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
  
    } catch (error) {
      console.error('File download error:', error);
      // Handle error (e.g., show error message to user)
    }
  }
  
  // Usage example
  const handleDownload = () => {
    downloadFile('example.txt');
  };

  const handleFolderClick = (folderPath: string) => {
    router.push(`/drive/${folderPath}`);
  };

  const handleShareClick = (event: React.MouseEvent, item: DriveItem) => {
    event.stopPropagation();
    setSelectedItem(item);
    setShareDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <Spinner size={"large"} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-red-800/40 rounded-md p-5">
        <p className="text-red-500">Mensaje: {error.message}</p>
      </div>
    );
  }

  const items = Array.isArray(data) ? data : [];

  return (
    <>
      {items.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p>No hay elementos en este directorio</p>
        </div>
      ) : (
        items.map((element: DriveItem, index: number) => (
          <Card
            key={element.id || index}
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
                    <DropdownMenuItem onClick={(e) => handleShareClick(e, element)}>Compartir</DropdownMenuItem>
                    <DropdownMenuItem>Renombrar</DropdownMenuItem>
                    {element.type === 'file' && (
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation(); // Previene que se abra la carpeta/archivo
                          downloadFile(element.path); // Pasa la ruta completa del archivo
                        }}
                      >
                        Descargar
                      </DropdownMenuItem>
                    )}
                    {element.type === 'folder' && (
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation(); // Previene que se abra la carpeta
                          downloadFolder(element.path); // Pasa la ruta completa de la carpeta
                        }}
                      >
                        Descargar carpeta
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>Mover a</DropdownMenuItem>
                    <DropdownMenuItem className='text-red-500'>Eliminar</DropdownMenuItem>
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
