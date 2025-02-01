<script setup>
import { provide, onMounted, ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import Button from 'primevue/button';
import { getAuth, logout } from './controllers/auth';

function toggleDarkMode() {
  document.documentElement.classList.toggle('my-app-dark');
}
const current_user = ref(false);
provide('current_user', current_user);
function updateCurrentUser(user) {
  current_user.value = user;
}
provide('updateCurrentUser', updateCurrentUser); // Provide the update function
onMounted(async () => {
  const user = await getAuth();
  if (user === false) {
    return;
  } else if (user && user.username) {
    current_user.value = user;
  }
});

const logoutUser = async () => {
  if (!current_user.value) {
    return;
  }
  const res = await logout();
  if (!res) {
    return;
  }
  current_user.value = false;
}
</script>

<template>
  <header>
    <div>
      <nav class="flex flex-row-reverse mt-5">
        <Button icon="pi pi-moon" outlined rounded severity="secondary" @click="toggleDarkMode()" />
        <RouterLink class="mr-5 hover:text-green-500" to="/">الرئيسية</RouterLink>
        <RouterLink class="mr-5 hover:text-green-500" to="/users">المستخدمون</RouterLink>
        <RouterLink class="mr-5 hover:text-green-500" to="/subjects/2024_2025/all">المواد</RouterLink>
        <RouterLink class="mr-5 hover:text-green-500" to="/students/2024_2025/all">الطلاب</RouterLink>
        <RouterLink class="mr-5 hover:text-green-500" to="/carryovers/2024_2025/all">التحميل</RouterLink>
        <RouterLink class="mr-5 hover:text-green-500" to="/exempted/2024_2025/all">الاعفاء</RouterLink>
        <RouterLink class="mr-5 hover:text-green-500" to="/marks/2024_2025/all">الدرجات</RouterLink>
        <span v-if="current_user?.username" class="mr-5">مرحبا, {{ current_user.username }}</span>
        <div class="mr-5">
          <div v-if="current_user">
            <Button @click="logoutUser()">تسجيل الخروج</Button>
          </div>
          <div v-else>
            <Button>تسجيل الدخول</Button>
          </div>
        </div>
      </nav>
    </div>
  </header>

  <body>
    <RouterView />
  </body>
</template>
