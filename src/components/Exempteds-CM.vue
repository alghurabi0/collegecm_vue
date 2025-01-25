<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-dt';
import 'datatables.net-colreorder-dt';
import 'datatables.net-responsive-dt';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Select from 'primevue/select';
import jszip from 'jszip';
import { addExempt, deleteExempt, getExempteds, getStudents, getSubjects } from '@/controllers/students';

DataTable.use(DataTablesCore);
DataTablesCore.Buttons.jszip(jszip);
// global
const data = ref({})
const exempted = ref({});
const students = ref(null);
const subjects = ref(null);
const toast = useToast();
const route = useRoute();
const info = { year: route.params.year, stage: route.params.stage };
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
            exempted.value = {};
            submitted.value = false;
            exemptedDialog.value = true;
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
  dt = table.value.dt;
  // carryovers
  const info = await { year: route.params.year, stage: route.params.stage }
  const { exempteds, err } = await getExempteds(info.year, info.stage);
  if (err !== null) {
    toast.add({ severity: "error", summary: "حدث خطأ", detail: err || "حدث خطأ", life: 5000 })
    return;
  } else {
    if (exempteds.exempteds !== null) {
      data.value = exempteds;
    }
  }
  // students
  const { students: st, err: err1 } = await getStudents(info.year, info.stage);
  if (err1 !== null) {
    toast.add({ severity: "error", summary: "حدث خطأ", detail: err || "حدث خطأ", life: 5000 })
    return;
  } else {
    if (st.students !== null) {
      students.value = st;
    }
  }
  // subjects
  // TODO subject for previous stage
  const { subjects: subs, err: err2 } = await getSubjects(info.year, info.stage);
  if (err2 !== null) {
    toast.add({ severity: "error", summary: "حدث خطأ", detail: err2 || "حدث خطأ", life: 5000 })
    return;
  } else {
    if (subs.subjects !== null) {
      subjects.value = subs;
    }
  }
});
// add and update
const exemptedDialog = ref(false);
const submitted = ref(false);
const hideDialog = () => {
  exemptedDialog.value = false;
  submitted.value = false;
};
const saveExempted = async () => {
  submitted.value = true;
  if (exempted?.value.student_name && exempted?.value.subject_name) {
    exempted.value.student_id = exempted.value.student_name.student_id;
    exempted.value.subject_id = exempted.value.subject_name.subject_id;
    const { student_name, subject_name, ...dataToSend } = exempted.value;
    const { newExempt, err } = await addExempt(info.year, dataToSend);
    if (err !== null) {
      toast.add({ severity: 'danger', summary: 'Fail', details: err || 'حدث خطأ', life: 10000 });
    } else if (newExempt) {
      if (!Array.isArray(data.value.exempteds)) {
        data.value.exempteds = [];
      }
      data.value.exempteds.push(newExempt);
      toast.add({ severity: 'success', summary: 'Successful', detail: 'تم الانشاء', life: 4000 });
      exemptedDialog.value = false;
      exempted.value = {};
    }
  } else {
    toast.add({ severity: 'danger', summary: 'Fail', details: 'حدث خطأ', life: 5000 });
  }
}
// delete
const deleteExemptedDialog = ref(false);
const confirmDeleteExempted = (carry) => {
  exempted.value = carry;
  deleteExemptedDialog.value = true;
};
const deleteExempted = async () => {
  if (exempted?.value.id) {
    const res = await deleteExempt(info.year, exempted.value.id)
    if (res !== true) {
      toast.add({ severity: 'danger', summary: 'Fail', details: res || 'حدث خطأ', life: 10000 });
    } else {
      data.value.exempteds = data.value.exempteds.filter(val => val.id !== exempted.value.id);
      deleteExemptedDialog.value = false;
      exempted.value = {};
      toast.add({ severity: 'success', summary: 'Successful', detail: 'تم الحذف', life: 3000 });
    }
  } else {
    toast.add({ severity: 'danger', summary: 'Fail', details: 'حدث خطأ', life: 5000 });
  }
};
</script>
<template>
  <Toast />
  <DataTable dir="rtl" :columns="cols" :data="data?.exempteds" ref="table" :options="options" class="cell-border">
    <template #action="props">
      <Button icon="pi pi-trash" outlined rounded severity="danger" class="mr-2"
        @click="confirmDeleteExempted(props.rowData)" />
    </template>
  </DataTable>
  <Dialog v-model:visible="deleteExemptedDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
    <div class="flex items-center gap-4">
      <i class="pi pi-exclamation-triangle !text-3xl" />
      <span v-if="exempted">؟<b>{{ exempted.subject_name }}</b> لمادة <b>{{ exempted.student_name }}</b> هل انت متأكد
        من حذف</span>
    </div>
    <template #footer>
      <Button label="لا" icon="pi pi-times" text @click="deleteExemptedDialog = false" />
      <Button label="نعم" icon="pi pi-check" @click="deleteExempted" />
    </template>
  </Dialog>
  <Dialog dir="rtl" v-model:visible="exemptedDialog" class="w-4/5 md:w-3/5" header="التفاصيل" :modal="true">
    <div class="flex flex-col gap-6">
      <div>
        <label for="student_name" class="block font-bold mb-3">اسم الطالب</label>
        <Select id="student_name" v-model="exempted.student_name" :options="students?.students"
          optionLabel="student_name" filter placeholder="اختر الطالب" fluid
          :invalid="submitted && !exempted.student_name" required="true">
          <template #value="slotProps">
            <div v-if="slotProps.value">{{ slotProps.value.student_name }}</div>
            <span v-else>{{ slotProps.placeholder }}</span>
          </template>
          <template #option="slotProps">
            <div>{{ slotProps.option.student_name }}</div>
          </template>
        </Select>
        <small v-if="submitted && !exempted.student_name" class="text-red-500">يجب ادخال اسم الطالب</small>
        <label for="subject_name" class="block font-bold mb-3">اسم المادة</label>
        <Select id="subject_name" v-model="exempted.subject_name" :options="subjects?.subjects"
          optionLabel="subject_name" filter placeholder="اختر المادة" fluid
          :invalid="submitted && !exempted.subject_name" required="true">
          <template #value="slotProps">
            <div v-if="slotProps.value">{{ slotProps.value.subject_name }}</div>
            <span v-else>{{ slotProps.placeholder }}</span>
          </template>
          <template #option="slotProps">
            <div>{{ slotProps.option.subject_name }}</div>
          </template>
        </Select>
        <small v-if="submitted && !exempted.subject_name" class="text-red-500">يجب ادخال اسم المادة</small>
      </div>
    </div>
    <template #footer>
      <Button label="الغاء" icon="pi pi-times" text @click="hideDialog" />
      <Button label="حفظ" icon="pi pi-check" @click="saveExempted" />
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
