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
        <Button icon="pi pi-moon" outlined rounded severity="secondary" @click="toggleDarkMode()" />
        <RouterLink class="mr-5 hover:text-green-500" to="/">الرئيسية</RouterLink>
        <RouterLink class="mr-5 hover:text-green-500" to="/subjects/2024_2025/all">المواد</RouterLink>
        <RouterLink class="mr-5 hover:text-green-500" to="/students/2024_2025/all">الطلاب</RouterLink>
        <RouterLink class="mr-5 hover:text-green-500" to="/carryovers/2024_2025/all">التحميل</RouterLink>
        <RouterLink class="mr-5 hover:text-green-500" to="/exempted/2024_2025/all">الاعفاء</RouterLink>
        <RouterLink class="mr-5 hover:text-green-500" to="/marks/2024_2025/all">الدرجات</RouterLink>

      </nav>
    </div>
  </header>

  <body>
    <RouterView />
  </body>
</template>
