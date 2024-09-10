import NavBar from "@/components/custom/NavBar"
import PageDrive from "./page";

export default function LayoutDrive() {
  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center border-b bg-background px-4 md:px-6">
        <NavBar />
      </header>
      <div className="flex flex-1">
        <div className="flex-1">
          {/* Contenido de la página drive  -- Manejar el cambio de vista */}
          <PageDrive />
        </div>
      </div>
    </>
  );
}