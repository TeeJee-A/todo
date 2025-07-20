// src/types/index.ts

/**
 * Représente la structure d'un utilisateur authentifié.
 */
export interface User {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  address: string;
  image?: string; // Optionnel
}

