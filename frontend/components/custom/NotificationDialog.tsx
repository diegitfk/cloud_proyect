import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePendingShares } from '@/hooks/usePendingShares';
import { Check, Folder, File, X } from 'lucide-react';

interface NotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationDialog({ 
  open, 
  onOpenChange,
}: NotificationDialogProps) {
  const { 
    pendingShares, 
    isLoading, 
    isError,
    handleAccept,
    handleReject 
  } = usePendingShares();

  if (isError) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="text-center text-red-500">
            Error al cargar las solicitudes
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Solicitudes de recursos compartidos</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] mt-4">
          {isLoading ? (
            <div className="text-center py-2">Cargando solicitudes...</div>
          ) : pendingShares.length === 0 ? (
            <div className="text-center py-2 text-muted-foreground">
              No tienes solicitudes pendientes
            </div>
          ) : (
            <div className="space-y-4">
              {pendingShares.map((share) => (
                <div key={share._id} className="p-4 rounded-lg border bg-card">
                  <div className="flex items-start gap-3">
                    {share.type === 'folder' ? (
                      <Folder className="h-5 w-5 text-blue-500 mt-1" />
                    ) : (
                      <File className="h-5 w-5 text-gray-500 mt-1" />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{share.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            De: {share.emisor.nombre} ({share.emisor.username})
                          </p>
                        </div>
                        {share.space > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {share.space}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-end gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(share._id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Rechazar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAccept(share._id)}
                          className="text-green-500 hover:text-green-600"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Aceptar
                        </Button>
                      </div>
                    </div>
                  </div>
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