import { defineStore } from "pinia";
import axios from "axios";
import type { Task, UINotification } from "@/types";

// Type pour l'état du store des tâches
interface TaskState {
  tasks: Task[];
  notifications: UINotification[];
  isLoading: boolean;
}

// Type pour la donnée envoyée lors de la création d'une tâche
type NewTaskPayload = Omit<
  Task,
  "id" | "user_id" | "created_at" | "updated_at"
>;

export const useTaskStore = defineStore("task", {
  state: (): TaskState => ({
    tasks: [],
    notifications: [],
    isLoading: false,
  }),
  actions: {
    async addTask(taskData: NewTaskPayload) {
      this.isLoading = true;
      try {
        // La réponse API contiendra la tâche complète
        await axios.post<{ data: Task }>("/api/tasks", taskData);
        // L'ajout à l'état se fera via l'événement broadcast
      } catch (error) {
        console.error("Erreur lors de l'ajout de la tâche:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchTasks() {
      this.isLoading = true;
      try {
        const response = await axios.get<{ data: Task[] }>("/api/tasks");
        this.tasks = response.data.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des tâches:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async updateTask(task: Task) {
      try {
        const response = await axios.put<{ data: Task }>(
          `/api/tasks/${task.id}`,
          task
        );
        const index = this.tasks.findIndex((t) => t.id === task.id);
        if (index !== -1) {
          this.tasks[index] = response.data.data;
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la tâche:", error);
      }
    },

    async deleteTask(taskId: number) {
      try {
        await axios.delete(`/api/tasks/${taskId}`);
        this.tasks = this.tasks.filter((t) => t.id !== taskId);
      } catch (error) {
        console.error("Erreur lors de la suppression de la tâche:", error);
      }
    },

    addNotification(notification: UINotification) {
      this.notifications.unshift(notification);
    },
  },
});
