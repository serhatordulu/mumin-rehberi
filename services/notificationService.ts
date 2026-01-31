
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export const NotificationService = {
  
  // İzin İsteme
  async requestPermissions(): Promise<boolean> {
    if (Capacitor.isNativePlatform()) {
      const result = await LocalNotifications.requestPermissions();
      return result.display === 'granted';
    } else {
      // Web Fallback
      if (!("Notification" in window)) return false;
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
  },

  // Bildirim Planlama (Schedule)
  async schedule(id: number, title: string, body: string, scheduleDate: Date) {
    if (Capacitor.isNativePlatform()) {
      try {
        await LocalNotifications.schedule({
          notifications: [
            {
              title,
              body,
              id,
              schedule: { at: scheduleDate },
              sound: 'azan.mp3', 
              actionTypeId: "",
              extra: null
            }
          ]
        });
        return true;
      } catch (e) {
        console.error("Native bildirim hatası:", e);
        return false;
      }
    } else {
      const now = new Date().getTime();
      const target = scheduleDate.getTime();
      const delay = target - now;

      if (delay > 0 && delay < 2147483647) { 
        setTimeout(() => {
           this.sendWebNotification(title, body);
        }, delay);
        return true;
      }
      return false;
    }
  },

  // Planlanmış Bildirimi İptal Etme
  async cancel(id: number) {
    if (Capacitor.isNativePlatform()) {
      await LocalNotifications.cancel({ notifications: [{ id }] });
    }
  },

  // Anlık Web Bildirimi
  sendWebNotification(title: string, body: string) {
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") {
       new Notification(title, { body, icon: '/icon.png' });
    }
  }
};
