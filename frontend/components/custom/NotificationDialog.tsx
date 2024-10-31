import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Notification } from '@/hooks/useWebSocket';

interface NotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notifications: Notification[];
}

export function NotificationDialog({ 
  open, 
  onOpenChange,
  notifications 
}: NotificationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Solicitudes de transferencia de recursos</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] mt-4">
          {notifications.length === 0 ? (
            <div className="text-center py-2 text-muted-foreground">
              No tienes notificaciones
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="p-3 rounded-lg bg-muted">
                  <div className="flex justify-between">
                    <span className="font-medium">{notification.eventType}</span>
                    <span className="text-xs text-muted-foreground">
                      {notification.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.from}</p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="flex justify-end mt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}