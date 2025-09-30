// Notification service to handle notifications across the app
const NOTIFICATION_STORAGE_KEY = 'notifications';

// Get all notifications from localStorage
export const getNotifications = () => {
  try {
    const notifications = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    return notifications ? JSON.parse(notifications) : [];
  } catch (error) {
    console.error('Error reading notifications:', error);
    return [];
  }
};

// Add a new notification
export const addNotification = (notification) => {
  try {
    const notifications = getNotifications();
    const newNotification = {
      ...notification,
      id: Date.now(),
      date: new Date().toISOString(),
      read: false,
    };
    
    const updatedNotifications = [newNotification, ...notifications];
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(updatedNotifications));
    
    return updatedNotifications;
  } catch (error) {
    console.error('Error adding notification:', error);
    return [];
  }
};

// Mark a notification as read
export const markNotificationAsRead = (notificationId) => {
  try {
    const notifications = getNotifications();
    const updatedNotifications = notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    );
    
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(updatedNotifications));
    return updatedNotifications;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return [];
  }
};

// Clear all notifications
export const clearNotifications = () => {
  try {
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify([]));
    return [];
  } catch (error) {
    console.error('Error clearing notifications:', error);
    return [];
  }
};

// Get unread notification count
export const getUnreadCount = () => {
  try {
    const notifications = getNotifications();
    return notifications.filter(n => !n.read).length;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
};