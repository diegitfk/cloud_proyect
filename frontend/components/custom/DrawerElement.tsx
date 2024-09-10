'use client'
import React, { ReactNode } from 'react'
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { FolderIcon, UploadIcon } from "lucide-react"

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
      <DrawerContent className='items-center h-3/5 md:h-3/6 md:w-2/4 md:mx-auto lg:2/5'>
        <DrawerHeader>
          <DrawerTitle className='text-center text-2xl mt-3'>Agregar un nuevo elemento</DrawerTitle>
          <DrawerDescription className='text-center'>Puede crear una nueva carpeta o subir nuevos elementos.</DrawerDescription>
        </DrawerHeader>
        <div className="space-y-4 p-4">
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
          <div>
            <div className="flex flex-col items-center justify-center gap-2 border-dashed border-2 p-5 rounded-lg">
              <UploadIcon className="h-8 w-8" />
              <div className="text-sm font-medium">Arrastre y suelte los archivos aquí o haga clic para cargar</div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}