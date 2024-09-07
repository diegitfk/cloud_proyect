import NavBar from "@/components/custom/NavBar"
import PageDrive from "./page";
import SideBar from "@/components/custom/SideBar";
import BreadCrum from "@/components/custom/BreadCrum";

export default function LayoutDrive() {
  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center border-b bg-background px-4 md:px-6">
        <NavBar />
      </header>
      <div className="flex flex-1">
        <SideBar />
        <div className="flex flex-col flex-1">
            {/* Componente de navegación */}
            <BreadCrum />
          <div className="flex-1">
            {/* Contenido de la página drive  -- Manejar el cambio de vista */}
            <PageDrive />
          </div>
        </div>
      </div>
    </>
  );
}