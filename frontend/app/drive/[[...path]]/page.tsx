'use client'
import React from 'react'
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import CardsDrive from "@/components/custom/CardsDrive"
import DrawerElement from "@/components/custom/DrawerElement"
import BreadCrum from "@/components/custom/BreadCrum"

export default function PageDrive() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <BreadCrum />
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <CardsDrive onTrash={false} />
          </div>
        </div>
      </div>
      <DrawerElement>
        <Button variant="outline" className="fixed text-white bottom-4 right-4 z-10 md:hidden bg-[#59B47D]">
          <PlusIcon className="mr-2 h-4 w-4" />
          Nuevo
        </Button>
      </DrawerElement>
    </div>
  );
}