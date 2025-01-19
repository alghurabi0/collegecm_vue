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
import InputNumber from 'primevue/inputnumber';
import jszip from 'jszip';

DataTable.use(DataTablesCore);
DataTablesCore.Buttons.jszip(jszip);
// global
const data = ref({})
const mark = ref({});
const students = ref(null);
const subjects = ref(null);
const toast = useToast();
let dt;
const table = ref();
const cols = [
  { data: 'id', title: 'التسلسل' },
  { data: 'student_name', title: 'اسم الطالب' },
  { data: 'subject_name', title: 'المادة' },
  { data: 'semester_mark', title: 'درجة السعي' },
  { data: 'final_mark', title: 'درجة الامتحان النهائي' },
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
            mark.value = {};
            submitted.value = false;
            markDialog.value = true;
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
    // marks
    const response = await fetch('https://collegecm.work.gd/v1/marks')
    if (!response.ok) throw new Error('Network response was not ok')
    const jsonResponse = await response.json();
    if (jsonResponse.marks !== null) {
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
const markDialog = ref(false);
const submitted = ref(false);
const hideDialog = () => {
  markDialog.value = false;
  submitted.value = false;
};
const saveMark = async () => {
  submitted.value = true;
  if (
    !mark?.value.student_name ||
    !mark?.value.subject_name ||
    mark?.value.semester_mark < 0 ||
    mark?.value.final_mark < 0
  ) {
    toast.add({
      severity: 'warn',
      summary: 'Validation Failed',
      detail: 'تأكد من تعبئة جميع الحقول بشكل صحيح',
      life: 5000,
    });
    return; // Exit early if validation fails
  }
  if (!mark.value.id) {
    mark.value.student_id = mark.value.student_name.student_id;
    mark.value.subject_id = mark.value.subject_name.subject_id;
    const { student_name, subject_name, ...dataToSend } = mark.value;
    try {
      const response = await fetch('https://collegecm.work.gd/v1/marks', {
        method: 'POST',
        body: JSON.stringify(dataToSend),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        toast.add({ severity: 'danger', summary: 'Fail', details: errorData.error || 'حدث خطأ', life: 10000 });
      } else {
        if (!Array.isArray(data.value.marks)) {
          data.value.marks = [];
        }
        const newMark = await response.json();
        data.value.marks.push(newMark.mark);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'تم الانشاء', life: 4000 });
        markDialog.value = false;
        mark.value = {};
      }
    } catch (err) {
      toast.add({ severity: 'danger', summary: 'Fail', details: 'حدث خطأ', life: 5000 });
      console.log(err);

    }
  } else {
    const { index, id, student_name, subject_name, student_id, subject_id, ...dataToSend } = mark.value;
    try {
      const response = await fetch(`https://collegecm.work.gd/v1/marks/${id}`, {
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
        const newMark = await response.json();
        data.value.marks.splice(index, 1, newMark.mark);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'تم الانشاء', life: 4000 });
        markDialog.value = false;
        mark.value = {};
      }
    } catch (err) {
      toast.add({ severity: 'danger', summary: 'Fail', details: 'حدث خطأ', life: 5000 });
      console.log(err);

    }
  }
}
// update
const editStudent = (index, rowData) => {
  mark.value = { index, ...rowData };
  mark.value.student_name = students.value.students.find((stud) => stud.student_name = mark.value.student_name);
  mark.value.subject_name = subjects.value.subjects.find((sub) => sub.subject_name = mark.value.subject_name);
  markDialog.value = true;
}
// delete
const deleteMarkDialog = ref(false);
const confirmDeleteMark = (carry) => {
  mark.value = carry;
  deleteMarkDialog.value = true;
};
const deleteMark = async () => {
  if (mark?.value.id) {
    try {
      const response = await fetch(`https://collegecm.work.gd/v1/marks/${mark.value.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        toast.add({ severity: 'danger', summary: 'Fail', details: errorData.error || 'حدث خطأ', life: 10000 });
      } else {
        data.value.marks = data.value.marks.filter(val => val.id !== mark.value.id);
        deleteMarkDialog.value = false;
        mark.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'تم الحذف', life: 3000 });
      }
    } catch (err) {
      toast.add({ severity: 'danger', summary: 'Fail', details: 'حدث خطأ', life: 5000 });
      console.error(err);
    }
  } else {
    toast.add({ severity: 'danger', summary: 'Fail', details: 'حدث خطأ', life: 5000 });
  }
};
</script>
<template>
  <DataTable dir="rtl" :columns="cols" :data="data?.marks" ref="table" :options="options" class="cell-border">
    <template #action="props">
      <Button icon="pi pi-pencil" outlined rounded class=""
        @click="editStudent(props.rowIndex, props.rowData)"></Button>
      <Button icon="pi pi-trash" outlined rounded severity="danger" class="mr-2"
        @click="confirmDeleteMark(props.rowData)" />
    </template>
  </DataTable>
  <Dialog v-model:visible="deleteMarkDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
    <div class="flex items-center gap-4">
      <i class="pi pi-exclamation-triangle !text-3xl" />
      <span v-if="mark">؟<b>{{ mark.subject_name }}</b> لمادة <b>{{ mark.student_name }}</b> هل انت متأكد
        من حذف</span>
    </div>
    <template #footer>
      <Button label="لا" icon="pi pi-times" text @click="deleteMarkDialog = false" />
      <Button label="نعم" icon="pi pi-check" @click="deleteMark" />
    </template>
  </Dialog>
  <Dialog dir="rtl" v-model:visible="markDialog" class="w-4/5 md:w-3/5" header="التفاصيل" :modal="true">
    <div class="flex flex-col gap-6">
      <div>
        <label for="student_name" class="block font-bold mb-3">اسم الطالب</label>
        <Select id="student_name" v-model="mark.student_name" :options="students?.students" optionLabel="student_name"
          filter placeholder="اختر الطالب" fluid :invalid="submitted && !mark.student_name" required="true">
          <template #value="slotProps">
            <div v-if="slotProps.value">{{ slotProps.value.student_name }}</div>
            <span v-else>{{ slotProps.placeholder }}</span>
          </template>
          <template #option="slotProps">
            <div>{{ slotProps.option.student_name }}</div>
          </template>
        </Select>
        <small v-if="submitted && !mark.student_name" class="text-red-500">يجب ادخال اسم الطالب</small>
        <label for="subject_name" class="block font-bold mb-3">اسم المادة</label>
        <Select id="subject_name" v-model="mark.subject_name" :options="subjects?.subjects" optionLabel="subject_name"
          filter placeholder="اختر المادة" fluid :invalid="submitted && !mark.subject_name" required="true">
          <template #value="slotProps">
            <div v-if="slotProps.value">{{ slotProps.value.subject_name }}</div>
            <span v-else>{{ slotProps.placeholder }}</span>
          </template>
          <template #option="slotProps">
            <div>{{ slotProps.option.subject_name }}</div>
          </template>
        </Select>
        <small v-if="submitted && !mark.subject_name" class="text-red-500">يجب ادخال اسم المادة</small>
        <label for="semester_mark" class="block font-bold mb-3">درجة السعي</label>
        <InputNumber id="semester_mark" v-model.trim.number="mark.semester_mark"
          :invalid="submitted && mark.semester_mark < 0" fluid />
        <small v-if="submitted && mark.semester_mark < 0" class="text-red-500">يجب ان يكون صفر او اكبر</small>
        <label for="final_mark" class="block font-bold mb-3">درجة الامتحان النهائي</label>
        <InputNumber id="semester_mark" v-model.trim.number="mark.final_mark"
          :invalid="submitted && mark.final_mark < 0" fluid />
        <small v-if="submitted && mark.final_mark < 0" class="text-red-500">يجب ان يكون صفر او اكبر</small>
      </div>
    </div>
    <template #footer>
      <Button label="الغاء" icon="pi pi-times" text @click="hideDialog" />
      <Button label="حفظ" icon="pi pi-check" @click="saveMark" />
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
