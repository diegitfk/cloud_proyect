'use client'
import React, { ReactNode, useState } from 'react'
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { FolderIcon } from "lucide-react"
import FileUpload from "@/components/custom/UploadFiles/FileUploader"

type DrawerElementProps = {
  children: ReactNode;
  newFolderName: string;
  setNewFolderName: (name: string) => void;
  handleCreateFolder: () => void;
};

export default function DrawerElement({
  children,
  newFolderName,
  setNewFolderName,
  handleCreateFolder
}: DrawerElementProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      {/* DrawerContent permite manejar el tamaño del contenido del drawer */}
      <DrawerContent className='items-center min-h-0 h-auto md:w-2/4 md:mx-auto'> {/* h-auto permite que el contenedor se adapte a la altura del contenido */}
        <DrawerHeader>
          <DrawerTitle className='text-center text-2xl mt-3'>Agregar un nuevo elemento</DrawerTitle>
          <DrawerDescription className='text-center'>Puede crear una nueva carpeta o subir nuevos elementos.</DrawerDescription>
        </DrawerHeader>
        <div className="space-y-4 p-4 h-auto lg:min-w-[390px] md:min-w-[500px] max-sm:min-w-[320px]">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full mb-5">
                <FolderIcon className="mr-2 h-4 w-4" />
                Nueva Carpeta
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4">
              <div className="space-y-2">
                <Label htmlFor="newFolderName">Nombre de la carpeta</Label>
                <Input
                  id="newFolderName"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Ingresa el nombre"
                />
                <Button onClick={handleCreateFolder}>Crear</Button>
              </div>
            </PopoverContent>
          </Popover>
          <FileUpload />
        </div>
      </DrawerContent>
    </Drawer>
  );
}