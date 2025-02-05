//import './assets/main.css'
import './index.css'
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Aura from '@primevue/themes/aura'

import { createApp } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue'
import { router } from './router'

const app = createApp(App)
const pinia = createPinia();

app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.my-app-dark',
    }
  }
})
app.use(ToastService);
app.use(pinia)

app.mount('#app')
