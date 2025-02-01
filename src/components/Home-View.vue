<template>
  <div class="flex flex-col p-6" dir="rtl">
    <Toast />
    <h1 class="text-lg font-bold">السنوات الدراسية</h1>
    <div v-if="data?.years" class="mt-3">
      <RouterLink v-for="year in data?.years" :key="year.year" :to="`/year/${encodeURIComponent(year.year)}`">
        <Card class="w-56 text-center border-2 border-green-500">
          <template #title>
            <div class="bg-green-500">
              {{ year.year }}
            </div>
          </template>
        </Card>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import Card from 'primevue/card';
import { RouterLink } from 'vue-router';
import { ref, onMounted } from 'vue';
import { getYears } from '@/controllers/general';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

const toast = useToast();
const data = ref([]);
onMounted(async () => {
  const { years, err } = await getYears();
  if (err !== null) {
    toast.add({ severity: 'warn', summary: 'حدث خطأ', detail: err, life: 5000 });
    return;
  } else {
    data.value.years = years;
  }
})
</script>
