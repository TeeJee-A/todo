import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { useAuthStore } from "../stores/auth";
// import TasksView from "../views/TasksView.vue";
import LoginView from "../views/LoginView.vue";
// import RegisterView from "../views/RegisterView.vue";
// import NotificationsView from "../views/NotificationsView.vue";
// import AppLayout from "../components/layouts/AppLayout.vue";

// On type explicitement nos routes pour plus de clarté
const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { requiresGuest: true },
  },
  //   {
  //     path: "/register",
  //     name: "register",
  //     component: RegisterView,
  //     meta: { requiresGuest: true },
  //   },
  //   {
  // path: "/",
  // component: AppLayout,
  // meta: { requiresAuth: true },
  // children: [
  //   {
  //     path: "",
  //     name: "tasks",
  //     component: TasksView,
  //   },
  //   {
  //     path: "notifications",
  //     name: "notifications",
  //     component: NotificationsView,
  //   },
  // ],
  //   },
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
