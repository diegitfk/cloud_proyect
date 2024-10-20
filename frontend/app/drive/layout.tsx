import NavBar from "@/components/custom/NavBar"
import PageDrive from "./page";

export default function LayoutDrive() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="flex h-16 shrink-0 items-center border-b bg-background px-4 md:px-6">
        <NavBar />
      </header>
      <div className="flex-1 overflow-hidden">
        <PageDrive />
      </div>
    </div>
  );
}