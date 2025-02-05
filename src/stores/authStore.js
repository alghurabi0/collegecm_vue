import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getAuth, logout } from '@/controllers/auth';

export const useAuthStore = defineStore('auth', () => {
  const current_user = ref(false);

  // Fetch authentication status
  const fetchAuth = async () => {
    const user = await getAuth();
    if (user && user.username) {
      current_user.value = user;
    } else {
      current_user.value = false;
    }
  };

  // Logout the user
  const logoutUser = async () => {
    const err = await logout();
    if (err) {
      console.error(err);
      return;
    }
    current_user.value = false;
  };

  return {
    current_user,
    fetchAuth,
    logoutUser,
  };
});
