// /**
//  * Pinia store for notifications management
//  * Handles real-time notifications using Laravel Echo and Pusher
//  */

// import { defineStore } from "pinia";
// import { ref, computed } from "vue";
// import { useEchoService } from "@/services/echo";
// import { useAuthStore } from "./auth";
// import { useToastStore } from "./toast";

// export const useNotificationStore = defineStore("notifications", () => {
//   // State
//   const notifications = ref([]);
//   const isLoading = ref(false);
//   const isConnected = ref(false);
//   const echo = ref(null);

//   // Getters
//   const unreadCount = computed(
//     () =>
//       notifications.value.filter((notification) => !notification.read).length
//   );

//   const recentNotifications = computed(() => notifications.value.slice(0, 5));

//   /**
//    * Initialize Echo service and listen for real-time events
//    */
//   const initialize = async () => {
//     const authStore = useAuthStore();

//     if (!authStore.isAuthenticated) {
//       console.warn("Cannot initialize notifications without authentication");
//       return;
//     }

//     try {
//       // Initialize Echo service
//       echo.value = useEchoService();
//       isConnected.value = true;

//       // Listen for task creation notifications
//       echo.value
//         .private(`user.${authStore.user.id}`)
//         .listen("TaskCreated", (event) => {
//           console.log("Task created event received:", event);

//           addNotification({
//             id: event.notification.id,
//             type: "task_created",
//             title: "Task Created Successfully",
//             message: `Your task "${event.task.title}" has been created.`,
//             task_id: event.task.id,
//             read: false,
//             created_at: new Date().toISOString(),
//           });

//           // Show toast notification
//           const toastStore = useToastStore();
//           toastStore.addToast({
//             type: "success",
//             title: "New Task Created",
//             message: `Task "${event.task.title}" has been created successfully.`,
//           });
//         });

//       // Listen for other notification types
//       echo.value
//         .private(`user.${authStore.user.id}`)
//         .listen("NotificationSent", (event) => {
//           console.log("General notification received:", event);

//           addNotification({
//             id: event.notification.id,
//             type: event.notification.type,
//             title: event.notification.title,
//             message: event.notification.message,
//             data: event.notification.data,
//             read: false,
//             created_at: event.notification.created_at,
//           });
//         });

//       // Listen for connection status
//       echo.value.connector.pusher.connection.bind("connected", () => {
//         console.log("Echo connected successfully");
//         isConnected.value = true;
//       });

//       echo.value.connector.pusher.connection.bind("disconnected", () => {
//         console.log("Echo disconnected");
//         isConnected.value = false;
//       });

//       echo.value.connector.pusher.connection.bind("error", (error) => {
//         console.error("Echo connection error:", error);
//         isConnected.value = false;
//       });

//       // Fetch existing notifications
//       await fetchNotifications();
//     } catch (error) {
//       console.error("Error initializing notifications:", error);
//       isConnected.value = false;
//     }
//   };

//   /**
//    * Fetch notifications from API
//    */
//   const fetchNotifications = async () => {
//     isLoading.value = true;

//     try {
//       const response = await apiClient.get("/notifications");

//       if (response.data.success) {
//         notifications.value = response.data.notifications;
//       }
//     } catch (error) {
//       console.error("Fetch notifications error:", error);

//       const toastStore = useToastStore();
//       toastStore.addToast({
//         type: "error",
//         title: "Failed to Load Notifications",
//         message: "Could not load your notifications. Please try again.",
//       });
//     } finally {
//       isLoading.value = false;
//     }
//   };

//   /**
//    * Add a new notification to the store
//    * @param {object} notification - Notification data
//    */
//   const addNotification = (notification) => {
//     // Check if notification already exists
//     const exists = notifications.value.find((n) => n.id === notification.id);
//     if (exists) {
//       return;
//     }

//     // Add to beginning of array (most recent first)
//     notifications.value.unshift({
//       ...notification,
//       created_at: notification.created_at || new Date().toISOString(),
//     });

//     // Keep only latest 100 notifications
//     if (notifications.value.length > 100) {
//       notifications.value = notifications.value.slice(0, 100);
//     }
//   };

