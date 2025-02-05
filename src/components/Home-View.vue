<template>
  <div class="flex flex-col p-6" dir="rtl">
    <Toast />
    <div class="flex flex-row items-center">
      <h1 class="text-lg font-bold">السنوات الدراسية</h1>
      <div class="flex justify-center items-center rounded-full w-7 h-7 mr-2 bg-green-500" @click="yearS = true">
        <i class="pi pi-plus"></i>
      </div>
      <div v-if="yearS">
        <Select class="mr-2" v-model="year" :options="yearsOpts" option-label="label" placeholder="اختر السنة"></Select>
        <Button class="mr-2" @click="saveYear()">حفظ</Button>
        <Button class="mr-2" @click="yearS = false">الغاء</Button>
      </div>
    </div>
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
import { getYears, createYear } from '@/controllers/general';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import Select from 'primevue/select';
import Button from 'primevue/button';

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
const yearS = ref(false);
const year = ref({});
const yearsOpts = ref([
  { label: '2025_2026', value: '2025_2026' },
  { label: '2026_2027', value: '2026_2027' }
])
const saveYear = async () => {
  if (!year.value.value) {
    toast.add({ severity: "warn", summary: 'حدث خطأ', detail: 'حدث خطأ', life: 5000 });
    return;
  }
  year.value = year.value.value;
  const { newYear, err } = await createYear(year.value);
  if (err !== null) {
    toast.add({ severity: "warn", summary: 'حدث خطأ', detail: err || 'حدث خطأ', life: 5000 });
    return;
  } else if (newYear) {
    if (!Array.isArray(data.value.years)) {
      data.value.years = [];
    }
    data.value.years.push(newYear);
    year.value = {};
    yearS.value = false;
  }
}
</script>
