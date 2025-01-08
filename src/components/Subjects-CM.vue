<script setup>

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
//import ColumnGroup from 'primevue/columngroup';   // optional
// import Row from 'primevue/row';                   // optional
const products = [{ code: 32, name: "fjkd", category: "dkfjs", quantity: 3 }]

</script>

<template>
  <DataTable dir="rtl" :value="products" showGridlines tableStyle="min-width: 50rem">
    <Column field="code" header="Code"></Column>
    <Column field="name" header="Name"></Column>
    <Column field="category" header="Category"></Column>
    <Column field="quantity" header="Quantity"></Column>
  </DataTable>
</template>
