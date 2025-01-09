//import './assets/main.css'
import './index.css'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura'

import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'

const app = createApp(App)

app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.my-app-dark',
    }
  }
})

app.mount('#app')
