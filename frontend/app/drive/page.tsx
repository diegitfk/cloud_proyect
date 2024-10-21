'use client'
import React, { useState } from 'react'
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import CardsDrive from "@/components/custom/CardsDrive"
import DrawerElement from "@/components/custom/DrawerElement"
import SideBar from "@/components/custom/SideBar"
import BreadCrum from "@/components/custom/BreadCrum"

type DriveItem = {
  id: string;
  name: string;
  type: "folder" | "file";
  createdAt: string;
  icon: string;
};

const initialItems: DriveItem[] = [
  {
    id: "1",
    name: "Documentos",
    type: "folder",
    createdAt: "02/09/2024",
    icon: "/icons/foldericon.svg"
  },
  {
    id: "2",
    name: "Imágenes",
    type: "folder",
    createdAt: "03/09/2024",
    icon: "/icons/foldericon.svg"
  },
  {
    id: "3",
    name: "Música",
    type: "folder",
    createdAt: "03/09/2024",
    icon: "/icons/foldericon.svg"
  },
  {
    id: "4",
    name: "Videos",
    type: "folder",
    createdAt: "03/09/2024",
    icon: "/icons/foldericon.svg"
  }
];

export default function PageDrive() {
  const [items, setItems] = useState<DriveItem[]>(initialItems);
  const [newFolderName, setNewFolderName] = useState('');
  const [, setIsNewFolderOpen] = useState(false)

  const addItem = (item: DriveItem) => {
    setItems([...items, item]);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim() !== "") {
      const newFolder: DriveItem = {
        id: Date.now().toString(), // Genera un ID único
        name: newFolderName,
        type: "folder",
        createdAt: new Date().toLocaleDateString(),
        icon: "/icons/foldericon.svg"
      };
      addItem(newFolder);
      setNewFolderName(''); // Limpia el input después de crear la carpeta
      setIsNewFolderOpen(false)
    }
  };
  return (
    <>
      <div className="flex flex-1">
        <SideBar
          newFolderName={newFolderName}
          setNewFolderName={setNewFolderName}
          handleCreateFolder={handleCreateFolder}
        />
        
        <div className="flex flex-col flex-1">
          <BreadCrum />
          <div className="flex-1 overflow-auto p-4 md:px-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <CardsDrive items={items} onAddItem={addItem} />
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
    </>
  )
}