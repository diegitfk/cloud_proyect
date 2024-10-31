'use client';

import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ScrollArea } from '@/components/ui/scroll-area';
import type { Notification } from '@/hooks/useWebSocket';
import { NotificationDialog } from './NotificationDialog';
import { useState } from 'react';

interface NotificationBellProps {
    notifications: Notification[];
    onClearAll: () => void;
    onMarkAsRead: (id: string) => void;
    onRemove: (id: string) => void;
  }
  
  export function NotificationBell({ 
    notifications,
    onClearAll,
    onMarkAsRead,
    onRemove,
  }: NotificationBellProps) {
    const unreadCount = notifications.filter(n => !n.read).length;
    const [dialogOpen , setDialogOpen] = useState(false);
  
    return (
      <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="flex justify-between items-center p-4 border-b">
            <span className="font-semibold">Notificaciones</span>
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="text-xs"
              >
                Clear all
              </Button>
            )}
          </div>
          <ScrollArea className="h-[300px]">
            <div className="p-4">
              {notifications.length === 0 ? (
                <div className="text-center py-2 text-muted-foreground">
                  No has recibido notificaciones
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex flex-col gap-1 p-3 rounded-lg transition-colors ${
                        notification.read ? 'bg-background' : 'bg-muted'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{notification.eventType}</span>
                        <span className="text-xs text-muted-foreground">
                          {notification.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.from}
                      </p>
                      <div className="flex justify-end gap-2 mt-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-7"
                            onClick={() => onMarkAsRead(notification.id)}
                          >
                            Marcar como leido
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => onRemove(notification.id)}
                        >
                          eliminar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
          <Button 
          variant='ghost'
          size="sm"
          className='w-full flex justify-center mt-4'
          onClick={() => setDialogOpen(true)}
          >Administrar solicitudes de transferencia</Button>
        </DropdownMenuContent>
      </DropdownMenu>
      <NotificationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        notifications={notifications}
      />
    </>
    );
  }