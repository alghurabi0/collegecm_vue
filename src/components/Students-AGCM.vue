<script setup>
import { ref, onMounted } from 'vue';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-dt';
import 'datatables.net-colreorder-dt';
import 'datatables.net-responsive-dt';
import 'datatables.net-buttons';
import 'datatables.net-buttons/js/buttons.html5';
//import IconField from 'primevue/iconfield';
//import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useToast } from 'primevue';
import Toolbar from 'primevue/toolbar';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';
import Dialog from 'primevue/dialog';
import jszip from 'jszip';

DataTable.use(DataTablesCore);
DataTablesCore.Buttons.jszip(jszip);
// defs
const stages = ref([
  { label: 'الاولى', value: 'الاولى' },
  { label: 'الثانية', value: 'الثانية' },
  { label: 'الثالثة', value: 'الثالثة' },
  { label: 'الرابعة', value: 'الرابعة' },
  { label: 'الخامسة', value: 'الخامسة' },
  { label: 'السادسة', value: 'السادسة' },
]);
const states = ref([
  { label: 'مستمر على الدراسة', value: 'مستمر على الدراسة' },
  { label: 'استضافة في جامعة اخرى', value: 'استضافة في جامعة اخرى' },
])
// global
const toast = useToast();
const cols = [
  { data: 'seq_in_college', title: 'التسلسل في الكلية' },
  { data: 'student_name', title: 'اسم الطالب' },
  { data: 'stage', title: 'المرحلة' },
  { data: 'student_id', title: 'رقم الطالب' },
  { data: 'state', title: 'الوضع' },
  {
    data: null,
    render: '#action',
    title: 'Action',
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
    topStart: 'buttons'
  },
}
let dt;
const table = ref();
// pagination