//   /**
//    * Mark a notification as read
//    * @param {number} notificationId - Notification ID
//    */
//   const markAsRead = async (notificationId) => {
//     try {
//       const response = await apiClient.patch(
//         `/notifications/${notificationId}/read`
//       );

//       if (response.data.success) {
//         // Update local state
//         const notification = notifications.value.find(
//           (n) => n.id === notificationId
//         );
//         if (notification) {
//           notification.read = true;
//           notification.read_at = new Date().toISOString();
//         }
//       }
//     } catch (error) {
//       console.error("Mark notification as read error:", error);
//     }
//   };

//   /**
//    * Mark all notifications as read
//    */
//   const markAllAsRead = async () => {
//     try {
//       const response = await apiClient.patch("/notifications/mark-all-read");

//       if (response.data.success) {
//         // Update local state
//         notifications.value.forEach((notification) => {
//           notification.read = true;
//           notification.read_at = new Date().toISOString();
//         });

//         const toastStore = useToastStore();
//         toastStore.addToast({
//           type: "success",
//           title: "All Notifications Read",
//           message: "All notifications have been marked as read.",
//         });
//       }
//     } catch (error) {
//       console.error("Mark all notifications as read error:", error);

//       const toastStore = useToastStore();
//       toastStore.addToast({
//         type: "error",
//         title: "Update Failed",
//         message: "Could not mark notifications as read. Please try again.",
//       });
//     }
//   };

//   /**
//    * Delete a notification
//    * @param {number} notificationId - Notification ID
//    */
//   const deleteNotification = async (notificationId) => {
//     try {
//       const response = await apiClient.delete(
//         `/notifications/${notificationId}`
//       );

//       if (response.data.success) {
//         // Remove from local state
//         notifications.value = notifications.value.filter(
//           (n) => n.id !== notificationId
//         );
//       }
//     } catch (error) {
//       console.error("Delete notification error:", error);

//       const toastStore = useToastStore();
//       toastStore.addToast({
//         type: "error",
//         title: "Delete Failed",
//         message: "Could not delete notification. Please try again.",
//       });
//     }
//   };

//   /**
//    * Clear all notifications
//    */
//   const clearAllNotifications = async () => {
//     try {
//       const response = await apiClient.delete("/notifications");

//       if (response.data.success) {
//         notifications.value = [];

//         const toastStore = useToastStore();
//         toastStore.addToast({
//           type: "success",
//           title: "Notifications Cleared",
//           message: "All notifications have been cleared.",
//         });
//       }
//     } catch (error) {
//       console.error("Clear notifications error:", error);

//       const toastStore = useToastStore();
//       toastStore.addToast({
//         type: "error",
//         title: "Clear Failed",
//         message: "Could not clear notifications. Please try again.",
//       });
//     }
//   };

//   /**
//    * Get notification by ID
//    * @param {number} notificationId - Notification ID
//    */
//   const getNotification = (notificationId) => {
//     return notifications.value.find((n) => n.id === notificationId);
//   };

//   /**
//    * Filter notifications by type
//    * @param {string} type - Notification type
//    */
//   const getNotificationsByType = (type) => {
//     return notifications.value.filter((n) => n.type === type);
//   };

//   /**
//    * Disconnect Echo service
//    */
//   const disconnect = () => {
//     if (echo.value) {
//       echo.value.disconnect();
//       echo.value = null;
//       isConnected.value = false;
//     }
//   };

//   /**
//    * Clear all notifications data (used on logout)
//    */
//   const clearNotifications = () => {
//     notifications.value = [];
//     disconnect();
//   };

//   /**
//    * Reconnect to Echo service
//    */
//   const reconnect = async () => {
//     disconnect();
//     await initialize();
//   };

//   return {
//     // State
//     notifications,
//     isLoading,
//     isConnected,

//     // Getters
//     unreadCount,
//     recentNotifications,

//     // Actions
//     initialize,
//     fetchNotifications,
//     addNotification,
//     markAsRead,
//     markAllAsRead,
//     deleteNotification,
//     clearAllNotifications,
//     getNotification,
//     getNotificationsByType,
//     disconnect,
//     clearNotifications,
//     reconnect,
//   };
// });
