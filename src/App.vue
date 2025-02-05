<script setup>
import { provide, onMounted, ref, watch } from 'vue';
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'
import Button from 'primevue/button';
import Menubar from 'primevue/menubar';
import Menu from 'primevue/menu';
import { getAuth, logout } from './controllers/auth';

function toggleDarkMode() {
  document.documentElement.classList.toggle('my-app-dark');
}
const router = useRouter();
const route = useRoute();
const year = ref(route.params.year);
const current_user = ref(false);
watch(
  () => route.params.year,
  (newYear) => {
    year.value = newYear; // Update the year variable when the route changes
    console.log(newYear);
  }
);
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
  console.log(current_user.value);
  if (!current_user.value) {
    return;
  }
  const err = await logout();
  if (err !== null) {
    console.log(err);
    return;
  }
  current_user.value = false;
  router.push('/login');
}

const items = ref([
  {
    label: '',
    icon: 'pi pi-moon',
    command: () => {
      toggleDarkMode();
    }
  },
  {
    label: 'الرئيسية',
    icon: 'pi pi-home',
    route: '/'
  },
  {
    label: 'الطلاب',
    icon: 'pi pi-user',
    items: [
      {
        label: 'المرحلة الاولى',
        route: `/students/${year.value}/1`
      },
      {
        label: 'المرحلة الثانية',
        route: `/students/${year.value}/2`
      },
      {
        label: 'المرحلة الثالثة',
        route: `/students/${year.value}/3`
      },
      {
        label: 'المرحلة الرابعة',
        route: `/students/${year.value}/4`
      },
      {
        label: 'المرحلة الخامسة',
        route: `/students/${year.value}/5`
      },
      {
        label: 'المرحلة السادسة',
        route: `/students/${year.value}/6`
      },
      {
        label: 'الكل',
        route: `/students/${year.value}/all`
      }
    ]
  },
  {
    label: 'المواد',
    icon: 'pi pi-book',
    items: [
      {
        label: 'المرحلة الاولى',
        route: `/subjects/${year.value}/1`
      },
      {
        label: 'المرحلة الثانية',
        route: `/subjects/${year.value}/2`
      },
      {
        label: 'المرحلة الثالثة',
        route: `/subjects/${year.value}/3`
      },
      {
        label: 'المرحلة الرابعة',
        route: `/subjects/${year.value}/4`
      },
      {
        label: 'المرحلة الخامسة',
        route: `/subjects/${year.value}/5`
      },
      {
        label: 'المرحلة السادسة',
        route: `/subjects/${year.value}/6`
      },
      {
        label: 'الكل',
        route: `/subjects/${year.value}/all`
      }
    ]
  },
  {
    label: 'التحميل',
    items: [
      {
        label: 'المرحلة الاولى',
        route: `/carryovers/${year.value}/1`
      },
      {
        label: 'المرحلة الثانية',
        route: `/carryovers/${year.value}/2`
      },
      {
        label: 'المرحلة الثالثة',
        route: `/carryovers/${year.value}/3`
      },
      {
        label: 'المرحلة الرابعة',
        route: `/carryovers/${year.value}/4`
      },
      {
        label: 'المرحلة الخامسة',
        route: `/carryovers/${year.value}/5`
      },
      {
        label: 'المرحلة السادسة',
        route: `/carryovers/${year.value}/6`
      },
      {
        label: 'الكل',
        route: `/carryovers/${year.value}/all`
      }
    ]
  },
  {
    label: 'الاعفاء',
    items: [
      {
        label: 'المرحلة الاولى',
        route: `/exempted/${year.value}/1`
      },
      {
        label: 'المرحلة الثانية',
        route: `/exempted/${year.value}/2`
      },
      {
        label: 'المرحلة الثالثة',
        route: `/exempted/${year.value}/3`
      },
      {
        label: 'المرحلة الرابعة',
        route: `/exempted/${year.value}/4`
      },
      {
        label: 'المرحلة الخامسة',
        route: `/exempted/${year.value}/5`
      },
      {
        label: 'المرحلة السادسة',
        route: `/exempted/${year.value}/6`
      },
      {
        label: 'الكل',
        route: `/exempted/${year.value}/all`
      }
    ]
  },
  {
    label: 'الدرجات',
    items: [
      {
        label: 'المرحلة الاولى',
        route: `/marks/${year.value}/1`
      },
      {
        label: 'المرحلة الثانية',
        route: `/marks/${year.value}/2`
      },
      {
        label: 'المرحلة الثالثة',
        route: `/marks/${year.value}/3`
      },
      {
        label: 'المرحلة الرابعة',
        route: `/marks/${year.value}/4`
      },
      {
        label: 'المرحلة الخامسة',
        route: `/marks/${year.value}/5`
      },
      {
        label: 'المرحلة السادسة',
        route: `/marks/${year.value}/6`
      },
      {
        label: 'الكل',
        route: `/marks/${year.value}/all`
      }
    ]
  },
])
const menu = ref();
const items2 = ref([
  {
    label: 'الاعدادات',
    items: [
      {
        label: 'المستخدمين',
        icon: 'pi pi-user',
        route: '/users'
      },
      {
        label: 'السنوات الدراسية',
        route: '/years'
      }
    ]
  }
]);

