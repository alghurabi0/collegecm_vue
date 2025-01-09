<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { FilterMatchMode } from '@primevue/core/api'
import InputIcon from 'primevue/inputicon';
import IconField from 'primevue/iconfield';
import InputText from 'primevue/inputtext';
//import ColumnGroup from 'primevue/columngroup';   // optional
// import Row from 'primevue/row';                   // optional
import { ref, onMounted } from 'vue'

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  subject_id: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  subject_name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  subject_name_english: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  stage: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  semester: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  department: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  max_theory_mark: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  max_lab_mark: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  max_semester_mark: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  max_final_exam: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  credits: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  active: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  ministerial: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});

const data = ref(null)
const loading = ref(true);
onMounted(async () => {
  try {
    const response = await fetch('http://localhost:4000/v1/subjects')
    if (!response.ok) throw new Error('Network response was not ok')
    data.value = await response.json()
  loading.value = false;
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})
</script>

<template>
  <DataTable dir="rtl" sortField="subject_id" :sortOrder="1" removableSort :value="data?.subjects" size="small" showGridlines tableStyle="min-width: 50rem" paginator :rows="10"
    :rowsPerPageOptions="[5, 10, 20, 50]" :loading="loading" v-model:filters="filters" dataKey="subject_id"
    filterDisplay="row" :globalFilterFields="['subject_id', 'subject_name', 'subject_name_english',
      'stage', 'semester', 'department', 'max_theory_mark', 'max_lab_mark', 'max_semester_mark', 'max_final_exam',
      'credits', 'active', 'ministerial']">
    <template #header>
      <div class="flex justify-end">
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
      <template #filter="{ filterModel, filterCallback }">
        <InputText class="w-2" v-model="filterModel.value" type="number" @input="filterCallback()" placeholder="Search by id" />
      </template>
    </Column>
    <Column field="subject_name" header="أسم المادة" sortable>
      <template #filter="{ filterModel, filterCallback }">
        <InputText class="w-24" v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by name" />
      </template>
    </Column>
    <Column field="subject_name_english" header="أسم المادة بالانكليزي" sortable>
      <template #filter="{ filterModel, filterCallback }">
        <InputText class="w-24" v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by english name" />
      </template></Column>
    <Column field="stage" header="المرحلة">
      <template #filter="{ filterModel, filterCallback }">
        <InputText class="w-1" v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by stage" />
      </template>
    </Column>
    <Column field="semester" header="الفصل">
      <template #filter="{ filterModel, filterCallback }">
        <InputText class="w-1" v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by semester" />
      </template>
    </Column>
    <Column field="department" header="القسم">
      <template #filter="{ filterModel, filterCallback }">
        <InputText class="w-24" v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by department" />
      </template>
    </Column>
    <Column field="max_theory_mark" header="درجة النظري">
      <template #filter="{ filterModel, filterCallback }">
        <InputText class="w-1" v-model="filterModel.value" type="number" @input="filterCallback()" placeholder="Search by theory mark" />
      </template>
    </Column>
    <Column field="max_lab_mark" header="درجة العملي">
      <template #filter="{ filterModel, filterCallback }">
        <InputText class="w-1" v-model="filterModel.value" type="number" @input="filterCallback()" placeholder="Search by lab mark" />
      </template>
    </Column>
    <Column field="max_semester_mark" header="السعي">
      <template #filter="{ filterModel, filterCallback }">
        <InputText class="w-1" v-model="filterModel.value" type="number" @input="filterCallback()" placeholder="Search by semester mark" />
      </template>
    </Column>
    <Column field="max_final_exam" header="درجة الامتحان">
      <template #filter="{ filterModel, filterCallback }">
        <InputText class="w-1" v-model="filterModel.value" type="number" @input="filterCallback()" placeholder="Search by final mark" />
      </template>
    </Column>
    <Column field="credits" header="الوحدات">
      <template #filter="{ filterModel, filterCallback }">
        <InputText class="w-1" v-model="filterModel.value" type="number" @input="filterCallback()" placeholder="Search by credits" />
      </template>
    </Column>
    <Column field="active" header="مفعل">
      <template #filter="{ filterModel, filterCallback }">
        <InputText class="w-1" v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by active" />
      </template>
    </Column>
    <Column field="ministerial" header="وزاري">
      <template #filter="{ filterModel, filterCallback }">
        <InputText class="w-1" v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by ministerial" />
      </template>
    </Column>
  </DataTable>
</template>
