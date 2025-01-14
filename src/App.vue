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
      <nav class="flex flex-row-reverse mt-5">
        <Button label="Mode" @click="toggleDarkMode()" />
        <RouterLink class="mr-5 hover:text-green-500" to="/">Home</RouterLink>
        <RouterLink class="mr-5 hover:text-green-500" to="/subjects">المواد</RouterLink>
        <RouterLink class="mr-5 hover:text-green-500" to="/students">الطلاب</RouterLink>
      </nav>
    </div>
  </header>

  <body>
    <RouterView />
  </body>
</template>
