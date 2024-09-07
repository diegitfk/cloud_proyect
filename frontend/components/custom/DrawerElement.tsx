import React, { ReactNode } from 'react'
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { FolderIcon, UploadIcon } from "lucide-react"

type DrawerElementProps = {
  children: ReactNode;
};

export default function DrawerElement({ children }: DrawerElementProps) {
  return (
    <>
      <Drawer>
        {/* Botón para escritorio y móviles */}
        <DrawerTrigger asChild>
          {children}
        </DrawerTrigger>
        <DrawerContent className='items-center h-3/5 md:h-2/5 md:w-2/4 md:mx-auto'>
          <DrawerHeader>
            <DrawerTitle className='text-center text-2xl mt-3'>Agregar un nuevo elemento</DrawerTitle>
            <DrawerDescription className='text-center'>Puede crear una nueva carpeta o subir nuevos elementos.</DrawerDescription>
          </DrawerHeader>
          <div className="space-y-4 p-4">
            <Button variant="outline" className="w-full mb-5">
              <FolderIcon className="mr-2 h-4 w-4" />
              Nueva Carpeta
            </Button>
            <div>
              <div>
                <div className="flex flex-col items-center justify-center gap-2 border-dashed border-2 p-5 rounded-lg">
                  <UploadIcon className="h-8 w-8" />
                  <div className="text-sm font-medium">Arrastre y suelte los archivos aquí o haga clic para cargar</div>
                </div>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}