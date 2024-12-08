'use client'
import React from 'react'
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from '@radix-ui/react-dropdown-menu'
import CardsDrive from "@/components/custom/CardsDrive"
import DrawerElement from "@/components/custom/DrawerElement"
import BreadCrum from "@/components/custom/BreadCrum"

export default function PageTrash() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="p-4 md:px-6 border-b">
        <div className="flex items-center space-x-2">
          {/* Ícono */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" strokeWidth="2">
            <path d="M4 7l16 0"></path>
            <path d="M10 11l0 6"></path>
            <path d="M14 11l0 6"></path>
            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
          </svg>
          {/* Título */}
          <h1 className="text-xl font-semibold">
            Papelera
          </h1>
        </div>
        {/* Descripción */}
        <p className="text-sm text-gray-500">
          Aquí puedes navegar por el contenido que no te es util
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <CardsDrive onTrash={true} />
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