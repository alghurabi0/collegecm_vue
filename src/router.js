import { createWebHistory, createRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore';

import HomeView from './components/Home-View.vue'
import SubjectsCM from './components/Subjects-CM.vue'
import StudentsAGCM from './components/Students-AGCM.vue'
import CarryoversCM from './components/Carryovers-CM.vue'
import ExemptedsCM from './components/Exempteds-CM.vue'
import MarkCM from './components/Mark-CM.vue'
import YearCM from './components/Year-CM.vue'
import UsersCM from './components/Users-CM.vue'
import LoginCM from './components/Login-CM.vue'
import YearsCM from './components/Years-CM.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/subjects/:year/:stage', component: SubjectsCM },
  { path: '/students/:year/:stage', component: StudentsAGCM },
  { path: '/carryovers/:year/:stage', component: CarryoversCM },
  { path: '/exempted/:year/:stage', component: ExemptedsCM },
  { path: '/marks/:year/:stage', component: MarkCM },
  { path: '/year/:year', component: YearCM },
  { path: '/users', component: UsersCM },
  { path: '/login', component: LoginCM },
  { path: '/years', component: YearsCM },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Global navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Allow access to the login route without authentication
  if (to.path === '/login') {
    next();
    return;
  }

  // Fetch the user authentication status
  await authStore.fetchAuth();

  // If the user is authenticated, allow navigation
  if (authStore.current_user) {
    next();
  } else {
    // Redirect to login if the user is not authenticated
    next('/login');
  }
});
