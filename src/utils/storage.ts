/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Booking, AssessmentResult, AppNotification } from '../types';

const BOOKINGS_KEY = 'aethera_salon_appointments';
const ASSESSMENT_KEY = 'aethera_health_result';
const NOTIFICATIONS_KEY = 'aethera_notifications';

export function getLocalBookings(): Booking[] {
  try {
    const data = localStorage.getItem(BOOKINGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('LocalStorage failed for bookings:', err);
    return [];
  }
}

export function saveLocalBooking(booking: Booking): Booking[] {
  try {
    const current = getLocalBookings();
    const updated = [booking, ...current];
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('LocalStorage save failed for booking:', err);
    return [];
  }
}

export function getLocalAssessment(): AssessmentResult | null {
  try {
    const data = localStorage.getItem(ASSESSMENT_KEY);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('LocalStorage failed for health core assessment:', err);
    return null;
  }
}

export function saveLocalAssessment(result: AssessmentResult) {
  try {
    localStorage.setItem(ASSESSMENT_KEY, JSON.stringify(result));
  } catch (err) {
    console.error('LocalStorage save failed for result:', err);
  }
}

export function getLocalNotifications(): AppNotification[] {
  try {
    const data = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!data) {
      // Inject an initial system welcome alert so the box is not bare!
      const initialWelcome: AppNotification = {
        id: 'system-wel',
        type: 'sanctuary_alert',
        title: 'Aethera Welcomes You',
        subject: 'Welcome to your Somatic Space',
        message: 'Your high-fidelity holistic sensory portal is now online. Track your respiration, complete deep diagnostic metrics, and secure targeted organic rituals smoothly.',
        recipientEmail: 'all@aethera.com',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString(),
        isRead: false
      };
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([initialWelcome]));
      return [initialWelcome];
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('LocalStorage failed for notifications list:', err);
    return [];
  }
}

export function saveLocalNotification(notification: AppNotification): AppNotification[] {
  try {
    const current = getLocalNotifications();
    const updated = [notification, ...current];
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('LocalStorage save failed for notification:', err);
    return [];
  }
}

export function markNotificationAsRead(id: string): AppNotification[] {
  try {
    const current = getLocalNotifications();
    const updated = current.map(n => n.id === id ? { ...n, isRead: true } : n);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('LocalStorage read flag update failed:', err);
    return [];
  }
}

export function markAllNotificationsAsRead(): AppNotification[] {
  try {
    const current = getLocalNotifications();
    const updated = current.map(n => ({ ...n, isRead: true }));
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('LocalStorage clear alerts flag failure:', err);
    return [];
  }
}

export function deleteLocalNotification(id: string): AppNotification[] {
  try {
    const current = getLocalNotifications();
    const updated = current.filter(n => n.id !== id);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('LocalStorage notification item deletion failed:', err);
    return [];
  }
}

