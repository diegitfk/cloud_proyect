import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import NavBar from "@/components/custom/NavBar"
import PageDrive from "./page";

export default function LayoutDrive() {
  return (
    <SidebarProvider>
      <main className="flex-1 overflow-hidden">
        <SidebarTrigger />
        <div className="flex flex-col h-screen overflow-hidden">
          <header className="flex h-16 shrink-0 items-center border-b bg-background px-4 md:px-6">
            <NavBar />
          </header>
          <div className="flex-1 overflow-hidden">
            <PageDrive />
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}