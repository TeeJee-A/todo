import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { useAuthStore } from "../stores/auth";
import Login from "../views/Login.vue";
import Register from "@/views/Register.vue";
import Tasks from "@/views/Tasks.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: { requiresGuest: true },
  },
  {
    path: "/register",
    name: "register",
    component: Register,
    meta: { requiresGuest: true },
  },
  {
    path: "",
    name: "tasks",
    component: Tasks,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// La garde de navigation bénéficie de la vérification de type
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: "login" });
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next({ name: "tasks" });
  } else {
    next();
  }
});

export default router;
