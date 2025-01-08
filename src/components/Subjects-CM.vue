<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
//import ColumnGroup from 'primevue/columngroup';   // optional
// import Row from 'primevue/row';                   // optional

import { ref, onMounted } from 'vue'

const subjects = ref(null)

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:4000/v1/subjects')
    if (!response.ok) throw new Error('Network response was not ok')
    subjects.value = await response.json()
    console.log(subjects.value);
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})
</script>

<template>
  <DataTable dir="rtl" :value="subjects?.subjects" showGridlines>
    <Column field="subject_id" header="رقم المادة"></Column>
    <Column field="subject_name" header="أسم المادة"></Column>
    <Column field="subject_name_english" header="أسم المادة بالانكليزي"></Column>
    <Column field="stage" header="المرحلة"></Column>
    <Column field="department" header="القسم"></Column>
    <Column field="max_theory_mark" header="درجة النظري"></Column>
    <Column field="max_lab_mark" header="درجة العملي"></Column>
    <Column field="max_semester_mark" header="السعي"></Column>
    <Column field="max_final_exam" header="درجة الامتحان"></Column>
    <Column field="credits" header="الوحدات"></Column>
    <Column field="active" header="مفعل"></Column>
    <Column field="ministerial" header="وزاري"></Column>
  </DataTable>
</template>
