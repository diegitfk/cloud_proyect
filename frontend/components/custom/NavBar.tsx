import React from 'react';
import { Button } from "@/components/ui/button"
import Image from 'next/image';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import LogoCloudingDrive from "@/public/icons/cloudicon.svg";
import SearchIcon from '@/public/icons/searchicon.svg';
import LayoutGridIcon from '@/public/icons/layoutgridicon.svg';
import BellIcon from '@/public/icons/bellicon.svg';

export default function NavBar() {
  return (
    <>
      <Link href="#" className="mr-6 flex items-center gap-2" prefetch={false}>
        <LogoCloudingDrive width={38} height={38} />
        <span className="text-lg font-semibold">CloudingDrive</span>
      </Link>
      <nav className="ml-auto flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <SearchIcon className="h-5 w-5" />
          <span className="sr-only">Buscar</span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <LayoutGridIcon className="h-5 w-5" />
          <span className="sr-only">Apps</span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <BellIcon className="h-5 w-5" />
          <span className="sr-only">Notificaciones</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Image src="icons/placeholder.svg"
                width={32}
                height={32}
                alt="Avatar"
                className="rounded-full"
                style={{ aspectRatio: "32/32", objectFit: "cover" }}>
              </Image>
              <span className="sr-only">Menú de Usuario</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Sesión iniciada como</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Tu drive</DropdownMenuItem>
            <DropdownMenuItem>Compartido conmigo</DropdownMenuItem>
            <DropdownMenuItem>Favoritos</DropdownMenuItem>
            <DropdownMenuItem>Papelera</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Configuraciones</DropdownMenuItem>
            <DropdownMenuItem>Ayuda</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </>
  );
}
