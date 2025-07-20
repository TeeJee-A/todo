import "./style.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router/index";
import { useAuthStore } from "./stores/auth";
import { setupAxios } from "./services/axios";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

// Configure Axios (aucune modification nécessaire ici)
setupAxios();

// Initialise le store et tente de se connecter depuis le localStorage
// Doit être fait après la création de Pinia mais avant le montage de l'app
const authStore = useAuthStore();
authStore.tryToLoginFromLocalStorage();

app.use(router);

app.mount("#app");