// filtering
// getting
const data = ref(null)
onMounted(async () => {
  try {
    dt = table.value.dt;
    const response = await fetch('https://collegecm.work.gd/v1/students')
    if (!response.ok) throw new Error('Network response was not ok')
    data.value = await response.json();
  } catch (error) {
    console.error('Error fetching data:', error)
  }
});
// add and update
const student = ref({});
const studentDialog = ref(false);
const submitted = ref(false);
const openStudentDialog = () => {
  student.value = {};
  submitted.value = false;
  studentDialog.value = true;
};
const hideDialog = () => {
  studentDialog.value = false;
  submitted.value = false;
};
const saveStudent = async () => {
  submitted.value = true;
  if (student?.value.student_name && student?.value.stage && student?.value.student_id && student?.value.state) {
    student.value.stage = student.value.stage.value;
    student.value.state = student.value.state.value;
    if (!student.value.seq_in_college) {
      try {
        const response = await fetch('https://collegecm.work.gd/v1/students', {
          method: 'POST',
          body: JSON.stringify(student.value),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          const errorData = await response.json();
          toast.add({ severity: 'danger', summary: 'Fail', details: errorData.error || 'حدث خطأ', life: 10000 });
        } else {
          if (!Array.isArray(data.value.students)) {
            data.value.students = [];
          }
          const newStudent = await response.json();
          data.value.students.push(newStudent.student);
          toast.add({ severity: 'success', summary: 'Successful', detail: 'تم انشاء المادة', life: 4000 });
          studentDialog.value = false;
          student.value = {};
        }
      } catch (err) {
        toast.add({ severity: 'danger', summary: 'Fail', details: 'حدث خطأ', life: 5000 });
        console.log(err);
      }
    } else if (student.value.seq_in_college && student.value.index) {
      try {
        const { index, seq_in_college, ...dataToSend } = student.value
        const response = await fetch(`https://collegecm.work.gd/v1/students/${student.value.student_id}`, {
          method: 'PATCH',
          body: JSON.stringify(dataToSend),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          const errorData = await response.json();
          toast.add({ severity: 'danger', summary: 'Fail', details: errorData.error || 'حدث خطأ', life: 10000 });
        } else {
          const newData = await response.json();
          data.value.students.splice(index, 1, newData.student);
          toast.add({ severity: 'success', summary: 'Successful', detail: 'تم انشاء المادة', life: 4000 });
          studentDialog.value = false;
          student.value = {};
        }
      } catch (err) {
        toast.add({ severity: 'danger', summary: 'Fail', details: 'حدث خطأ', life: 5000 });
        console.log(err);
      }
    }
  }
};
// update
const editStudent = (index, rowData) => {
  student.value = { index, ...rowData };
  student.value.state = states.value.find((state) => state.value = student.value.state);
  student.value.stage = stages.value.find((stage) => stage.value = student.value.stage);
  studentDialog.value = true;
}
// delete
const deleteStudentDialog = ref(false);
const confirmDeleteStudent = (stud) => {
  student.value = stud;
  deleteStudentDialog.value = true;
};
const deleteStudent = async () => {
  if (student?.value.student_id) {
    try {
      const response = await fetch(`https://collegecm.work.gd/v1/students/${student.value.student_id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        toast.add({ severity: 'danger', summary: 'Fail', details: errorData.error || 'حدث خطأ', life: 10000 });
      } else {
        data.value.students = data.value.students.filter(val => val.student_id !== student.value.student_id);
        deleteStudentDialog.value = false;
        student.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'تم حذف الطالب', life: 3000 });
      }
    } catch (err) {
      toast.add({ severity: 'danger', summary: 'Fail', details: 'حدث خطأ', life: 5000 });
      console.error(err);
    }
  }
};
</script>
<template>
  <Toolbar class="mb-6">
    <template #start>
      <Button label="اضافة" icon="pi pi-plus" class="mr-2" @click="openStudentDialog" />
    </template>
    <template #end>
    </template>
  </Toolbar>
  <DataTable dir="rtl" :columns="cols" :data="data?.students" ref="table" :options="options" class="cell-border">
    <template #action="props">
      <Button icon="pi pi-pencil" outlined rounded class=""
        @click="editStudent(props.rowIndex, props.rowData)"></Button>
      <Button icon="pi pi-trash" outlined rounded severity="danger" class="mr-2"
        @click="confirmDeleteStudent(props.rowData)" />
    </template>
  </DataTable>
  <Dialog v-model:visible="deleteStudentDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
    <div class="flex items-center gap-4">
      <i class="pi pi-exclamation-triangle !text-3xl" />
      <span v-if="student">؟<b>{{ student.student_name }}</b> هل انت متأكد من حذف</span>
    </div>
    <template #footer>
      <Button label="لا" icon="pi pi-times" text @click="deleteStudentDialog = false" />
      <Button label="نعم" icon="pi pi-check" @click="deleteStudent" />
    </template>
  </Dialog>
  <Dialog dir="rtl" v-model:visible="studentDialog" class="w-4/5 md:w-3/5" header="تفاصيل الطالب" :modal="true">
    <div class="flex flex-col gap-6">
      <div>
        <label for="student_name" class="block font-bold mb-3">اسم الطالب</label>
        <InputText id="student_name" v-model.trim="student.student_name" required="true" />
        <small v-if="submitted && !student.student_name" class="text-red-500">يجب ادخال اسم المادة</small>
      </div>
      <div>
        <label for="stage" class="block font-bold mb-3">المرحلة</label>
        <Select id="stage" v-model="student.stage" :options="stages" optionLabel="label" optionsValue="value"
          placeholder="اختر المرحلة" fluid></Select>
        <small v-if="submitted && !student.stage" class="text-red-500">يجب ادخال المرحلة</small>
      </div>
      <div>
        <label for="student_id" class="block font-bold mb-3">رقم الطالب</label>
        <InputNumber id="student_id" v-model.trim.number="student.student_id" required="true" autofocus
          :invalid="submitted && (student.student_id === null || student.student_id === undefined || student.student_id < 0)"
          fluid />
        <small
          v-if="submitted && (student.student_id === null || student.student_id === undefined || student.student_id < 0)"
          class="text-red-500">يجب ادخال رقم
          المادة</small>
      </div>
      <div>
        <label for="state" class="block font-bold mb-3">الوضع</label>
        <Select id="state" v-model="student.state" :options="states" optionLabel="label" optionsValue="value"
          placeholder="اختر الفصل" fluid></Select>
        <small v-if="submitted && !student.state" class="text-red-500">يجب ادخال الفصل</small>
      </div>
    </div>
    <template #footer>
      <Button label="الغاء" icon="pi pi-times" text @click="hideDialog" />
      <Button label="حفظ" icon="pi pi-check" @click="saveStudent" />
    </template>
  </Dialog>
</template>

<style>
@import 'datatables.net-buttons-dt';
@import 'datatables.net-dt';
@import 'datatables.net-colreorder-dt';
@import 'datatables.net-responsive-dt';

table.dataTable thead th {
  text-align: right;
}
</style>
