import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import Image from 'next/image';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import LogoCloudingDrive from "@/public/icons/cloudicon.svg";
import { SearchIcon, BellIcon } from 'lucide-react';
import { ModeToggle } from '@/components/ui/button_mode';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { NotificationBell } from '@/components/custom/NotificationBell';
import { Notification, useWebSocket } from '@/hooks/useWebSocket';
import { Toaster } from 'sonner';
import { NotificationDialog } from './NotificationDialog';
import { read } from 'fs';

export default function NavBarDrive() {
  //Se ajustan aqui callbacks del NotificationBell
  const [notifications , setNotifications] = useState<Notification[]>([]);
  const handleNewNotification = (notification: Notification) => {
    setNotifications(prev => [notification , ...prev]);
  };
  const handleMarkAsRead = (id : string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id
        ? {...notification , read: true}
        : notification
      )
    );
  };
  const handleRemove = (id : string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  }
  const handleClearAll = () => {
    setNotifications([]);
  };

  useWebSocket('ws://localhost:8000/cloud/share/ws/notifications/' , handleNewNotification);
  
  return (
    <>
      <Toaster position="top-center" richColors /> {/* Agrega el Toaster aquí */}
      <nav className="flex w-full ml-auto p-5 select-non items-center gap-4 justify-between border-b-2">
        <div className="flex items-center">
          <SidebarTrigger className="mr-4" />
          <Separator orientation="vertical" className="mr-3 h-4" />
          <Link href="#" className="mr-6 flex items-center gap-2" prefetch={false}>
            <LogoCloudingDrive width={38} height={38} />
            <span className="text-lg font-semibold">CloudingDrive</span>
          </Link>
        </div>
        <div className='flex items-center gap-4'>
          <ModeToggle />
          <Button variant="ghost" size="icon" className="rounded-full">
            <SearchIcon className="h-5 w-5" />
            <span className="sr-only">Buscar</span>
          </Button>
          <NotificationBell
            notifications={notifications}
            onClearAll={handleClearAll}
            onMarkAsRead={handleMarkAsRead}
            onRemove={handleRemove}
          />
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
              <DropdownMenuLabel>Sesión iniciada como </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Tu drive</DropdownMenuItem>
              <DropdownMenuItem>Compartido conmigo</DropdownMenuItem>
              <DropdownMenuItem>Favoritos</DropdownMenuItem>
              <DropdownMenuItem>Papelera</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Configuraciones</DropdownMenuItem>
              <DropdownMenuItem>Ayuda</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='text-red-500 hover:bg-red-500 hover:text-white'>Cerrar sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </>
  );
}
