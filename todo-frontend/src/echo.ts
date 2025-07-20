import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { useTaskStore } from "./stores/tasks";
import type { TaskCreatedNotification, User } from "./types";

// On rend Pusher disponible globalement pour Echo
declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}
window.Pusher = Pusher;

let echoInstance: Echo<any> | null = null;

export function initializeEcho(token: string): void {
  if (echoInstance) {
    echoInstance.disconnect();
  }

  echoInstance = new Echo({
    broadcaster: "pusher",
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    authEndpoint: "http://localhost:8000/broadcasting/auth",
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  // Récupérer l'utilisateur pour le nom du canal privé
  const userString = localStorage.getItem("user");
  if (userString) {
    const user: User = JSON.parse(userString);

    echoInstance
      .private(`App.Models.User.${user.id}`)
      .notification((notification: TaskCreatedNotification) => {
        // Type de la notification
        console.log("Notification reçue:", notification);

        const taskStore = useTaskStore();

        // Ajouter la nouvelle tâche à la liste des tâches
        taskStore.tasks.unshift(notification.task);

        // Ajouter un message à la page des notifications
        taskStore.addNotification({
          message: notification.message,
          id: Date.now(),
        });
      });
  }
}

export { echoInstance };
