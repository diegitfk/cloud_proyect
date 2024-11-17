'use client'
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import NavBarDrive from "@/components/custom/NavBarDrive";
import PageDrive from "./[[...path]]/page";
import PageShared from "./shared/page";
import PageTrash from "./trash/page";
import SideBar from "@/components/custom/SideBar";
import useDriveState from '@/states/useDriveState';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LayoutDrive() {
  const [activeView, setActiveView] = useState("mi-almacenamiento");
  const router = useRouter();

  useEffect(() => {
    // COMPROBACION DE SI HAY INICIO DE SESION
    console.log(document.cookie)
    const token = document.cookie.split('; ').find(row => row.startsWith('session_jwt='));
    
    // EN CASO DE NO EXISTIR TOKEN, REDIRIGIR 
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <SidebarProvider>
      <main className="flex h-screen w-full">
        <SideBar 
          setActiveView={setActiveView}
        />
        <SidebarInset className="flex flex-col flex-grow">
          <NavBarDrive />
          {activeView === "mi-almacenamiento" && <PageDrive />}
          {activeView === "compartidos-conmigo" && <PageShared />}
          {activeView === "papelera" && <PageTrash />}
        </SidebarInset>
      </main>
    </SidebarProvider>
  );
}
