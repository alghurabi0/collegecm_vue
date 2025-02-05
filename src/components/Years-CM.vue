<template>
  <Toast />
  <DataTable dir="rtl" :columns="cols" :data="data?.years" :options="options" class="cell-border">
    <template #action="props">
      <Button icon="pi pi-trash" outlined rounded severity="danger" class="mr-2"
        @click="confirmDeleteYear(props.rowData)" />
    </template>
  </DataTable>
  <Dialog v-model:visible="deleteYearDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
    <div class="flex items-center gap-4">
      <i class="pi pi-exclamation-triangle !text-3xl" />
      <span v-if="year">؟<b>{{ year.year }}</b> هل انت متأكد من حذف</span>
    </div>
    <template #footer>
      <Button label="لا" icon="pi pi-times" text @click="deleteYearDialog = false" />
      <Button label="نعم" icon="pi pi-check" @click="deleteYear" />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import 'datatables.net-buttons';
import 'datatables.net-buttons/js/buttons.html5';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';
import { getYears, deleteYearC } from '@/controllers/general';

DataTable.use(DataTablesCore);
//
const toast = useToast();
const cols = [
  { data: 'year', title: 'السنة الدراسية', width: "50%" },
  {
    data: null,
    render: '#action',
    title: '',
    orderable: false,
    width: "50%"
  },
]
const options = {
  colReorder: false,
  lengthMenu: [10, 50, 100, 500, { label: 'الكل', value: -1 }],
  responive: true,
  autoWidth: false,
  //stateSave: true,
  layout: {
    top2Start: {
    },
  },
  language: {
    url: "https://cdn.datatables.net/plug-ins/2.2.1/i18n/ar.json"
  }
}
// get
const data = ref({})
onMounted(async () => {
  const { years, err: err1 } = await getYears();
  if (err1 !== null) {
    toast.add({ severity: "warn", summary: "حدث حطأ", detail: err1 || 'حدث خطأ', life: 5000 });
    return;
  } else if (years) {
    data.value.years = years
  }
});
// add and update
const year = ref({});
// delete
const deleteYearDialog = ref(false);
const confirmDeleteYear = (yr) => {
  year.value = yr;
  deleteYearDialog.value = true;
};
const deleteYear = async () => {
  if (year?.value.year) {
    const res = await deleteYearC(year.value.year);
    if (res !== true) {
      toast.add({ severity: 'warn', summary: 'Fail', details: res || 'حدث خطأ', life: 5000 });
    } else {
      data.value.years = data.value.years.filter(val => val.year !== year.value.year);
      deleteYearDialog.value = false;
      year.value = {};
      toast.add({ severity: 'success', summary: 'Successful', detail: 'تم حذف السنة الاكاديمية', life: 3000 });
    }
  } else {
    toast.add({ severity: 'warn', summary: 'Fail', details: 'حدث خطأ', life: 5000 });
    return;
  }
};
</script>
