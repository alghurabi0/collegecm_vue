<template>
  <div class="flex" dir="rtl">
    <Toast />
    <Card>
      <template #content>
        <div class="flex flex-col">
          <h1 class="text-lg font-bold">الطلاب</h1>
          <RouterLink class="text-md" :to="`/students/${$route.params.year}/1`">المرحلة الاولى</RouterLink>
          <RouterLink class="text-md" :to="`/students/${$route.params.year}/2`">المرحلة الثانية</RouterLink>
          <RouterLink class="text-md" :to="`/students/${$route.params.year}/3`">المرحلة الثالثة</RouterLink>
          <RouterLink class="text-md" :to="`/students/${$route.params.year}/4`">المرحلة الرابعة</RouterLink>
          <RouterLink class="text-md" :to="`/students/${$route.params.year}/5`">المرحلة الخامسة</RouterLink>
          <RouterLink class="text-md" :to="`/students/${$route.params.year}/6`">المرحلة السادسة</RouterLink>
          <RouterLink class="text-md" :to="`/students/${$route.params.year}/all`">الكل</RouterLink>
        </div>
      </template>
    </Card>
    <Card>
      <template #content>
        <div class="flex flex-col">
          <h1 class="text-lg font-bold">المواد</h1>
          <RouterLink class="text-md" :to="`/subjects/${$route.params.year}/1`">المرحلة الاولى</RouterLink>
          <RouterLink class="text-md" :to="`/subjects/${$route.params.year}/2`">المرحلة الثانية</RouterLink>
          <RouterLink class="text-md" :to="`/subjects/${$route.params.year}/3`">المرحلة الثالثة</RouterLink>
          <RouterLink class="text-md" :to="`/subjects/${$route.params.year}/4`">المرحلة الرابعة</RouterLink>
          <RouterLink class="text-md" :to="`/subjects/${$route.params.year}/5`">المرحلة الخامسة</RouterLink>
          <RouterLink class="text-md" :to="`/subjects/${$route.params.year}/6`">المرحلة السادسة</RouterLink>
          <RouterLink class="text-md" :to="`/subjects/${$route.params.year}/all`">الكل</RouterLink>
        </div>
      </template>
    </Card>
    <Card>
      <template #content>
        <div class="flex flex-col">
          <h1 class="text-lg font-bold">التحميل</h1>
          <RouterLink class="text-md" :to="`/carryovers/${$route.params.year}/1`">المرحلة الاولى</RouterLink>
          <RouterLink class="text-md" :to="`/carryovers/${$route.params.year}/2`">المرحلة الثانية</RouterLink>
          <RouterLink class="text-md" :to="`/carryovers/${$route.params.year}/3`">المرحلة الثالثة</RouterLink>
          <RouterLink class="text-md" :to="`/carryovers/${$route.params.year}/4`">المرحلة الرابعة</RouterLink>
          <RouterLink class="text-md" :to="`/carryovers/${$route.params.year}/5`">المرحلة الخامسة</RouterLink>
          <RouterLink class="text-md" :to="`/carryovers/${$route.params.year}/6`">المرحلة السادسة</RouterLink>
          <RouterLink class="text-md" :to="`/carryovers/${$route.params.year}/all`">الكل</RouterLink>
        </div>
      </template>
    </Card>
    <Card>
      <template #content>
        <div class="flex flex-col">
          <h1 class="text-lg font-bold">الاعفاء</h1>
          <RouterLink class="text-md" :to="`/exempted/${$route.params.year}/1`">المرحلة الاولى</RouterLink>
          <RouterLink class="text-md" :to="`/exempted/${$route.params.year}/2`">المرحلة الثانية</RouterLink>
          <RouterLink class="text-md" :to="`/exempted/${$route.params.year}/3`">المرحلة الثالثة</RouterLink>
          <RouterLink class="text-md" :to="`/exempted/${$route.params.year}/4`">المرحلة الرابعة</RouterLink>
          <RouterLink class="text-md" :to="`/exempted/${$route.params.year}/5`">المرحلة الخامسة</RouterLink>
          <RouterLink class="text-md" :to="`/exempted/${$route.params.year}/6`">المرحلة السادسة</RouterLink>
          <RouterLink class="text-md" :to="`/exempted/${$route.params.year}/all`">الكل</RouterLink>
        </div>
      </template>
    </Card>
    <Card>
      <template #content>
        <div class="flex flex-col">
          <h1 class="text-lg font-bold">الدرجات</h1>
          <RouterLink class="text-md" :to="`/marks/${$route.params.year}/1`">المرحلة الاولى</RouterLink>
          <RouterLink class="text-md" :to="`/marks/${$route.params.year}/2`">المرحلة الثانية</RouterLink>
          <RouterLink class="text-md" :to="`/marks/${$route.params.year}/3`">المرحلة الثالثة</RouterLink>
          <RouterLink class="text-md" :to="`/marks/${$route.params.year}/4`">المرحلة الرابعة</RouterLink>
          <RouterLink class="text-md" :to="`/marks/${$route.params.year}/5`">المرحلة الخامسة</RouterLink>
          <RouterLink class="text-md" :to="`/marks/${$route.params.year}/6`">المرحلة السادسة</RouterLink>
          <RouterLink class="text-md" :to="`/marks/${$route.params.year}/all`">الكل</RouterLink>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import Card from 'primevue/card';
const toast = useToast();
</script>
