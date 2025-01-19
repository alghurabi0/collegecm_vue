import { createWebHistory, createRouter } from 'vue-router'

import HomeView from './components/Home-View.vue'
import SubjectsCM from './components/Subjects-CM.vue'
import StudentsCM from './components/Students-CM.vue'
import StudentsAGCM from './components/Students-AGCM.vue'
import CarryoversCM from './components/Carryovers-CM.vue'
import ExemptedsCM from './components/Exempteds-CM.vue'
import MarkCM from './components/Mark-CM.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/subjects', component: SubjectsCM },
  { path: '/students', component: StudentsCM },
  { path: '/students-ag', component: StudentsAGCM },
  { path: '/carryovers', component: CarryoversCM },
  { path: '/exempted', component: ExemptedsCM },
  { path: '/marks', component: MarkCM },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
