'use client'
import React from "react";
import { usePathname } from "next/navigation";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { LayoutGrid } from "lucide-react"

export default function BreadCrum() {
  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);

  // Eliminar 'drive' del inicio si está presente
  if (paths[0] === 'drive') {
    paths.shift();
  }

  return (
    <div className="flex w-full items-center gap-4 border-b bg-background p-2 md:px-6 flex-shrink-0">
      <Breadcrumb className="flex-1">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/drive">Mi almacenamiento</BreadcrumbLink>
          </BreadcrumbItem>
          {paths.map((path, index) => {
            const href = `/drive/${paths.slice(0, index + 1).join('/')}`;
            return (
              <React.Fragment key={path}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {index === paths.length - 1 ? (
                    <BreadcrumbPage>{decodeURIComponent(path)}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={href}>{decodeURIComponent(path)}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full">
          <LayoutGrid className="h-5 w-5" />
          <span className="sr-only">Vista Grid</span>
        </Button>
      </div>
    </div>
  )
}