const toggle = (event) => {
  menu.value.toggle(event);
};
</script>

<template>
  <header>
    <div>
      <nav class="flex flex-row justify-between place-items-center">
        <div class="w-full">
          <Menubar v-if="route.path !== '/'" :model="items" dir="rtl" style="width: 100%;">
            <template #item="{ item, props, hasSubmenu }">
              <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                <a :href="href" v-bind="props.action" @click="navigate">
                  <span :class="item.icon" />
                  <span>{{ item.label }}</span>
                </a>
              </router-link>
              <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                <span :class="item.icon" />
                <span>{{ item.label }}</span>
                <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down" />
              </a>
            </template>
            <template #end>
              <div class="flex flex-row place-items-center">
                <span v-if="current_user?.username" class="mr-5">مرحبا, {{ current_user.username }}</span>
                <div class="mr-5">
                  <div v-if="current_user">
                    <Button @click="logoutUser()">تسجيل الخروج</Button>
                  </div>
                  <div v-else>
                    <RouterLink to="/login"><Button>تسجيل الدخول</Button></RouterLink>
                  </div>
                </div>
                <div class="flex justify-center mr-2">
                  <Button type="button" icon="pi pi-cog" @click="toggle" aria-haspopup="true"
                    aria-controls="overlay_menu" severity="contrast" rounded outlined />
                  <Menu ref="menu" id="overlay_menu" :model="items2" :popup="true">
                    <template #item="{ item, props }">
                      <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                        <a :href="href" v-bind="props.action" @click="navigate">
                          <span :class="item.icon" />
                          <span class="ml-2">{{ item.label }}</span>
                        </a>
                      </router-link>
                      <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                        <span :class="item.icon" />
                        <span class="ml-2">{{ item.label }}</span>
                      </a>
                    </template>
                  </Menu>
                </div>
              </div>
            </template>
          </Menubar>
          <Menubar v-else dir="rtl" style="width: 100%;">
            <template #end>
              <div class="flex flex-row place-items-center">
                <span v-if="current_user?.username" class="mr-5">مرحبا, {{ current_user.username }}</span>
                <div class="mr-5">
                  <div v-if="current_user">
                    <Button @click="logoutUser()">تسجيل الخروج</Button>
                  </div>
                  <div v-else>
                    <RouterLink to="/login"><Button>تسجيل الدخول</Button></RouterLink>
                  </div>
                </div>
                <div class="flex justify-center mr-2">
                  <Button type="button" icon="pi pi-cog" @click="toggle" aria-haspopup="true"
                    aria-controls="overlay_menu" severity="contrast" rounded outlined />
                  <Menu ref="menu" id="overlay_menu" :model="items2" :popup="true">
                    <template #item="{ item, props }">
                      <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                        <a :href="href" v-bind="props.action" @click="navigate">
                          <span :class="item.icon" />
                          <span class="ml-2">{{ item.label }}</span>
                        </a>
                      </router-link>
                      <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                        <span :class="item.icon" />
                        <span class="ml-2">{{ item.label }}</span>
                      </a>
                    </template>
                  </Menu>
                </div>
              </div>
            </template>
          </Menubar>
        </div>
      </nav>
    </div>
  </header>

  <body>
    <RouterView />
  </body>
</template>
