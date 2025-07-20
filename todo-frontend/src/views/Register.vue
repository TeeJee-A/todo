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
import type { registerInput } from "@/types/inputs";
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
const inputs: registerInput[] = [
  {
    type: "text",
    placeholder: "Full Name",
    name: "fullname",
  },
  {
    type: "email",
    placeholder: "Email",
    name: "email",
  },
  {
    type: "text",
    placeholder: "Phone Number",
    name: "phone",
  },
  {
    type: "text",
    placeholder: "Address",
    name: "address",
  },
  {
    type: "file",
    placeholder: "Image",
    name: "image",
  },
  {
    type: "password",
    placeholder: "Password",
    name: "password",
  },
];

const formSchema = z.object({
  fullname: z.string().min(2, "Full name is required"),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  phone: z
    .string()
    .regex(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      "Invalid phone number"
    ),
  address: z.string().min(5),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
  image: z.instanceof(File).refine((file) => file.size < 5 * 1024 * 1024, {
    message: "Image must be smaller than 5MB",
  }),
});

const form = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    fullname: "",
    email: "",
    phone: "",
    address: "",
    image: undefined,
    password: "",
  },
});

const onSubmit = form.handleSubmit(async (values) => {
  isLoading.value = true;
  error.value = null;
  const formData = new FormData();
  formData.append("fullname", values.fullname);
  formData.append("email", values.email);
  formData.append("phone", values.phone);
  formData.append("address", values.address);
  formData.append("password", values.password);
  formData.append("image", values.image);
  try {
    await authStore.register(formData);
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
        <CardTitle class="text-2xl">Create an Account</CardTitle>
        <CardDescription
          >Join us and start organizing your tasks with ease.
        </CardDescription>
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
                      v-if="input.type !== 'file'"
                      :type="input.type"
                      :placeholder="input.placeholder"
                      class="..."
                      v-bind="field"
                    />
                    <input
                      v-else
                      type="file"
                      accept="image/*"
                      class="file:text-foreground cursor-pointer placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                      @change="(e) => field.onChange((e.target as HTMLInputElement)?.files?.[0])"
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
            {{ isLoading ? "Wait..." : "Register" }}
          </Button>
        </form>
      </CardContent>
      <CardFooter class="flex justify-center">
        <p>
          Already have an account?
          <router-link to="/login" class="text-blue-600 hover:underline"
            >Login</router-link
          >
        </p>
      </CardFooter>
    </Card>
  </div>
</template>
