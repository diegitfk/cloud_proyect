'use client';

import { useWebSocket } from '@/hooks/useWebSocket';
import { NotificationBell } from '@/components/custom/Notification';
import { useState } from 'react';
import type { Notification } from '@/hooks/useWebSocket';

export default function Home() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const handleNewNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleRemove = (id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  useWebSocket('ws://localhost:8000/cloud/share/ws/notifications/', handleNewNotification);

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <NotificationBell 
          notifications={notifications}
          onClearAll={handleClearAll}
          onMarkAsRead={handleMarkAsRead}
          onRemove={handleRemove}
        />
      </div>
      <p className="text-muted-foreground">
        WebSocket connection is established and ready to receive notifications.
      </p>
    </div>
  );
}