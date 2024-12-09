'use client';

import { useEffect, useRef, useState} from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';


export interface Notification{
    id : string,
    eventType : string,
    from : string ,
    to : string,
    timestamp : Date,
    read: boolean;

}

export const useWebSocket = (url: string , onNotification? : (notification: Notification) => void) => {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected , setIsConnected] = useState(false);
  const reconnectTimeout = useRef<NodeJS.Timeout>();
  const maxReconnectAttempts = 5;
  const reconnectAttempts = useRef(0);

  const handleTransferAccepted = async (data : any) => {
    try{
      const response = await fetch(
        `/api/share_resource?idPending=${data.id_pending}` , 
        {
          method : 'PUT',
        });

        if (!response.ok) {
          throw new Error('Proceso de transferencia fallido');
        }
  
        const result = await response.json();
        toast.success('Transferencia procesada exitosamente', {
          description: result.message,
        });

    }catch (error){
      console.error('Error de transferencia:', error);
      toast.error('Proceso de transferencia fallido', {
        description: 'No se pudo completar el proceso de transferencia',
      });
    }
  }

  const showToastByEventType = (notification: Notification) => {
    switch (notification.eventType) {
      case 'Transferencia Aceptada':
        toast.success(notification.from, {
          description: notification.eventType,
          duration: 5000,
        });
        break;
      case 'Transferencia Rechazada':
        toast.error(notification.from, {
          description: notification.eventType,
          duration: 5000,
        });
        break;
      case 'Transferencia de Recursos':
        toast.info(notification.from, {
            description: notification.eventType,
            duration: 5000,
        });
        break;
      default:
        toast.info(notification.from, {
          description: notification.to,
          duration: 5000,
        });
    }
  };
  const connect = () => {
    try {
      if (ws.current && (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING)){
        return ;
      }
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        setIsConnected(true);
        reconnectAttempts.current = 0;
        if (!isConnected) {
          toast.success('Servicio de notificaciones activado');
        }
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.event === 'Transferencia Aceptada') {
            handleTransferAccepted(data);
          }

          const notification: Notification = {
            id: uuidv4(),
            eventType: data.event,
            from: data.from,
            to: data.to,
            timestamp: new Date(),
            read: false,
          };
          
          showToastByEventType(notification);
          onNotification?.(notification);
        } catch (error) {
          console.error('Error mensaje recibido:', error);
        }
      };

      ws.current.onerror = (error) => {
        setIsConnected(false);
      };

      ws.current.onclose = () => {
        setIsConnected(false);
        if (reconnectAttempts.current < maxReconnectAttempts) {
          const timeoutDuration = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
          reconnectTimeout.current = setTimeout(() => {
            reconnectAttempts.current += 1;
            connect();
          }, timeoutDuration);
        } else {
          toast.error('Conexión fallida', {
            description: 'Incapaz de conectarse con el servicio de notificaciones',
          });
        }
      };
    } catch (error) {
      console.error('Error de conexión:', error);
      setIsConnected(false);
    }
  };
  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url]);

  return { 
    ws: ws.current,
    isConnected 
  };
};