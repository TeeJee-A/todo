<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const authStore = useAuthStore();
const email = ref<string>("");
const password = ref<string>("");
const isLoading = ref<boolean>(false);
const error = ref<string | null>(null);

const handleLogin = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    await authStore.login({ email: email.value, password: password.value });
  } catch (err) {
    error.value = "Email ou mot de passe incorrect.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <!-- Le template reste identique -->
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl">Connexion</CardTitle>
        <CardDescription
          >Entrez votre email et mot de passe pour vous
          connecter.</CardDescription
        >
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleLogin">
          <div class="grid gap-4">
            <div class="grid gap-2">
              <Label for="email">Email</Label>
              <Input id="email" type="email" v-model="email" required />
            </div>
            <div class="grid gap-2">
              <Label for="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                v-model="password"
                required
              />
            </div>
            <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
            <Button type="submit" class="w-full" :disabled="isLoading">
              {{ isLoading ? "Connexion..." : "Se connecter" }}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter class="flex justify-center">
        <p>
          Pas de compte?
          <router-link to="/register" class="text-blue-600 hover:underline"
            >Inscrivez-vous</router-link
          >
        </p>
      </CardFooter>
    </Card>
  </div>
</template>
