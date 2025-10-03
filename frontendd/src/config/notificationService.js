
const NOTIFICATION_STORAGE_KEY = 'notifications';

export const getNotifications = () => {
  try {
    const notifications = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    return notifications ? JSON.parse(notifications) : [];
  } catch (error) {
    console.error('Error reading notifications:', error);
    return [];
  }
};

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

export const clearNotifications = () => {
  try {
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify([]));
    return [];
  } catch (error) {
    console.error('Error clearing notifications:', error);
    return [];
  }
};

export const getUnreadCount = () => {
  try {
    const notifications = getNotifications();
    return notifications.filter(n => !n.read).length;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
};