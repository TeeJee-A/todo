// src/types/index.ts

/**
 * Représente la structure d'un utilisateur authentifié.
 */
export interface User {
  id: number;
  fullname: string;
  email: string;
  phone_number: string;
  address: string;
  image?: string; // Optionnel
}

/**
 * Représente la structure d'une tâche.
 */
export interface Task {
  id: number;
  title: string;
  completed: boolean;
  user_id: number;
  created_at: string;
  updated_at: string;
}

/**
 * Représente une notification affichée dans l'interface.
 */
export interface UINotification {
  id: number;
  message: string;
}

/**
 * Représente la charge utile de la notification reçue via Pusher.
 * Doit correspondre à la structure de votre classe de Notification Laravel.
 */
export interface TaskCreatedNotification {
  task: Task;
  message: string;
}
