// Native Web Notifications & Haptic Alarm Service for Career OS PWA

class NotificationService {
  private permission: NotificationPermission = 'default';

  constructor() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  public getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  public isGranted(): boolean {
    return this.getPermission() === 'granted';
  }

  public async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) return false;
    try {
      const result = await Notification.requestPermission();
      this.permission = result;
      return result === 'granted';
    } catch (e) {
      console.warn('Notification permission error:', e);
      return false;
    }
  }

  public async sendNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (!this.isSupported() || Notification.permission !== 'granted') return;

    // Trigger haptic vibration on mobile devices (e.g. Moto G 35)
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([250, 120, 250]);
      } catch (e) {
        // Vibration blocked or unsupported
      }
    }

    // Try service worker notification first (supports backgrounding in PWAs)
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg && reg.showNotification) {
          await reg.showNotification(title, {
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            ...options,
          });
          return;
        }
      } catch (e) {
        // Fall back to standard Notification constructor
      }
    }

    // Standard Notification constructor fallback
    try {
      new Notification(title, {
        icon: '/icon-192.png',
        ...options,
      });
    } catch (e) {
      console.warn('Failed to display native notification:', e);
    }
  }

  public sendFocusCompleteNotification(mode: '90_WORK' | '20_BREAK' | '25_POMO'): void {
    if (mode === '90_WORK') {
      this.sendNotification('🎯 90-Minute Ultradian Deep Work Complete!', {
        body: 'Prefrontal cognitive cycle achieved. Step away from all screens for a 20-minute rest.',
        tag: 'career-os-focus',
      });
    } else if (mode === '20_BREAK') {
      this.sendNotification('☕ 20-Minute Recovery Rest Complete', {
        body: 'Neural consolidation finished. Ready for your next deep work session!',
        tag: 'career-os-break',
      });
    } else {
      this.sendNotification('⚡ 25-Minute Sprint Complete', {
        body: 'Algorithmic focus block complete. Take a quick 5-minute break.',
        tag: 'career-os-pomo',
      });
    }
  }
}

export const notificationService = new NotificationService();
