'use client'
import React from 'react'
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import CardsDrive from "@/components/custom/CardsDrive"
import DrawerElement from "@/components/custom/DrawerElement"
import BreadCrum from "@/components/custom/BreadCrum"
import useDriveStore from '@/states/useDriveState'

type DriveItem = {
  id: string;
  name: string;
  type: "folder" | "file";
  createdAt: string;
  icon: string;
};

export default function PageDrive() {
  const { newFolderName, setNewFolderName, addItem } = useDriveStore();

  const handleCreateFolder = () => {
    if (newFolderName.trim() !== "") {
      const newFolder: DriveItem = {
        id: Date.now().toString(), // Genera un ID único
        name: newFolderName,
        type: "folder", // Asegúrate de que el tipo sea "folder" o "file"
        createdAt: new Date().toLocaleDateString(),
        icon: "/icons/foldericon.svg"
      };
      addItem(newFolder);
      setNewFolderName(''); // Limpia el input después de crear la carpeta
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <BreadCrum />
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <CardsDrive />
          </div>
        </div>
      </div>
      <DrawerElement
        newFolderName={newFolderName}
        setNewFolderName={setNewFolderName}
        handleCreateFolder={handleCreateFolder}
      >
        <Button variant="outline" className="fixed text-white bottom-4 right-4 z-10 md:hidden bg-[#59B47D]">
          <PlusIcon className="mr-2 h-4 w-4" />
          Nuevo
        </Button>
      </DrawerElement>
    </div>
  );
}