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
//import ColumnGroup from 'primevue/columngroup';   // optional
// import Row from 'primevue/row';                   // optional
import { ref, onMounted } from 'vue'

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
])

const editingRows = ref([]);
const onRowEditSave = async (event) => {
  let { newData, data: rowData } = event;
  const index = data.value.subjects.findIndex(subject => subject.subject_id === rowData.subject_id);
  if (index === -1) {
    toast.add({ severity: 'danger', summary: 'Fail', details: 'حدث خطأ', life: 10000 });
    return;
  }

  try {
    const response = await fetch(`https://collegecm.work.gd/v1/subjects/${rowData.subject_id}`, {
      method: 'PATCH',
      body: JSON.stringify(newData),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.add({ severity: 'danger', summary: 'Fail', details: errorData.error || 'حدث خطأ', life: 10000 });
    } else {
      // Update the UI if the request was successful
      data.value.subjects.splice(index, 1, newData);
    }
  } catch (error) {
    // Handle network errors
    toast.add({ severity: 'danger', summary: 'Fail', details: 'حدث خطأ', life: 10000 });
    console.error('Error updating subject:', error);
  }
  data.value.subjects.splice(index, 1, newData);
}

const data = ref(null)
const loading = ref(true);
onMounted(async () => {
  try {
    const response = await fetch('https://collegecm.work.gd/v1/subjects')
    if (!response.ok) throw new Error('Network response was not ok')
    data.value = await response.json()
    loading.value = false;
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})
// adding a subject
const subject = ref({});
const subjectDialog = ref(false);
const submitted = ref(false);
const toast = useToast();
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
    try {
      const response = await fetch('https://collegecm.work.gd/v1/subjects', {
        method: 'POST',
        body: JSON.stringify(subject.value),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        toast.add({ severity: 'danger', summary: 'Fail', details: errorData.error || 'حدث خطأ', life: 10000 });
      } else {
        data.value.subjects.push(subject.value);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'تم انشاء المادة', life: 4000 });
        subjectDialog.value = false;
        subject.value = {};
      }
    } catch (err) {
      toast.add({ severity: 'danger', summary: 'Fail', details: 'حدث خطأ', life: 5000 });
      console.log(err);
    }
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
    try {
      const response = await fetch(`https://collegecm.work.gd/v1/subjects/${subject.value.subject_id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        toast.add({ severity: 'danger', summary: 'Fail', details: errorData.error || 'حدث خطأ', life: 10000 });
      } else {
        data.value.subjects = data.value.subjects.filter(val => val.subject_id !== subject.value.subject_id);
        deleteSubjectDialog.value = false;
        subject.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Subject Deleted', life: 3000 });
      }
    } catch (err) {
      toast.add({ severity: 'danger', summary: 'Fail', details: 'حدث خطأ', life: 5000 });
      console.error(err);
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
  <Toolbar class="mb-6">
    <template #start>
      <Button label="New" icon="pi pi-plus" class="mr-2" @click="openNew" />
    </template>
    <template #end>
      <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
    </template>
  </Toolbar>
  <DataTable dir="rtl" ref="dt" sortField="subject_id" :sortOrder="1" removableSort :value="data?.subjects" size="small"
    showGridlines tableStyle="min-width: 50rem" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"
    :loading="loading" v-model:filters="filters" dataKey="subject_id" v-model:editingRows="editingRows" editMode="row"
    @row-edit-save="onRowEditSave" resizableColumns>
    <template #footer>Hello world</template>

    <template #header>
      <div class="flex justify-end mr-5 justify-self-start">
        <IconField>
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
        </IconField>
      </div>
    </template>
    <template #empty> No subjects found. </template>
    <template #loading> Loading subjects data. Please wait. </template>
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
          placeholder="Select a Status" fluid>
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
          placeholder="Select a Status" fluid>
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
  <Dialog dir="rtl" v-model:visible="subjectDialog" class="w-2/5" header="Subject Details" :modal="true">
    <div class="flex flex-col gap-6">
      <div>
        <label for="subject_id" class="block font-bold mb-3">رقم المادة</label>
        <InputNumber id="subject_name" v-model.trim.number="subject.subject_id" required="true" autofocus
          :invalid="submitted && !subject.subject_id" fluid />
        <small v-if="submitted && !subject.subject_id" class="text-red-500">يجب ادخال رقم المادة</small>
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
          :invalid="submitted && !subject.max_theory_mark" fluid />
        <small v-if="submitted && !subject.max_theory_mark" class="text-red-500">يجب ادخال درجة النظري</small>
      </div>
      <div>
        <label for="max_lab_mark" class="block font-bold mb-3">درجة العملي</label>
        <InputNumber id="max_lab_mark" v-model.trim.number="subject.max_lab_mark" required="true" autofocus
          :invalid="submitted && !subject.max_lab_mark" fluid />
        <small v-if="submitted && !subject.max_lab_mark" class="text-red-500">يجب ادخال درجة العملي</small>
      </div>
      <div>
        <label for="max_semester_mark" class="block font-bold mb-3">درجة السعي</label>
        <InputNumber id="max_semester_mark" v-model.trim.number="subject.max_semester_mark" required="true" autofocus
          :invalid="submitted && !subject.max_semester_mark" fluid />
        <small v-if="submitted && !subject.max_semester_mark" class="text-red-500">يجب ادخال درجة السعي</small>
      </div>
      <div>
        <label for="max_final_exam" class="block font-bold mb-3">درجة الامتحان</label>
        <InputNumber id="max_final_exam" v-model.trim.number="subject.max_final_exam" required="true" autofocus
          :invalid="submitted && !subject.max_final_exam" fluid />
        <small v-if="submitted && !subject.max_final_exam" class="text-red-500">يجب ادخال درجة الامتحان</small>
      </div>
      <div>
        <label for="credits" class="block font-bold mb-3">الةحدات</label>
        <InputNumber id="credits" v-model.trim.number="subject.credits" required="true" autofocus
          :invalid="submitted && !subject.credits" fluid />
        <small v-if="submitted && !subject.credits" class="text-red-500">يجب ادخال الوحدات</small>
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
