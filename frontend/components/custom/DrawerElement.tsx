'use client'
import React, { ReactNode, useState } from 'react'
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { FolderIcon } from "lucide-react"
import FileUpload from "@/components/custom/UploadFiles/FileUploader"
import useDriveState from '@/states/useDriveState'

type DrawerElementProps = {
  children: ReactNode;
};

export default function DrawerElement({ children }: DrawerElementProps) {
  const { newFolderName, setNewFolderName, getCurrentPath } = useDriveState();
  const currentPath = getCurrentPath();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const resourceName = currentPath;
  const extractResorcePath = currentPath.replace(`/${resourceName}` , '');
  const pathToResource = extractResorcePath.replace(/^\/+/, '');

  const createDir = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)
    try {
      const response = await fetch('/api/create_dir', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name_dir: newFolderName, path_on_folder: pathToResource || '' }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setMessage({ type: 'success', text: `Carpeta "${newFolderName}" creada exitosamente.` })
        setNewFolderName('')
      } else {
        setMessage({ type: 'error', text: data.error || data.message || 'Error al crear el directorio' })
      }
    } catch (error) {
      console.error('Error al crear el directorio:', error)
      setMessage({ type: 'error', text: 'Error al crear el directorio. Por favor, intente de nuevo.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent className='items-center min-h-0 h-auto md:w-2/4 md:mx-auto'>
        <DrawerHeader>
          <DrawerTitle className='text-center text-2xl mt-3'>Agregar un nuevo elemento</DrawerTitle>
          <DrawerDescription className='text-center'>
            {currentPath ?
              `Crear en: ${currentPath}` :
              'Crear en el directorio raíz'
            }
          </DrawerDescription>
        </DrawerHeader>
        <div className="space-y-4 p-4 h-auto lg:min-w-[390px] md:min-w-[500px] max-sm:min-w-[320px]">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full mb-5" disabled={isLoading}>
                <FolderIcon className="mr-2 h-4 w-4" />
                Nueva Carpeta
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4">
              <form onSubmit={createDir} className='space-y-2'>
                <Label htmlFor="newFolderName">Nombre de la carpeta</Label>
                <Input
                  id="newFolderName"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Ingresa el nombre"
                />
                <Button 
                  type="submit"
                  disabled={isLoading || !newFolderName.trim()}
                  >
                  {isLoading ? 'Creando...' : 'Crear'}
                </Button>
              </form>
              {message && (
                <p className={`mt-2 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {message.text}
                </p>
              )}
            </PopoverContent>
          </Popover>
          <FileUpload currentPath={pathToResource} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}