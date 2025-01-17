import { createWebHistory, createRouter } from 'vue-router'

import HomeView from './components/Home-View.vue'
import SubjectsCM from './components/Subjects-CM.vue'
import StudentsCM from './components/Students-CM.vue'
import StudentsAGCM from './components/Students-AGCM.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/subjects', component: SubjectsCM },
  { path: '/students', component: StudentsCM },
  { path: '/students-ag', component: StudentsAGCM },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
