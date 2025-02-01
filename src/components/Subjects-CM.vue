<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { FilterMatchMode } from '@primevue/core/api'
import InputIcon from 'primevue/inputicon';
import IconField from 'primevue/iconfield';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';
import Tag from 'primevue/tag';
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
//import ColumnGroup from 'primevue/columngroup';   // optional
// import Row from 'primevue/row';                   // optional
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router';
import { createSubject, deleteSubjectC, getSubjects, updateSubject } from '@/controllers/students';

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const statuses = ref([
  { label: 'نعم', value: 'نعم' },
  { label: 'لا', value: 'لا' },
]);
const getStatusLabel = (status) => {
  switch (status) {
    case 'نعم':
      return 'success';

    case 'لا':
      return 'danger';

    default:
      return null;
  }
};
const stages = ref([
  { label: 'الاولى', value: 'الاولى' },
  { label: 'الثانية', value: 'الثانية' },
  { label: 'الثالثة', value: 'الثالثة' },
  { label: 'الرابعة', value: 'الرابعة' },
  { label: 'الخامسة', value: 'الخامسة' },
  { label: 'السادسة', value: 'السادسة' },
]);
const semesters = ref([
  { label: 'الاول', value: 'الاول' },
  { label: 'الثاني', value: 'الثاني' },
]);
const toast = useToast();
const route = useRoute();
const info = { year: route.params.year, stage: route.params.stage };
// file upload
const fileInput = ref(null);
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.match('text/csv')) {
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'Please upload a CSV file.', life: 3000 });
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('https://collegecm.work.gd/v1/subjects/import', { // Adjust the endpoint URL
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.add({ severity: 'warn', summary: 'Error', detail: errorData.error || 'Import failed.', life: 5000 });
    } else {
      // Update the data table after successful import
      const newData = await response.json();
      data.value.subjects = newData.subjects; // Assuming the response contains the updated subjects array
      toast.add({ severity: 'success', summary: 'Success', detail: 'Subjects imported successfully.', life: 2000 });
      if (newData.errors) {
        Object.keys(newData.errors).forEach(key => {
          toast.add({ severity: 'warn', summary: 'لم يتم ادخال المواد التالية', detail: `${key}: ${newData.errors[key]}` })
        })
      }
    }
  } catch (error) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Import failed.', life: 5000 });
    console.error('Error importing subjects:', error);
  } finally {
    fileInput.value.value = null; // Clear the file input
  }
};
// editing rows
const editingRows = ref([]);
const onRowEditSave = async (event) => {
  let { newData, data: rowData } = event;
  const index = data.value.subjects.findIndex(subject => subject.subject_id === rowData.subject_id);
  if (index === -1) {
    toast.add({ severity: 'warn', summary: 'Fail', details: 'حدث خطأ', life: 5000 });
    return;
  }
  const { newSubject, err } = await updateSubject(info.year, rowData.subject_id, newData);
  if (err !== null) {
    toast.add({ severity: 'warn', summary: 'Fail', details: err || 'حدث خطأ', life: 5000 });
    return;
  } else {
    // Update the UI if the request was successful
    data.value.subjects.splice(index, 1, newData);
  }
}

