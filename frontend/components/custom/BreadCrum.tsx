import React from "react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { LayoutGrid, List } from "lucide-react"
export default function BreadCrum() {
  return (
    <>
      {/* Sección de breadcrum, controla la navegación de recorrido por directorios */}
      <div className="flex w-full items-center gap-4 border-b bg-background p-4 md:px-6 flex-shrink-0">
        <Breadcrumb className="flex-1">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Mi Almacenamiento</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <LayoutGrid className="h-5 w-5" />
            <span className="sr-only">Vista Grid</span>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <List className="h-5 w-5" />
            <span className="sr-only">Vista de Lista</span>
          </Button>
        </div>
      </div>
    </>
  )
}