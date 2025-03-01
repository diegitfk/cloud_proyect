'use client'
import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useSWR from 'swr';
import { Spinner } from "@/components/ui/spinner"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import FileIcon from "@/public/icons/fileicon.svg"
import FolderIcon from "@/public/icons/foldericon.svg"
import { Ellipsis } from "lucide-react"
import { ShareDialog } from './ShareDialog';
import { useState } from 'react';import useDriveState from '@/states/useDriveState'
import MoveDialog from './DialogMoveTo';
import { url } from 'inspector';


// Este type maneja la estructura del Json que se enviará al BackEnd
export type DriveItem = {
  id: string; // ID del elemento
  name: string; // Nombre del elemento
  type: "folder" | "file"; // El tipo de elemento a crear
  size: number; // Tamaño del elemento
  created_at: string; // Fecha de creación
  path: string;
};

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

const fetcherSubdirs = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Error al cargar las rutas');
  }
  return response.json();
};
const CardsDrive = ({onTrash} : {onTrash : boolean}) => {
  const { getCurrentPath, setPath } = useDriveState();
  const router = useRouter();
  const pathname = usePathname();
  const currentPath = getCurrentPath(); // Usamos getCurrentPath para obtener el path normalizado
  let urlFetching = onTrash ? '/api/trash' :  '/api/tree'
  const { data, error, isLoading } = useSWR([urlFetching, currentPath], ([url, path]) => fetcher(url, path), {
    refreshInterval: 5000, // Refresca cada 5 segundos
    revalidateOnFocus: true,
  });
  const { data: subdirsData, error: subdirsError, isLoading: subdirsLoading } = useSWR(['/api/subdirs', fetcherSubdirs], ([url]) => fetcherSubdirs(url) , {
    refreshInterval : 3000,
    revalidateOnFocus : true
  });

  useEffect(() => {
    const pathFromUrl = onTrash ? pathname.replace('/drive/trash', '').replace(/^\/+|\/+$/g, '') : pathname.replace('/drive', '').replace(/^\/+|\/+$/g, '');
    setPath(pathFromUrl);
  }, [pathname, setPath]);

  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  //Estados Asociados a mover recursos
  const [moveDialogOpen, setMoveDialogOpen] = useState(false); //Activar el Dialog
  const [directories, setDirectories] = useState<string[]>([]); // Rutas de destino a mover
  //Estados Asociados a card Drive
  const [selectedItem, setSelectedItem] = useState<DriveItem | null>(null);




  const handleFolderClick = (folderPath: string) => {
    let pathPush = onTrash ? `/drive/trash/${folderPath}` : `/drive/${folderPath}`
    router.push(pathPush);
  };
  const handleShareClick = (event: React.MouseEvent, item: DriveItem) => {
    event.stopPropagation();
    setSelectedItem(item);
    setShareDialogOpen(true);
  };
  
  const handleDeleteClick = async (event : React.MouseEvent , item : DriveItem) => {
    event.stopPropagation()
    event.preventDefault();
    const fetchingDeleteUrl = `/api/del_folder`
    const sanitizedPath = item.path.startsWith('/') ? item.path.slice(1) : item.path;
    const body = {path_on_folder : sanitizedPath};
    try{
      const response = await fetch(fetchingDeleteUrl , {
        method : 'DELETE',
        headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify(body)
      })
    }
    catch{
      console.log("Error al eliminar")
    }
  }

  const handleMoveClick = (event : React.MouseEvent , item: DriveItem) => {
    event.stopPropagation()
    setSelectedItem(item); // Establece el ítem seleccionado
    setMoveDialogOpen(true); // Abre el diálogo de mover
  };

  const handleMove = (newPath: string) => {
    if (selectedItem) {
      // Realizar la petición para mover el archivo o carpeta
      const sanitizedItemPath = selectedItem.path.startsWith('/') ? selectedItem.path.slice(1) : selectedItem.path;
      const body = { path_resource: sanitizedItemPath, path_move_to : newPath };

      fetch('/api/move', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
        .then((response) => {
          if (response.ok) {
            // Cerrar el diálogo
            setMoveDialogOpen(false);
          } else {
            console.error("Error al mover el archivo o carpeta");
          }
        })
        .catch((error) => console.error("Error al hacer la solicitud", error));
    }
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
                    {element.type === 'folder' && <DropdownMenuItem>Abrir</DropdownMenuItem>}
                    {!onTrash && (<DropdownMenuItem onClick={(e) => handleShareClick(e , element)}>Compartir</DropdownMenuItem>)}
                    {!onTrash && (<DropdownMenuItem onClick={(e) => handleMoveClick(e , element)}>Mover a</DropdownMenuItem>)}
                    {!onTrash && element.type == 'folder' && (<DropdownMenuItem  className='text-red-500' onClick={(e) => handleDeleteClick(e , element)}>Eliminar</DropdownMenuItem>)}
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
      {
        selectedItem && (
          <MoveDialog 
            isOpen={moveDialogOpen}
            onClose={() => setMoveDialogOpen(false)}
            onMove={handleMove}
            directories={subdirsData}
            item={selectedItem}
          />
        )
      }
    </>
  );
};

export default CardsDrive;