const data = ref(null)
const loading = ref(true);
onMounted(async () => {
  const info = await { year: route.params.year, stage: route.params.stage }
  const { subjects, err } = await getSubjects(info.year, info.stage);
  if (err !== null) {
    toast.add({ severity: "warn", summary: "حدث خطأ", detail: err || "حدث خطأ", life: 5000 });
    return;
  } else {
    data.value = subjects;
    loading.value = false;
  }
})
const rowsPerPageOptions = computed(() => {
  const options = [5, 10, 20, 50, 200];
  if (data.value && data.value.subjects) {
    options.push(data.value.subjects.length); // Add "Show All" option
  }
  return options;
});
// adding a subject
const subject = ref({});
const subjectDialog = ref(false);
const submitted = ref(false);
const openNew = () => {
  subject.value = {};
  submitted.value = false;
  subjectDialog.value = true;
};
const hideDialog = () => {
  subjectDialog.value = false;
  submitted.value = false;
};
const saveSubject = async () => {
  submitted.value = true;
  if (subject?.value.subject_id && subject.value.stage && subject.value.semester && subject.value.active && subject.value.ministerial) {
    subject.value.stage = subject.value.stage.value;
    subject.value.semester = subject.value.semester.value;
    subject.value.active = subject.value.active.value;
    subject.value.ministerial = subject.value.ministerial.value;
    const { newSubject, err } = await createSubject(info.year, subject.value);
    if (err !== null) {
      toast.add({ severity: 'warn', summary: 'Fail', details: err || 'حدث خطأ', life: 5000 });
      return;
    } else {
      data.value.subjects.push(subject.value);
      toast.add({ severity: 'success', summary: 'Successful', detail: 'تم انشاء المادة', life: 4000 });
      subjectDialog.value = false;
      subject.value = {};
    }
  } else {
    toast.add({ severity: 'warn', summary: 'Fail', details: 'حدث خطأ', life: 5000 });
  }
};
// delete subject
const deleteSubjectDialog = ref(false);
const confirmDeleteSubject = (subj) => {
  subject.value = subj;
  deleteSubjectDialog.value = true;
};
const deleteSubject = async () => {
  if (subject?.value.subject_id) {
    const response = await deleteSubjectC(info.year, subject.value.subject_id);
    if (response !== true) {
      toast.add({ severity: 'warn', summary: 'Fail', details: response || 'حدث خطأ', life: 10000 });
    } else {
      data.value.subjects = data.value.subjects.filter(val => val.subject_id !== subject.value.subject_id);
      deleteSubjectDialog.value = false;
      subject.value = {};
      toast.add({ severity: 'success', summary: 'Successful', detail: 'تم حذف المادة بنجاح', life: 3000 });
    }
  }
};

// export
const dt = ref();
const exportCSV = () => {
  dt.value.exportCSV();
};
</script>

