<script setup>
import { ref, onMounted } from 'vue';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-dt';
import 'datatables.net-colreorder-dt';
import 'datatables.net-responsive-dt';
import { useToast } from 'primevue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Select from 'primevue/select';
import jszip from 'jszip';
import { addCarryover, deleteCarryover } from '@/controllers/students';

DataTable.use(DataTablesCore);
DataTablesCore.Buttons.jszip(jszip);
// global
const data = ref(null)
const carryover = ref({});
const students = ref(null);
const subjects = ref(null);
const toast = useToast();
let dt;
const table = ref();
const cols = [
  { data: 'id', title: 'التسلسل' },
  { data: 'student_name', title: 'اسم الطالب' },
  { data: 'subject_name', title: 'المادة' },
  {
    data: null,
    render: '#action',
    title: '',
    orderable: false,
  },
]
const options = {
  colReorder: true,
  lengthMenu: [10, 50, 100, 500, { label: 'الكل', value: -1 }],
  responive: true,
  autoWidth: true,
  //stateSave: true,
  layout: {
    top2End: {
      buttons: ['csv', { extend: 'excel', text: 'Excel تصدير', className: 'excel_button' }]
    },
    top2Start: {
      buttons: [
        {
          text: "اضافة", name: "add", className: "add_button", action: function () {
            carryover.value = {};
            submitted.value = false;
            carryoverDialog.value = true;
          }
        }
      ],
    },
  },
  language: {
    url: "https://cdn.datatables.net/plug-ins/2.2.1/i18n/ar.json"
  }
}
// getting
onMounted(async () => {
  try {
    dt = table.value.dt;
    // carryovers
    const response = await fetch('https://collegecm.work.gd/v1/carryovers')
    if (!response.ok) throw new Error('Network response was not ok')
    const jsonResponse = await response.json();
    if (jsonResponse.carryovers !== null) {
      data.value = jsonResponse
    }
    // students
    const studentsResponse = await fetch('https://collegecm.work.gd/v1/students');
    if (!studentsResponse.ok) throw new Error('Failed to fetch students');
    students.value = await studentsResponse.json();
    // subjects
    const subjectsResponse = await fetch('https://collegecm.work.gd/v1/subjects');
    if (!subjectsResponse.ok) throw new Error('Failed to fetch subjects');
    const subjectsData = await subjectsResponse.json();
    subjects.value = subjectsData;
  } catch (error) {
    console.error('Error fetching data:', error)
  }
});
// add and update
const carryoverDialog = ref(false);
const submitted = ref(false);
const hideDialog = () => {
  carryoverDialog.value = false;
  submitted.value = false;
};
const saveCarryover = async () => {
  submitted.value = true;
  if (carryover?.value.student_name && carryover?.value.subject_name) {
    carryover.value.student_id = carryover.value.student_name.student_id;
    carryover.value.subject_id = carryover.value.subject_name.subject_id;
    const { student_name, subject_name, ...dataToSend } = carryover.value;
    const { newCarryover, err } = await addCarryover(dataToSend);
    if (err !== null) {
      toast.add({ severity: 'danger', summary: 'Fail', details: err || 'حدث خطأ', life: 10000 });
    } else if (newCarryover) {
      if (!Array.isArray(data.value.carryovers)) {
        data.value.carryovers = [];
      }
      data.value.carryovers.push(newCarryover);
      toast.add({ severity: 'success', summary: 'Successful', detail: 'تم الانشاء', life: 4000 });
      carryoverDialog.value = false;
      carryover.value = {};
    }
  } else {
    toast.add({ severity: 'danger', summary: 'Fail', details: 'حدث خطأ', life: 5000 });
  }
}
// delete
const deleteCarryoverDialog = ref(false);
const confirmDeleteCarryover = (carry) => {
  carryover.value = carry;
  deleteCarryoverDialog.value = true;
};
const deleteCarryover1 = async () => {
  if (carryover?.value.id) {
    const res = await deleteCarryover(carryover.value.id)
    if (res !== true) {
      toast.add({ severity: 'danger', summary: 'Fail', details: res || 'حدث خطأ', life: 10000 });
    } else {
      data.value.carryovers = data.value.carryovers.filter(val => val.id !== carryover.value.id);
      deleteCarryoverDialog.value = false;
      carryover.value = {};
      toast.add({ severity: 'success', summary: 'Successful', detail: 'تم الحذف', life: 3000 });
    }
  } else {
    toast.add({ severity: 'danger', summary: 'Fail', details: 'حدث خطأ', life: 5000 });
  }
};
</script>
<template>
  <DataTable dir="rtl" :columns="cols" :data="data?.carryovers" ref="table" :options="options" class="cell-border">
    <template #action="props">
      <Button icon="pi pi-trash" outlined rounded severity="danger" class="mr-2"
        @click="confirmDeleteCarryover(props.rowData)" />
    </template>
  </DataTable>
  <Dialog v-model:visible="deleteCarryoverDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
    <div class="flex items-center gap-4">
      <i class="pi pi-exclamation-triangle !text-3xl" />
      <span v-if="carryover">؟<b>{{ carryover.subject_name }}</b> لمادة <b>{{ carryover.student_name }}</b> هل انت متأكد
        من حذف</span>
    </div>
    <template #footer>
      <Button label="لا" icon="pi pi-times" text @click="deleteCarryoverDialog = false" />
      <Button label="نعم" icon="pi pi-check" @click="deleteCarryover1" />
    </template>
  </Dialog>
  <Dialog dir="rtl" v-model:visible="carryoverDialog" class="w-4/5 md:w-3/5" header="التفاصيل" :modal="true">
    <div class="flex flex-col gap-6">
      <div>
        <label for="student_name" class="block font-bold mb-3">اسم الطالب</label>
        <Select id="student_name" v-model="carryover.student_name" :options="students?.students"
          optionLabel="student_name" filter placeholder="اختر الطالب" fluid
          :invalid="submitted && !carryover.student_name" required="true">
          <template #value="slotProps">
            <div v-if="slotProps.value">{{ slotProps.value.student_name }}</div>
            <span v-else>{{ slotProps.placeholder }}</span>
          </template>
          <template #option="slotProps">
            <div>{{ slotProps.option.student_name }}</div>
          </template>
        </Select>
        <small v-if="submitted && !carryover.student_name" class="text-red-500">يجب ادخال اسم الطالب</small>
        <label for="subject_name" class="block font-bold mb-3">اسم المادة</label>
        <Select id="subject_name" v-model="carryover.subject_name" :options="subjects?.subjects"
          optionLabel="subject_name" filter placeholder="اختر المادة" fluid
          :invalid="submitted && !carryover.subject_name" required="true">
          <template #value="slotProps">
            <div v-if="slotProps.value">{{ slotProps.value.subject_name }}</div>
            <span v-else>{{ slotProps.placeholder }}</span>
          </template>
          <template #option="slotProps">
            <div>{{ slotProps.option.subject_name }}</div>
          </template>
        </Select>
        <small v-if="submitted && !carryover.subject_name" class="text-red-500">يجب ادخال اسم المادة</small>
      </div>
    </div>
    <template #footer>
      <Button label="الغاء" icon="pi pi-times" text @click="hideDialog" />
      <Button label="حفظ" icon="pi pi-check" @click="saveCarryover" />
    </template>
  </Dialog>
</template>
<style>
.p-select-option {
  justify-content: end;
}

.p-select-filter {
  text-align: right;
}
</style>
