<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-dt';
import 'datatables.net-colreorder-dt';
import 'datatables.net-responsive-dt';
import 'datatables.net-buttons';
import 'datatables.net-buttons/js/buttons.html5';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';
import Dialog from 'primevue/dialog';
import jszip from 'jszip';
import { deleteExempt, getStudentData, deleteCarryover, addCarryover, addExempt, addMark, editMark, getStudents, deleteStudentC, createStudent, updateStudent, deleteMarkC } from '@/controllers/students';
import { determineStage } from '@/controllers/general';

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
const route = useRoute();
const toast = useToast();
const info = { year: route.params.year, stage: route.params.stage }
const stage = determineStage(info.stage);
if (stage === null) {
  toast.add({ severity: 'warn', summary: 'حدث خطأ', detail: 'حدث خطأ', life: 5000 });
}
const cols = [
  { data: 'seq_in_college', title: 'التسلسل في الكلية', width: '5%' },
  { data: 'student_name', title: 'اسم الطالب', width: '30%' },
  { data: 'stage', title: 'المرحلة', width: '10%' },
  { data: 'student_id', title: 'رقم الطالب', width: '5%' },
  { data: 'state', title: 'الوضع', width: '30%' },
  {
    data: null,
    render: '#action',
    title: '',
    orderable: false,
    width: '20%'
  },
]
const carryoversCols = [
  { data: 'subject_name', title: 'المادة', width: "70%" },
  { data: null, render: '#carry_action', title: '', orderable: false, width: "30%" },
]
const exemptedCols = [
  { data: 'subject_name', title: 'المادة', width: "70%" },
  { data: null, render: '#exempt_action', title: '', orderable: false, width: "30%" },
]
const marksCols = [
  { data: 'subject_name', title: 'المادة', width: "30%" },
  { data: 'semester_mark', title: 'السعي', width: "13%" },
  { data: 'max_semester_mark', title: 'درجة السعي القصوى', width: "13%" },
  { data: 'final_mark', title: 'درجة الامتحان النهائي', width: "13%" },
  { data: 'max_final_exam', title: 'درجة النهائي القصوى', width: "13%" },
  { data: null, render: '#mark_action', title: '', orderable: false, width: "18%" },
]
const options = {
  colReorder: true,
  lengthMenu: [10, 50, 100, 500, { label: 'الكل', value: -1 }],
  responive: true,
  autoWidth: false,
  //stateSave: true,
  layout: {
    top2End: {
      buttons: ['csv', { extend: 'excel', text: 'Excel تصدير', className: 'excel_button' },
        info.stage === "all" ? {
          text: "Excel استيراد", name: "import_csv",
          action: function () {
            fileInput.value.click();
          }
        } : {}
      ]
    },
    top2Start: {
      buttons: [
        {
          text: "اضافة", name: "add", className: "add_button", action: function () {
            student.value = {};
            submitted.value = false;
            studentDialog.value = true;
          }
        }
      ],
    },
  },
  language: {
    url: "https://cdn.datatables.net/plug-ins/2.2.1/i18n/ar.json"
  }
}
const carryoverOpts = {
  responive: true,
  autoWidth: false,
  searching: false,
  paging: false,
  language: {
    url: "https://cdn.datatables.net/plug-ins/2.2.1/i18n/ar.json"
  },
  layout: {
    bottomStart: {},
    bottomEnd: {
      buttons: [
        {
          text: "اضافة", name: "add_carryover_button", className: "add_carry_button", action: function () {
            if (!addCarrySelect.value) {
              addCarrySelect.value = true;
            }
          }
        },
        {
          text: "حفظ", name: "save_carryover_button", className: "save_carry_button", action: async function () {
            carrySubmitted.value = true;
            if (carryover.value.subject) {
              const carryData = {
                student_id: extraStudent.value.student.student_id,
                subject_id: carryover.value.subject.subject_id,
              };
              const { newCarryover, err } = await addCarryover(info.year, carryData);
              if (err !== null) {
                toast.add({ severity: 'warn', summary: 'Fail', details: err || 'حدث خطأ', life: 10000 });
                return;
              } else if (newCarryover) {
                if (!Array.isArray(extraStudent.value.carryovers)) {
                  extraStudent.value.carryovers = [];
                }
                extraStudent.value.carryovers.push(newCarryover);
                toast.add({ severity: 'success', summary: 'Successful', detail: 'تم الانشاء', life: 4000 });
                carryover.value = {};
                carrySubmitted.value = false;
              }
            } else {
              toast.add({ severity: 'warn', summary: 'Fail', details: 'حدث خطأ', life: 5000 });
              return;
            }
          }
        },
        {
          text: "الغاء", name: "cancel_carryover_button", className: "cancel_carry_button", action: function () {
            carryover.value = ref({});
            addCarrySelect.value = false;
          }
        },
      ]
    }
  },
}
const exemptedOpts = {
  responive: true,
  autoWidth: false,
  searching: false,
  paging: false,
  language: {
    url: "https://cdn.datatables.net/plug-ins/2.2.1/i18n/ar.json"
  },
  layout: {
    bottomStart: {},
    bottomEnd: {
      buttons: [
        {
          text: "اضافة", name: "add_exempted_button", className: "add_exempt_button", action: function () {
            if (!addExemptSelect.value) {
              addExemptSelect.value = true;
            }
          }
        },
        {
          text: "حفظ", name: "save_exempted_button", className: "save_exempt_button", action: async function () {
            exemptSubmitted.value = true;
            if (exempt.value.subject) {
              const exemptData = {
                student_id: extraStudent.value.student.student_id,
                subject_id: exempt.value.subject.subject_id,
              };
              const { newExempt, err } = await addExempt(info.year, exemptData);
              if (err !== null) {
                toast.add({ severity: 'warn', summary: 'Fail', details: err || 'حدث خطأ', life: 10000 });
                return;
              } else if (newExempt) {
                if (!Array.isArray(extraStudent.value.exempteds)) {
                  extraStudent.value.exempteds = [];
                }
                extraStudent.value.exempteds.push(newExempt);
                toast.add({ severity: 'success', summary: 'Successful', detail: 'تم الانشاء', life: 4000 });
                exempt.value = {};
                exemptSubmitted.value = false;
              }
            } else {
              toast.add({ severity: 'warn', summary: 'Fail', details: 'حدث خطأ', life: 5000 });
              return;
            }
          }
        },
        {
          text: "الغاء", name: "cancel_exempted_button", className: "cancel_exempt_button", action: function () {
            exempt.value = ref({});
            addExemptSelect.value = false;
          }
        },
      ]
    }
  },
}
const marksOpts = {
  response: true,
  autoWidth: false,
  searching: false,
  paging: false,
  language: {
    url: "https://cdn.datatables.net/plug-ins/2.2.1/i18n/ar.json"
  },
  layout: {
    bottomStart: {},
    bottomEnd: {
      buttons: [
        {
          text: "اضافة", name: "add_mark_button", className: "add_mark_button", action: function () {
            if (!addMarkSelect.value) {
              addMarkSelect.value = true;
            }
          }
        },
        {
          text: "حفظ", name: "save_mark_button", className: "save_mark_button", action: async function () {
            markSubmitted.value = true;
            if (
              !mark?.value.subject ||
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
            if (!mark.value.id && !mark.value.index) {
              const markData = {
                student_id: extraStudent.value.student.student_id,
                subject_id: mark.value.subject.subject_id,
                semester_mark: mark.value.semester_mark,
                final_mark: mark.value.final_mark,
              };
              const { newMark, err } = await addMark(info.year, markData);
              if (err !== null) {
                toast.add({ severity: 'warn', summary: 'Fail', details: err || 'حدث خطأ', life: 10000 });
                return;
              } else if (newMark) {
                if (!Array.isArray(extraStudent.value.marks)) {
                  extraStudent.value.marks = [];
                }
                extraStudent.value.marks.push(newMark);
                toast.add({ severity: 'success', summary: 'Successful', detail: 'تم الانشاء', life: 4000 });
                mark.value = {};
                markSubmitted.value = false;
              }
            } else {
              const markData = {
                semester_mark: mark.value.semester_mark,
                final_mark: mark.value.final_mark,
              };
              const { newMark, err } = await editMark(info.year, mark.value.id, markData);
              if (err !== null) {
                toast.add({ severity: 'warn', summary: 'Fail', details: err || 'حدث خطأ', life: 10000 });
                return;
              } else if (newMark) {
                extraStudent.value.marks.splice(mark.value.index, 1, newMark);
                toast.add({ severity: 'success', summary: 'Successful', detail: 'تم الانشاء', life: 4000 });
                mark.value = {};
                markSubmitted.value = false;
              }
            }
          }
        },
        {
          text: "الغاء", name: "cancel_mark_button", className: "cancel_mark_button", action: function () {
            mark.value = ref({});
            addMarkSelect.value = false;
          }
        },
      ]
    }
  },
}
// pagination

// filtering
// getting
const data = ref({ students: [] })
const loading = ref(true);
onMounted(async () => {
  const info = await { year: route.params.year, stage: route.params.stage }
  const { students, err } = await getStudents(info.year, info.stage);
  if (err !== null) {
    toast.add({ severity: "warn", summary: "حدث حطأ", detail: err || 'حدث خطأ', life: 5000 });
    return;
  } else if (students) {
    data.value = students
  }
  loading.value = false;
});
// add and update
const student = ref({});
const studentDialog = ref(false);
const submitted = ref(false);
const hideDialog = () => {
  studentDialog.value = false;
  submitted.value = false;
};
const saveStudent = async () => {
  submitted.value = true;
  if (stage !== 'all') {
    student.value.stage = stage;
  }
  if (student?.value.student_name && student?.value.stage && student?.value.student_id && student?.value.state) {
    if (stage === 'all') {
      student.value.stage = student.value.stage.value;
    }
    student.value.state = student.value.state.value;
    if (!student.value.seq_in_college) {
      const { newStudent, err } = await createStudent(info.year, student.value);
      if (err !== null) {
        toast.add({ severity: 'warn', summary: 'Fail', details: err || 'حدث خطأ', life: 5000 });
        return;
      } else if (newStudent) {
        if (!Array.isArray(data.value.students)) {
          data.value.students = [];
        }
        data.value.students.push(newStudent);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'تم ادخال الطالب', life: 4000 });
        studentDialog.value = false;
        student.value = {};
      }
    } else if (student.value.seq_in_college && student.value.index >= 0) {
      const { index, seq_in_college, ...dataToSend } = student.value
      const { newStudent, err } = await updateStudent(info.year, student.value.student_id, dataToSend)
      if (err !== null) {
        toast.add({ severity: 'warn', summary: 'Fail', details: err || 'حدث خطأ', life: 5000 });
        return;
      } else if (newStudent) {
        data.value.students.splice(index, 1, newStudent);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'تم تحديث الطالب', life: 4000 });
        studentDialog.value = false;
        student.value = {};
      }
    }
  } else {
    toast.add({ severity: 'warn', summary: 'Fail', details: 'حدث خطأ', life: 5000 });
  }
};
// update
const editStudent = (index, rowData) => {
  student.value = { index, ...rowData };
  student.value.state = states.value.find((state) => state.value === student.value.state);
  student.value.stage = stages.value.find((stage) => stage.value === student.value.stage);
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
    const res = await deleteStudentC(info.year, student.value.student_id);
    if (res !== true) {
      toast.add({ severity: 'warn', summary: 'Fail', details: res || 'حدث خطأ', life: 5000 });
    } else {
      data.value.students = data.value.students.filter(val => val.student_id !== student.value.student_id);
      deleteStudentDialog.value = false;
      student.value = {};
      toast.add({ severity: 'success', summary: 'Successful', detail: 'تم حذف الطالب', life: 3000 });
    }
  } else {
    toast.add({ severity: 'warn', summary: 'Fail', details: 'حدث خطأ', life: 5000 });
  }
};
// import
const fileInput = ref(null);
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.name.endsWith('.xlsx')) {
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'يرجى اختيار ملف بصيغة csv', life: 3000 });
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`https://collegecm.work.gd/v1/students/import/${info.year}`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.add({ severity: 'warn', summary: 'Error', detail: errorData.error || 'فشل الاستيراد', life: 5000 });
    } else {
      const newData = await response.json();
      data.value.students = newData.students;
      toast.add({ severity: 'success', summary: 'Success', detail: 'تم اسيراد المواد بنجاح', life: 3000 });
      if (newData.errors) {
        Object.keys(newData.errors).forEach(key => {
          toast.add({ severity: 'warn', summary: 'لم يتم ادخال المواد التالية', detail: `${key}: ${newData.errors[key]}` })
        })
      }
    }
  } catch (error) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'فشل الاستيراد', life: 5000 });
    console.error('Error importing students:', error);
  } finally {
    fileInput.value.value = null;
  }
}
// extra
const extraStudent = ref({});
const extraDialog = ref(false);
const openExtraDialg = async (index, rowData) => {
  const studentData = await getStudentData(info.year, rowData.student_id);
  if (studentData === null) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'حدث خطأ', life: 5000 });
    return;
  }
  extraStudent.value = { ...studentData };
  extraDialog.value = true;
}
const deleteCarryDialog = ref(false);
const deleteExemptDialog = ref(false);
const deleteMarkDialog = ref(false);
const carryToDelete = ref(null);
const exemptToDelete = ref(null);
const markToDelete = ref(null);
const confirmDeleteCarry = (rowData) => {
  if (rowData?.id) {
    carryToDelete.value = rowData.id;
    deleteCarryDialog.value = true;
  } else {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'حدث خطأ', life: 5000 });
  }
};
const d1 = (rowData) => {
  if (rowData?.id) {
    exemptToDelete.value = rowData.id;
    deleteExemptDialog.value = true;
  } else {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'حدث خطأ', life: 5000 });
  }
};
const confirmDeleteMark = (rowData) => {
  if (rowData?.id) {
    markToDelete.value = rowData.id;
    deleteMarkDialog.value = true;
  } else {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'حدث خطأ', life: 5000 });
  }
}
const deleteExtraCarry = async () => {
  if (carryToDelete.value) {
    const res = await deleteCarryover(info.year, carryToDelete.value)
    if (res !== true) {
      toast.add({ severity: 'warn', summary: 'Fail', details: res || 'حدث خطأ', life: 10000 });
    } else {
      extraStudent.value.carryovers = extraStudent.value.carryovers.filter(val => val.id !== carryToDelete.value);
      deleteCarryDialog.value = false;
      carryToDelete.value = null;
      toast.add({ severity: 'success', summary: 'Successful', detail: 'تم الحذف', life: 3000 });
    }
  } else {
    toast.add({ severity: 'warn', summary: 'Fail', details: 'حدث خطأ', life: 5000 });
  }
};
const deleteExtraExempt = async () => {
  if (exemptToDelete.value) {
    const res = await deleteExempt(info.year, exemptToDelete.value)
    if (res !== true) {
      toast.add({ severity: 'warn', summary: 'Fail', details: res || 'حدث خطأ', life: 10000 });
    } else {
      extraStudent.value.exempteds = extraStudent.value.exempteds.filter(val => val.id !== exemptToDelete.value);
      deleteExemptDialog.value = false;
      exemptToDelete.value = null;
      toast.add({ severity: 'success', summary: 'Successful', detail: 'تم الحذف', life: 3000 });
    }
  } else {
    toast.add({ severity: 'warn', summary: 'Fail', details: 'حدث خطأ', life: 5000 });
  }
};
const deleteExtraMark = async () => {
  if (markToDelete.value) {
    const res = await deleteMarkC(info.year, markToDelete.value)
    if (res !== true) {
      toast.add({ severity: 'warn', summary: 'Fail', details: res || 'حدث خطأ', life: 10000 });
    } else {
      extraStudent.value.marks = extraStudent.value.marks.filter(val => val.id !== markToDelete.value);
      deleteMarkDialog.value = false;
      markToDelete.value = null;
      toast.add({ severity: 'success', summary: 'Successful', detail: 'تم الحذف', life: 3000 });
    }
  } else {
    toast.add({ severity: 'warn', summary: 'Fail', details: 'حدث خطأ', life: 5000 });
  }
};
const updateMark = (index, rowData) => {
  mark.value = { index, ...rowData };
  mark.value.subject = extraStudent.value.subjects.find((sub) => sub.subject_name === mark.value.subject_name);
  console.log(mark.value);
  addMarkSelect.value = true;
}
const addCarrySelect = ref(false);
const addExemptSelect = ref(false);
const addMarkSelect = ref(false);
const carryover = ref({});
const exempt = ref({});
const mark = ref({});
const carrySubmitted = ref(false);
const exemptSubmitted = ref(false);
const markSubmitted = ref(false);
</script>
<template>
  <Toast />
  <input type="file" ref="fileInput" hidden @change="handleFileUpload" accept=".xlsx" />
  <div v-if="loading">Loading</div>
  <DataTable v-else dir="rtl" :columns="cols" :data="data?.students" :options="options" class="cell-border">
    <template #action="props">
      <Button icon="pi pi-info" outlined rounded @click="openExtraDialg(props.rowIndex, props.rowData)"></Button>
      <Button icon="pi pi-pencil" outlined rounded class="mr-2"
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
      <div v-if="stage === 'all'">
        <label for="stage" class="block font-bold mb-3">المرحلة</label>
        <Select id="stage" v-model="student.stage" :options="stages" optionLabel="label" placeholder="اختر المرحلة"
          fluid></Select>
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
        <small v-if="submitted && !student.state" class="text-red-500">يجب ادخال الوضع</small>
      </div>
    </div>
    <template #footer>
      <Button label="الغاء" icon="pi pi-times" text @click="hideDialog" />
      <Button label="حفظ" icon="pi pi-check" @click="saveStudent" />
    </template>
  </Dialog>
  <Dialog dir="rtl" v-model:visible="extraDialog" class="w-11/12" :modal="true">
    <div class="flex flex-row justify-around">
      <h1 class="text-lg"><b>{{ extraStudent.student.student_name }}</b></h1>
      <div class="flex flex-col">
        <h1 clas="text-lg"><b>المرحلة {{ extraStudent.student.stage }}</b></h1>
      </div>
    </div>

    <div id="carryovers">
      <b>التحميل</b>
      <DataTable :data="extraStudent?.carryovers" :columns="carryoversCols" dir="rtl" class="cell-border"
        :options="carryoverOpts">
        <template #carry_action="props">
          <Button id="delete_carry" icon="pi pi-trash" outlined rounded severity="danger" class="mr-2 delete-carryover"
            @click="confirmDeleteCarry(props.rowData)" />
        </template>
      </DataTable>
      <div id="add_carry">
        <Select id="subject_name" v-if="addCarrySelect" v-model="carryover.subject" :options="extraStudent?.subjects"
          optionLabel="subject_name" filter placeholder="اختر المادة" fluid
          :invalid="carrySubmitted && !carryover.subject" required="true">
          <template #value="slotProps">
            <div v-if="slotProps.value">{{ slotProps.value.subject_name }}</div>
            <span v-else>{{ slotProps.placeholder }}</span>
          </template>
          <template #option="slotProps">
            <div>{{ slotProps.option.subject_name }}</div>
          </template>
        </Select>
        <small v-if="carrySubmitted && !carryover.subject" class="text-red-500">يجب ادخال اسم المادة</small>
      </div>
      <Dialog v-model:visible="deleteCarryDialog" :style="{ width: '450px' }" header="Confirm Carry" :modal="true">
        <div class="flex items-center gap-4">
          <i class="pi pi-exclamation-triangle !text-3xl" />
          <span v-if="extraStudent">؟<b>{{ extraStudent.student.student_name }}</b> هل انت متأكد من حذف</span>
        </div>
        <template #footer>
          <Button label="لا" icon="pi pi-times" text @click="deleteCarryDialog = false" />
          <Button label="نعم" icon="pi pi-check" @click="deleteExtraCarry" />
        </template>
      </Dialog>
    </div>

    <div id="exempted">
      <b>الاعفاء</b>
      <DataTable :data="extraStudent?.exempteds" :columns="exemptedCols" dir="rtl" class="cell-border"
        :options="exemptedOpts">
        <template #exempt_action="props">
          <Button id="delete_exempt" icon="pi pi-trash" outlined rounded severity="danger" class="mr-2 delete-exempted"
            @click="d1(props.rowData)" />
        </template>
      </DataTable>
      <div id="add_exempt">
        <Select id="subject_name" v-if="addExemptSelect" v-model="exempt.subject" :options="extraStudent?.subjects"
          optionLabel="subject_name" filter placeholder="اختر المادة" fluid
          :invalid="exemptSubmitted && !exempt.subject" required="true">
          <template #value="slotProps">
            <div v-if="slotProps.value">{{ slotProps.value.subject_name }}</div>
            <span v-else>{{ slotProps.placeholder }}</span>
          </template>
          <template #option="slotProps">
            <div>{{ slotProps.option.subject_name }}</div>
          </template>
        </Select>
        <small v-if="exemptSubmitted && !exempt.subject" class="text-red-500">يجب ادخال اسم المادة</small>
      </div>
      <Dialog v-model:visible="deleteExemptDialog" :style="{ width: '450px' }" header="Confirm Exempt" :modal="true">
        <div class="flex items-center gap-4">
          <i class="pi pi-exclamation-triangle !text-3xl" />
          <span v-if="extraStudent">؟<b>{{ extraStudent.student.student_name }}</b> هل انت متأكد من حذف</span>
        </div>
        <template #footer>
          <Button label="لا" icon="pi pi-times" text @click="deleteExemptDialog = false" />
          <Button label="نعم" icon="pi pi-check" @click="deleteExtraExempt" />
        </template>
      </Dialog>
    </div>

    <div id="marks">
      <b>الدرجات</b>
      <DataTable :data="extraStudent?.marks" :columns="marksCols" dir="rtl" class="cell-border" :options="marksOpts">
        <template #mark_action="props">
          <Button icon="pi pi-pencil" outlined rounded class="mr-2"
            @click="updateMark(props.rowIndex, props.rowData)"></Button>
          <Button id="delete_exempt" icon="pi pi-trash" outlined rounded severity="danger" class="mr-2 delete-exempted"
            @click="confirmDeleteMark(props.rowData)" />
        </template>
      </DataTable>
      <div id="add_mark" class="flex flex-row">
        <div>
          <label v-if="addMarkSelect" for="subject_name" class="block font-bold mb-3">المادة</label>
          <Select id="subject_name" v-if="addMarkSelect" v-model="mark.subject" :options="extraStudent?.subjects"
            optionLabel="subject_name" filter placeholder="اختر المادة" fluid :invalid="markSubmitted && !mark.subject"
            required="true">
            <template #value="slotProps">
              <div v-if="slotProps.value">{{ slotProps.value.subject_name }}</div>
              <span v-else>{{ slotProps.placeholder }}</span>
            </template>
            <template #option="slotProps">
              <div>{{ slotProps.option.subject_name }}</div>
            </template>
          </Select>
          <small v-if="markSubmitted && !mark.subject" class="text-red-500">يجب ادخال اسم المادة</small>
        </div>
        <div>
          <label v-if="addMarkSelect" for="semester_mark" class="block font-bold mb-3">درجة السعي</label>
          <InputNumber v-if="addMarkSelect" id="semester_mark" v-model.trim.number="mark.semester_mark"
            :invalid="markSubmitted && mark.semester_mark < 0" fluid />
          <small v-if="markSubmitted && mark.semester_mark < 0" class="text-red-500">يجب ان يكون صفر او اكبر</small>
        </div>
        <div>
          <label v-if="addMarkSelect" for="final_mark" class="block font-bold mb-3">درجة الامتحان النهائي</label>
          <InputNumber v-if="addMarkSelect" id="final_mark" v-model.trim.number="mark.final_mark"
            :invalid="markSubmitted && mark.final_mark < 0" fluid />
          <small v-if="markSubmitted && mark.final_mark < 0" class="text-red-500">يجب ان يكون صفر او اكبر</small>
        </div>
      </div>
      <Dialog v-model:visible="deleteMarkDialog" :style="{ width: '450px' }" header="Confirm Mark" :modal="true">
        <div class="flex items-center gap-4">
          <i class="pi pi-exclamation-triangle !text-3xl" />
          <span v-if="extraStudent">؟<b>{{ extraStudent.student.student_name }}</b> هل انت متأكد من حذف</span>
        </div>
        <template #footer>
          <Button label="لا" icon="pi pi-times" text @click="deleteMarkDialog = false" />
          <Button label="نعم" icon="pi pi-check" @click="deleteExtraMark" />
        </template>
      </Dialog>
    </div>

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

div.dt-buttons>.dt-button.excel_button,
div.dt-buttons>.dt-button.add_button {
  display: inline-flex;
  cursor: pointer;
  user-select: none;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  color: var(--p-button-primary-color);
  background: var(--p-button-primary-background);
  border: 1px solid var(--p-button-primary-border-color);
  padding: var(--p-button-padding-y) var(--p-button-padding-x);
  font-size: 1rem;
  font-family: inherit;
  font-feature-settings: inherit;
  transition: background var(--p-button-transition-duration), color var(--p-button-transition-duration), border-color var(--p-button-transition-duration), outline-color var(--p-button-transition-duration), box-shadow var(--p-button-transition-duration);
  border-radius: var(--p-button-border-radius);
  outline-color: transparent;
  gap: var(--p-button-gap);
}

div.dt-buttons>.dt-button.add_button {
  margin-left: 12px;
}
</style>
