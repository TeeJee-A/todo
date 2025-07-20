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
import { toTypedSchema } from "@vee-validate/zod";
import z from "zod";
import type { loginInput } from "@/types/inputs";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "vee-validate";

const authStore = useAuthStore();
const isLoading = ref<boolean>(false);
const error = ref<string | null>(null);
const inputs: loginInput[] = [
  {
    type: "email",
    placeholder: "Email",
    name: "email",
  },
  {
    type: "password",
    placeholder: "Password",
    name: "password",
  },
];

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});

const form = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    email: "",
    password: "",
  },
});

const onSubmit = form.handleSubmit(async (values) => {
  isLoading.value = true;
  error.value = null;
  try {
    await authStore.login({ email: values.email, password: values.password });
  } catch (err) {
    error.value = "Email ou mot de passe incorrect.";
  } finally {
    isLoading.value = false;
  }
});
</script>

<template
  class="w-screen h-screen overflow-hidden flex justify-center items-center"
>
  <div
    class="flex items-center justify-center md:w-[90%] md:min-w-sm min-w-xs w-full bg-gray-500 rounded-2xl"
  >
    <Card class="w-full">
      <CardHeader>
        <CardTitle class="text-2xl">Welcome Back</CardTitle>
        <CardDescription
          >Sign in to access your tasks and stay productive.</CardDescription
        >
      </CardHeader>
      <CardContent>
        <form @submit="onSubmit" class="gap-2 flex flex-col">
          <div class="flex flex-col gap-2">
            <template v-for="input in inputs" :key="input.name">
              <FormField :control="form" :name="input.name" v-slot="{ field }">
                <FormItem
                  class="w-full flex justify-start flex-col items-start gap-0"
                >
                  <FormControl>
                    <Input
                      :type="input.type"
                      :placeholder="input.placeholder"
                      class="bg-accent caret-primary rounded-lg md:h-9 h-7 transition-all duration-200 focus:ring-0 focus:border-0 border border-gray-200 md:placeholder:text-sm placeholder:text-xs md:text-sm text-xs placeholder:text-black/50 flex justify-center items-center"
                      v-bind="field"
                    />
                  </FormControl>
                  <FormMessage
                    class="md:text-[12px] sm:text-[10px] text-[8px] text-red-600"
                  />
                </FormItem>
              </FormField>
            </template>
          </div>
          <p class="md:text-[12px] sm:text-[10px] text-[8px] text-red-600">
            {{ error ? error : "" }}
          </p>
          <Button
            :disabled="isLoading"
            type="submit"
            class="w-full cursor-pointer"
          >
            {{ isLoading ? "Wait..." : "Login" }}
          </Button>
        </form>
      </CardContent>
      <CardFooter class="flex justify-center">
        <p>
          Don't have an account?
          <router-link to="/register" class="text-blue-600 hover:underline"
            >Register</router-link
          >
        </p>
      </CardFooter>
    </Card>
  </div>
</template>