<template>
  <Toast />
  <Toolbar class="mb-6">
    <template #start>
      <Button label="اضافة" icon="pi pi-plus" class="mr-2" @click="openNew" />
    </template>
    <template #end>
      <input type="file" ref="fileInput" hidden @change="handleFileUpload" accept=".csv" />
      <Button label="استيراد" icon="pi pi-download" severity="secondary" @click="fileInput.click()" class="mr-2" />
      <Button label="تصدير" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
    </template>
  </Toolbar>
  <DataTable dir="rtl" ref="dt" stateStorage="session" stateKey="dt-state-subjects-session" sortField="subject_id"
    :sortOrder="1" removableSort :value="data?.subjects" size="small" showGridlines tableStyle="min-width: 50rem"
    paginator :rows="10" :rowsPerPageOptions="rowsPerPageOptions" :loading="loading" v-model:filters="filters"
    dataKey="subject_id" v-model:editingRows="editingRows" editMode="row" @row-edit-save="onRowEditSave"
    resizableColumns>
    <template #footer>Hello world</template>

    <template #header>
      <div class="flex justify-end mr-5 justify-self-start">
        <IconField>
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText id="search" v-model="filters['global'].value" placeholder="بحث" />
        </IconField>
      </div>
    </template>
    <template #empty> لا يوجد مواد </template>
    <template #loading> يتم تحميل المواد, يرجى الانتظار </template>
    <Column field="subject_id" header="رقم المادة" sortable>
      <template #editor="{ data, field }">
        <InputNumber v-model="data[field]" fluid />
      </template>
    </Column>
    <Column field="subject_name" header="أسم المادة" sortable>
      <template #editor="{ data, field }">
        <InputText v-model="data[field]" fluid />
      </template>
    </Column>
    <Column field="subject_name_english" header="أسم المادة بالانكليزي" sortable>
      <template #editor="{ data, field }">
        <InputText v-model="data[field]" fluid />
      </template>
    </Column>
    <Column field="stage" header="المرحلة" sortable>
      <template #editor="{ data, field }">
        <Select v-model="data[field]" :options="stages" optionLabel="label" optionValue="value" fluid>
        </Select>
      </template>
    </Column>
    <Column field="semester" header="الفصل" sortable>
      <template #editor="{ data, field }">
        <Select v-model="data[field]" :options="semesters" optionLabel="label" optionValue="value" fluid>
        </Select>
      </template>
    </Column>
    <Column field="department" header="القسم" sortable>
      <template #editor="{ data, field }">
        <InputText v-model="data[field]" fluid />
      </template>
    </Column>
    <Column field="max_theory_mark" header="درجة النظري" sortable>
      <template #editor="{ data, field }">
        <InputNumber v-model="data[field]" fluid />
      </template>
    </Column>
    <Column field="max_lab_mark" header="درجة العملي" sortable>
      <template #editor="{ data, field }">
        <InputNumber v-model="data[field]" fluid />
      </template>
    </Column>
    <Column field="max_semester_mark" header="السعي" sortable>
      <template #editor="{ data, field }">
        <InputNumber v-model="data[field]" fluid />
      </template>
    </Column>
    <Column field="max_final_exam" header="درجة الامتحان" sortable>
      <template #editor="{ data, field }">
        <InputNumber v-model="data[field]" fluid />
      </template>
    </Column>
    <Column field="credits" header="الوحدات" sortable>
      <template #editor="{ data, field }">
        <InputNumber v-model="data[field]" fluid />
      </template>
    </Column>
    <Column field="active" header="مفعل" sortable>
      <template #body="slotProps">
        <Tag :value="slotProps.data.active" :severity="getStatusLabel(slotProps.data.active)" />
      </template>
      <template #editor="{ data, field }">
        <Select v-model="data[field]" :options="statuses" optionLabel="label" optionValue="value"
          placeholder="اختر الحالة" fluid>
          <template #option="slotProps">
            <Tag :value="slotProps.option.value" :severity="getStatusLabel(slotProps.option.value)" />
          </template>
        </Select>
      </template>
    </Column>
    <Column field="ministerial" header="وزاري" sortable>
      <template #body="slotProps">
        <Tag :value="slotProps.data.ministerial" :severity="getStatusLabel(slotProps.data.ministerial)" />
      </template>
      <template #editor="{ data, field }">
        <Select v-model="data[field]" :options="statuses" optionLabel="label" optionValue="value"
          placeholder="اختر الحالة" fluid>
          <template #option="slotProps">
            <Tag :value="slotProps.option.value" :severity="getStatusLabel(slotProps.option.value)" />
          </template>
        </Select>
      </template>
    </Column>
    <Column :rowEditor="true" class="w-5">
    </Column>
    <Column :exportable="false" class="w-5">
      <template #body="slotProps">
        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteSubject(slotProps.data)" />
      </template>
    </Column>
  </DataTable>
  <Dialog dir="rtl" v-model:visible="subjectDialog" class="w-2/5" header="تفاصيل المادة" :modal="true">
    <div class="flex flex-col gap-6">
      <div>
        <label for="subject_id" class="block font-bold mb-3">رقم المادة</label>
        <InputNumber id="subject_name" v-model.trim.number="subject.subject_id" required="true" autofocus
          :invalid="submitted && (subject.subject_id === null || subject.subject_id === undefined || subject.subject_id < 0)"
          fluid />
        <small
          v-if="submitted && (subject.subject_id === null || subject.subject_id === undefined || subject.subject_id < 0)"
          class="text-red-500">يجب ادخال رقم
          المادة</small>
      </div>
      <div>
        <label for="subject_name" class="block font-bold mb-3">اسم المادة</label>
        <InputText id="subject_name" v-model.trim="subject.subject_name" required="true" />
        <small v-if="submitted && !subject.subject_name" class="text-red-500">يجب ادخال اسم المادة</small>
      </div>
      <div>
        <label for="subject_name_english" class="block font-bold mb-3">اسم المادة بالانكليزي</label>
        <InputText id="subject_name_english" v-model.trim="subject.subject_name_english" required="true" />
        <small v-if="submitted && !subject.subject_name_english" class="text-red-500">يجب ادخال اسم المادة
          بالانكليزي</small>
      </div>
      <div>
        <label for="stage" class="block font-bold mb-3">المرحلة</label>
        <Select id="stage" v-model="subject.stage" :options="stages" optionLabel="label" optionsValue="value"
          placeholder="اختر المرحلة" fluid></Select>
        <small v-if="submitted && !subject.stage" class="text-red-500">يجب ادخال المرحلة</small>
      </div>
      <div>
        <label for="semester" class="block font-bold mb-3">الفصل</label>
        <Select id="semester" v-model="subject.semester" :options="semesters" optionLabel="label" optionsValue="value"
          placeholder="اختر الفصل" fluid></Select>
        <small v-if="submitted && !subject.semester" class="text-red-500">يجب ادخال الفصل</small>
      </div>
      <div>
        <label for="department" class="block font-bold mb-3">القسم</label>
        <InputText id="department" v-model.trim="subject.department" required="true" />
        <small v-if="submitted && !subject.department" class="text-red-500">يجب ادخال القسم</small>
      </div>
      <div>
        <label for="max_theory_mark" class="block font-bold mb-3">درجة النظري</label>
        <InputNumber id="max_theory_mark" v-model.trim.number="subject.max_theory_mark" required="true" autofocus
          :invalid="submitted && (subject.max_theory_mark === null || subject.max_theory_mark === undefined || subject.max_theory_mark < 0)"
          fluid />
        <small
          v-if="submitted && (subject.max_theory_mark === null || subject.max_theory_mark === undefined || subject.max_theory_mark < 0)"
          class="text-red-500">يجب
          ادخال درجة النظري</small>
      </div>
      <div>
        <label for="max_lab_mark" class="block font-bold mb-3">درجة العملي</label>
        <InputNumber id="max_lab_mark" v-model.trim.number="subject.max_lab_mark" required="true" autofocus
          :invalid="submitted && (subject.max_lab_mark === null || subject.max_lab_mark === undefined || subject.max_lab_mark < 0)"
          fluid />
        <small
          v-if="submitted && (subject.max_lab_mark === null || subject.max_lab_mark === undefined || subject.max_lab_mark < 0)"
          class="text-red-500">يجب ادخال
          درجة
          العملي</small>
      </div>
      <div>
        <label for="max_semester_mark" class="block font-bold mb-3">درجة السعي</label>
        <InputNumber id="max_semester_mark" v-model.trim.number="subject.max_semester_mark" required="true" autofocus
          :invalid="submitted && (subject.max_semester_mark === null || subject.max_semester_mark === undefined || subject.max_semester_mark < 0)"
          fluid />
        <small
          v-if="submitted && (subject.max_semester_mark === null || subject.max_semester_mark === undefined || subject.max_semester_mark < 0)"
          class="text-red-500">يجب
          ادخال درجة السعي</small>
      </div>
      <div>
        <label for="max_final_exam" class="block font-bold mb-3">درجة الامتحان</label>
        <InputNumber id="max_final_exam" v-model.trim.number="subject.max_final_exam" required="true" autofocus
          :invalid="submitted && (subject.max_final_exam === null || subject.max_final_exam === undefined || subject.max_final_exam < 0)"
          fluid />
        <small
          v-if="submitted && (subject.max_final_exam === null || subject.max_final_exam === undefined || subject.max_final_exam < 0)"
          class="text-red-500">يجب
          ادخال
          درجة الامتحان</small>
      </div>
      <div>
        <label for="credits" class="block font-bold mb-3">الوحدات</label>
        <InputNumber id="credits" v-model.trim.number="subject.credits" required="true" autofocus
          :invalid="submitted && (subject.credits === null || subject.credits === undefined || subject.credits < 0)"
          fluid />
        <small v-if="submitted && (subject.credits === null || subject.credits === undefined || subject.credits < 0)"
          class="text-red-500">يجب ادخال
          الوحدات</small>
      </div>
      <div>
        <label for="active" class="block font-bold mb-3">مفعل</label>
        <Select id="active" v-model="subject.active" :options="statuses" optionLabel="label" optionsValue="value"
          placeholder="اختر اذا كان مفعل" fluid></Select>
        <small v-if="submitted && !subject.active" class="text-red-500">يجب اختيار المفعل</small>
      </div>
      <div>
        <label for="ministerial" class="block font-bold mb-3">وزاري</label>
        <Select id="ministerial" v-model="subject.ministerial" :options="statuses" optionsValue="value"
          optionLabel="label" placeholder="اختر اذا كان وزاري" fluid></Select>
        <small v-if="submitted && !subject.ministerial" class="text-red-500">يجب اختيار الوزاري</small>
      </div>
    </div>
    <template #footer>
      <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
      <Button label="Save" icon="pi pi-check" @click="saveSubject" />
    </template>
  </Dialog>
  <Dialog v-model:visible="deleteSubjectDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
    <div class="flex items-center gap-4">
      <i class="pi pi-exclamation-triangle !text-3xl" />
      <span v-if="subject">Are you sure you want to delete <b>{{ subject.subject_name }}</b>?</span>
    </div>
    <template #footer>
      <Button label="No" icon="pi pi-times" text @click="deleteSubjectDialog = false" />
      <Button label="Yes" icon="pi pi-check" @click="deleteSubject" />
    </template>
  </Dialog>
</template>
