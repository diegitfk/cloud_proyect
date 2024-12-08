import { Button } from '@/components/ui/button';
import type { Notification } from '@/hooks/useWebSocket';

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onRemove?: (id: string) => void;
  showActions?: boolean;
}

export function NotificationCard({
  notification,
  onMarkAsRead,
  onRemove,
  showActions = false
}: NotificationCardProps) {
  return (
    <div
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
      {showActions && (
        <div className="flex justify-end gap-2 mt-2">
          {!notification.read && onMarkAsRead && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7"
              onClick={() => onMarkAsRead(notification.id)}
            >
              Marcar como leído
            </Button>
          )}
          {onRemove && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7"
              onClick={() => onRemove(notification.id)}
            >
              Eliminar
            </Button>
          )}
        </div>
      )}
    </div>
  );
}