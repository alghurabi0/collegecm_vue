<script setup>
import { ref, onMounted, computed } from 'vue'
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { FilterMatchMode } from '@primevue/core/api'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputIcon from 'primevue/inputicon';
import IconField from 'primevue/iconfield';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';
import Dialog from 'primevue/dialog';

// extras
const toast = useToast();
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
// table config
const dt = ref();
const rowsPerPageOptions = computed(() => {
  const options = [5, 10, 20, 50];
  if (data.value && data.value.students) {
    options.push(data.value.students.length); // Add "Show All" option
  }
  return options;
});
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
// getting
const data = ref(null)
const loading = ref(true);
onMounted(async () => {
  try {
    const response = await fetch('https://collegecm.work.gd/v1/students')
    if (!response.ok) throw new Error('Network response was not ok')
    data.value = await response.json()
    loading.value = false;
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})
// adding
const student = ref({});
const studentDialog = ref(false);
const submitted = ref(false);
const openNew = () => {
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
    student.value.student_name = student.value.student_name.value;
    student.value.stage = student.value.stage.value;
    student.value.student_id = student.value.student_id.value;
    student.value.state = student.value.state.value;
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
        data.value.students.push(student.value);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'تم انشاء المادة', life: 4000 });
        studentDialog.value = false;
        student.value = {};
      }
    } catch (err) {
      toast.add({ severity: 'danger', summary: 'Fail', details: 'حدث خطأ', life: 5000 });
      console.log(err);
    }
  }
};
// editing row (updating)
const editingRows = ref([]);
const onRowEditSave = async (event) => {
  let { newData, data: rowData } = event;
  const index = data.value.students.findIndex(student => student.student_id === rowData.student_id);
  if (index === -1) {
    toast.add({ severity: 'danger', summary: 'Fail', details: 'حدث خطأ', life: 10000 });
    return;
  }

  try {
    const response = await fetch(`https://collegecm.work.gd/v1/students/${rowData.student_id}`, {
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
      data.value.students.splice(index, 1, newData);
    }
  } catch (error) {
    toast.add({ severity: 'danger', summary: 'Fail', details: 'حدث خطأ', life: 10000 });
    console.error('Error updating student:', error);
  }
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
// import
const fileInput = ref(null);
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.match('text/csv')) {
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'يرجى اختيار ملف بصيغة csv', life: 3000 });
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('https://collegecm.work.gd/v1/students/import', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.add({ severity: 'danger', summary: 'Error', detail: errorData.error || 'فشل الاستيراد', life: 5000 });
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
    toast.add({ severity: 'error', summary: 'Error', detail: 'فشل الاستيراد', life: 5000 });
    console.error('Error importing students:', error);
  } finally {
    fileInput.value.value = null;
  }
}
// export
const exportCSV = () => {
  dt.value.exportCSV();
};
</script>
<template>
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
  <DataTable dir="rtl" ref="dt" stateStorage="session" stateKey="dt-state-students-session" sortField="seq_in_college"
    :sortOrder="1" removableSort :value="data?.students" size="small" showGridlines tableStyle="min-width: 50rem"
    paginator :rows="10" :rowsPerPageOptions="rowsPerPageOptions" :loading="loading" v-model:filters="filters"
    dataKey="student_id" v-model:editingRows="editingRows" editMode="row" @row-edit-save="onRowEditSave"
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
    <Column field="seq_in_college" header="التسلسل في الكلية" sortable>
      <template #editor="{ data, field }">
        <div>{{ data[field] }}</div>
      </template>
    </Column>
    <Column field="student_name" header="أسم المادة" sortable>
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
    <Column field="student_id" header="رقم الطالب" sortable>
      <template #editor="{ data, field }">
        <InputNumber v-model="data[field]" fluid />
      </template>
    </Column>
    <Column field="state" header="الوضع" sortable>
      <template #editor="{ data, field }">
        <Select v-model="data[field]" :options="states" optionLabel="label" optionValue="value" fluid>
        </Select>
      </template>
    </Column>
    <Column :exportable="false" :rowEditor="true" class="w-5">
    </Column>
    <Column :exportable="false" class="w-5">
      <template #body="slotProps">
        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteStudent(slotProps.data)" />
      </template>
    </Column>
  </DataTable>
  <Dialog v-model:visible="deleteStudentDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
    <div class="flex items-center gap-4">
      <i class="pi pi-exclamation-triangle !text-3xl" />
      <span v-if="student">؟<b>{{ student.student_name }}</b> هل انت متأكد من حذف</span>
    </div>
    <template #footer>
      <Button label="No" icon="pi pi-times" text @click="deleteStudentDialog = false" />
      <Button label="Yes" icon="pi pi-check" @click="deleteStudent" />
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
        <label for="state" class="block font-bold mb-3">الفصل</label>
        <Select id="state" v-model="student.state" :options="states" optionLabel="label" optionsValue="value"
          placeholder="اختر الفصل" fluid></Select>
        <small v-if="submitted && !student.state" class="text-red-500">يجب ادخال الفصل</small>
      </div>
    </div>
    <template #footer>
      <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
      <Button label="Save" icon="pi pi-check" @click="saveStudent" />
    </template>
  </Dialog>
</template>
