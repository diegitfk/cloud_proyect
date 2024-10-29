'use client'
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import NavBarDrive from "@/components/custom/NavBar";
import PageDrive from "./page";
import SideBar from "@/components/custom/SideBar";
import useDriveStore from '@/states/useDriveState';

export default function LayoutDrive() {
  const { newFolderName, setNewFolderName, handleCreateFolder } = useDriveStore();

  return (
    <SidebarProvider>
      <main className="flex h-screen w-full">
        <SideBar 
          newFolderName={newFolderName}
          setNewFolderName={setNewFolderName}
          handleCreateFolder={handleCreateFolder}
        />
        <SidebarInset className="flex flex-col flex-grow">
          <NavBarDrive />
          <PageDrive />
        </SidebarInset>
      </main>
    </SidebarProvider>
  );
}