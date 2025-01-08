<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Button from 'primevue/button';
function toggleDarkMode() {
  document.documentElement.classList.toggle('my-app-dark');
}
</script>

<template>
  <header>
    <div>
      <nav>
        <Button label="Toggle Dark Mode" @click="toggleDarkMode()" />
        <RouterLink to="/subjects">Subjects</RouterLink>
      </nav>
    </div>
  </header>

  <body>
    <RouterView />
  </body>
</template>
