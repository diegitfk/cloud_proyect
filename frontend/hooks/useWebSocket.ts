'use client';

import { useEffect, useRef} from 'react';
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

  const handleTransferAccepted = async (data : any) => {
    try{
      const response = await fetch(
        `/api/share_resource?idPending=${data.id_pending}` , 
        {
          method : 'PUT',
        });
      console.log(await response.json());

    }catch (error){
      console.error('Error processing transfer:', error);
      toast.error('Transfer processing failed', {
        description: 'Could not complete the transfer process',
      });
    }
  }

  const showToastByEventType = (notification: Notification) => {
    switch (notification.eventType) {
      case 'Transferencia Aceptada':
        toast.success(notification.from, {
          description: notification.to,
          duration: 5000,
        });
        break;
      case 'Transferencia Rechazada':
        toast.error(notification.from, {
          description: notification.to,
          duration: 5000,
        });
        break;
      case 'Transferencia de Recursos':
        toast.info(notification.from, {
            description: notification.to,
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

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      toast.success('Connected to notification service');
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(data);

        if (data.event === "Transferencia Aceptada"){
          handleTransferAccepted(data);
        }
        
        //Interface de la notificación
        const notification: Notification = {
          id : uuidv4(),
          eventType : data.event,
          from : data.from,
          to : data.to,
          timestamp: new Date(),
          read : false,
        };     
        console.log(notification);   
        // Show toast
        showToastByEventType(notification);
        onNotification?.(notification);
      } catch (error) {
        console.error('Error parsing notification:', error);
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast.error('Connection Error', {
        description: 'Failed to connect to notification service',
      });
    };

    ws.current.onclose = () => {
      toast.warning('Disconnected', {
        description: 'Lost connection to notification service',
      });
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url]);

  return { ws: ws.current};
};