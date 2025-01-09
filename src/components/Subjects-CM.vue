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

const showBanner = ref(false);
const bannerMessage = ref('');

const editingRows = ref([]);
const onRowEditSave = async (event) => {
  let { newData, data: rowData } = event;
  const index = data.value.subjects.findIndex(subject => subject.subject_id === rowData.subject_id);
  if (index === -1) {
    bannerMessage.value = 'error updating resource, please refresh the page or contact support if issue presist.'
    showBanner.value = true;
    return;
  }

  try {
    const response = await fetch(`http://localhost:4000/v1/subjects/${rowData.subject_id}`, {
      method: 'PATCH',
      body: JSON.stringify(newData),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      bannerMessage.value = errorData.error || 'Error updating subject';
      showBanner.value = true;
    } else {
      // Update the UI if the request was successful
      data.value.subjects.splice(index, 1, newData);
    }
  } catch (error) {
    // Handle network errors
    bannerMessage.value = 'Network error occurred';
    showBanner.value = true;
    console.error('Error updating subject:', error);
  }
  data.value.subjects.splice(index, 1, newData);
}

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
  <div v-if="showBanner" severity="error" @close="showBanner = false">
    {{ bannerMessage }}
  </div>
  <DataTable dir="rtl" sortField="subject_id" :sortOrder="1" removableSort :value="data?.subjects" size="small"
    showGridlines tableStyle="min-width: 50rem" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"
    :loading="loading" v-model:filters="filters" dataKey="subject_id" filterDisplay="row"
    v-model:editingRows="editingRows" editMode="row" @row-edit-save="onRowEditSave" resizableColumns
    :globalFilterFields="['subject_id', 'subject_name', 'subject_name_english',
      'stage', 'semester', 'department', 'max_theory_mark', 'max_lab_mark', 'max_semester_mark', 'max_final_exam',
      'credits', 'active', 'ministerial']">
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
      <template #filter="{ filterModel, filterCallback }">
        <InputText class="w-2" v-model="filterModel.value" type="number" @input="filterCallback()" />
      </template>
      <template #editor="{ data, field }">
        <InputNumber v-model="data[field]" fluid />
      </template>
    </Column>
    <Column field="subject_name" header="أسم المادة" sortable>
      <template #filter="{ filterModel, filterCallback }">
        <InputText class="w-24" v-model="filterModel.value" type="text" @input="filterCallback()" />
      </template>
      <template #editor="{ data, field }">
        <InputText v-model="data[field]" fluid />
      </template>
    </Column>
    <Column field="subject_name_english" header="أسم المادة بالانكليزي" sortable>
      <template #filter="{ filterModel, filterCallback }">
        <InputText class="w-24" v-model="filterModel.value" type="text" @input="filterCallback()" />
      </template>
      <template #editor="{ data, field }">
        <InputText v-model="data[field]" fluid />
      </template>
    </Column>
    <Column field="stage" header="المرحلة" sortable>
      <template #filter="{ filterModel, filterCallback }">
        <InputText class="w-1" v-model="filterModel.value" type="text" @input="filterCallback()" />
      </template>
      <template #editor="{ data, field }">
        <Select v-model="data[field]" :options="stages" optionLabel="label" optionValue="value" fluid>
        </Select>
      </template>
    </Column>
    <Column field="semester" header="الفصل" sortable>
      <template #filter="{ filterModel, filterCallback }">
        <InputText class="w-1" v-model="filterModel.value" type="text" @input="filterCallback()" />
      </template>
      <template #editor="{ data, field }">
        <Select v-model="data[field]" :options="semesters" optionLabel="label" optionValue="value" fluid>
        </Select>
      </template>
    </Column>
    <Column field="department" header="القسم" sortable>
      <template #filter="{ filterModel, filterCallback }">
        <InputText class="w-24" v-model="filterModel.value" type="text" @input="filterCallback()" />
      </template>
      <template #editor="{ data, field }">
        <InputText v-model="data[field]" fluid />
      </template>
    </Column>
    <Column field="max_theory_mark" header="درجة النظري" sortable>
      <template #filter="{ filterModel, filterCallback }">
        <InputText class="w-1" v-model="filterModel.value" type="number" @input="filterCallback()" />
      </template>
      <template #editor="{ data, field }">
        <InputNumber v-model="data[field]" fluid />
      </template>
    </Column>
    <Column field="max_lab_mark" header="درجة العملي" sortable>
      <template #filter="{ filterModel, filterCallback }">
        <InputText class="w-1" v-model="filterModel.value" type="number" @input="filterCallback()" />
      </template>
      <template #editor="{ data, field }">
        <InputNumber v-model="data[field]" fluid />
      </template>
    </Column>
    <Column field="max_semester_mark" header="السعي" sortable>
      <template #filter="{ filterModel, filterCallback }">
        <InputText class="w-1" v-model="filterModel.value" type="number" @input="filterCallback()" />
      </template>
      <template #editor="{ data, field }">
        <InputNumber v-model="data[field]" fluid />
      </template>
    </Column>
    <Column field="max_final_exam" header="درجة الامتحان" sortable>
      <template #filter="{ filterModel, filterCallback }">
        <InputText class="w-1" v-model="filterModel.value" type="number" @input="filterCallback()" />
      </template>
      <template #editor="{ data, field }">
        <InputNumber v-model="data[field]" fluid />
      </template>
    </Column>
    <Column field="credits" header="الوحدات" sortable>
      <template #filter="{ filterModel, filterCallback }">
        <InputText class="w-1" v-model="filterModel.value" type="number" @input="filterCallback()" />
      </template>
      <template #editor="{ data, field }">
        <InputNumber v-model="data[field]" fluid />
      </template>
    </Column>
    <Column field="active" header="مفعل" sortable>
      <template #body="slotProps">
        <Tag :value="slotProps.data.active" :severity="getStatusLabel(slotProps.data.active)" />
      </template>
      <template #filter="{ filterModel, filterCallback }">
        <InputText class="w-1" v-model="filterModel.value" type="text" @input="filterCallback()" />
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
      <template #filter="{ filterModel, filterCallback }">
        <InputText class="w-1" v-model="filterModel.value" type="text" @input="filterCallback()" />
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
    <Column :rowEditor="true" class="w-5"></Column>
  </DataTable>
</template>
