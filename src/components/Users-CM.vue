<template>
  <Toast />
  <DataTable dir="rtl" :columns="cols" :data="data?.users" ref="table" :options="options" class="cell-border">
    <template #action="props">
      <Button icon="pi pi-info" outlined rounded @click="openPrivilegesDialog(props.rowIndex, props.rowData)"></Button>
      <Button icon="pi pi-pencil" outlined rounded class="mr-2"
        @click="editUser(props.rowIndex, props.rowData)"></Button>
      <Button icon="pi pi-trash" outlined rounded severity="danger" class="mr-2"
        @click="confirmDeleteUser(props.rowData)" />
    </template>
  </DataTable>
  <Dialog v-model:visible="deleteUserDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
    <div class="flex items-center gap-4">
      <i class="pi pi-exclamation-triangle !text-3xl" />
      <span v-if="user">؟<b>{{ user.username }}</b> هل انت متأكد من حذف</span>
    </div>
    <template #footer>
      <Button label="لا" icon="pi pi-times" text @click="deleteUserDialog = false" />
      <Button label="نعم" icon="pi pi-check" @click="deleteUser" />
    </template>
  </Dialog>
  <Dialog dir="rtl" v-model:visible="userDialog" class="w-4/5 md:w-3/5" header="تفاصيل المستخدم" :modal="true">
    <div class="flex flex-col gap-6">
      <div>
        <label for="username" class="block font-bold mb-3">اسم المستخدم</label>
        <InputText id="username" v-model.trim="user.username" required="true" />
        <small v-if="submitted && !user.username" class="text-red-500">يجب ادخال اسم المستخدم</small>
      </div>
      <div>
        <label for="password" class="block font-bold mb-3">الرمز</label>
        <InputText id="password" v-model.trim="user.password" required="true" />
        <small v-if="submitted && !user.password" class="text-red-500">الرمز</small>
      </div>
    </div>
    <template #footer>
      <Button label="الغاء" icon="pi pi-times" text @click="hideDialog" />
      <Button label="حفظ" icon="pi pi-check" @click="saveUser" />
    </template>
  </Dialog>
  <Dialog dir="rtl" v-model:visible="privilegesDialog" class="w-11/12 flex flex-col" :modal="true">
    <div class="flex flex-row justify-around">
      <h1 class="text-lg"><b>{{ userPrivileges?.user?.username }}</b></h1>
    </div>
    <Button class="pi pi-plus" @click="openPrivS()">اضافة صلاحية</Button>
    <div v-if="privS" class="flex flex-col">
      <div class="flex flex-row gap-x-4">
        <div class="flex flex-col">
          <label for="year">السنة الدراسية</label>
          <Select v-model="privilege.year" :options="data?.years" optionLabel="year" placeholder="اختر السنة الدراسية"
            name="year"></Select>
          <small v-if="privSubmitted && !privilege.year" class="text-red-600">مطلوب</small>
        </div>
        <div class="flex flex-col">
          <label for="privilege">الصلاحية</label>
          <Select v-model="privilege.table_name" :options="tables" optionLabel="label" placeholder="اختر صلاحية"
            name="privilege"></Select>
          <small v-if="privSubmitted && !privilege.table_name" class="text-red-600">مطلوب</small>
        </div>
        <div class="flex flex-col">
          <label for="stage">المرحلة</label>
          <Select v-model="privilege.stage" :options="stages" optionLabel="label" placeholder="اختر المرحلة"
            name="stage"></Select>
        </div>
        <div class="flex flex-col">
          <label for="can_read">المشاهدة</label>
          <Checkbox v-model="privilege.can_read" binary name="can_read" />
        </div>
        <div class="flex flex-col">
          <label for="can_write">التعديل</label>
          <Checkbox v-model="privilege.can_write" binary name="can_write" />
        </div>
      </div>
      <Button class="mt-2 w-20" @click="insertPriv()">حفظ</Button>
    </div>
    <Accordion value="0">
      <AccordionPanel v-for="(privYear, year) in groupedPrivileges" :key="year">
        <AccordionHeader>{{ year }}</AccordionHeader>
        <AccordionContent>
          <div class="gap-x-4 flex flex-row"><span>السنة
              الدراسية</span><span>الصلاحية</span><span>المرحلة</span><span>المشاهدة</span><span>التعديل</span></div>
          <div class="flex flex-row gap-x-4" v-for="priv in privYear" :key="priv.index">
            <span>{{ priv.year }}</span>
            <span>{{ priv.table_id }}</span>
            <span>{{ priv.stage }}</span>
            <span>{{ priv.can_read }}</span>
            <span>{{ priv.can_write }}</span>
          </div>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </Dialog>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
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
import Dialog from 'primevue/dialog';
import Select from 'primevue/select';
import Checkbox from 'primevue/checkbox';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import { getUsers, deleteUserC, createUser, updateUser, getPrivileges, createPrivilege } from '@/controllers/users';
import { getYears } from '@/controllers/general';

DataTable.use(DataTablesCore);
//
const tables = ref([
  { label: "المواد", value: "subjects" },
  { label: "الطلاب", value: "students" },
  { label: "التحميل", value: "carryovers" },
  { label: "الاعفاء", value: "exempted" },
  { label: "الدرجات", value: "marks" },
  { label: "الغيابات", value: "abstance" },
  { label: "الكل", value: "all" },
]);
const stages = ref([
  { label: 'الاولى', value: 'الاولى' },
  { label: 'الثانية', value: 'الثانية' },
  { label: 'الثالثة', value: 'الثالثة' },
  { label: 'الرابعة', value: 'الرابعة' },
  { label: 'الخامسة', value: 'الخامسة' },
  { label: 'السادسة', value: 'السادسة' },
  { label: "الكل", value: "all" },
]);
//
const toast = useToast();
const cols = [
  { data: 'id', title: 'الرقم التعريفي' },
  { data: 'username', title: 'اسم المستخدم' },
  { data: 'created_at', title: 'تاريخ الانشاء' },
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
    top2Start: {
      buttons: [
        {
          text: "اضافة", name: "add", className: "add_button", action: function () {
            user.value = {};
            submitted.value = false;
            userDialog.value = true;
          }
        }
      ],
    },
  },
  language: {
    url: "https://cdn.datatables.net/plug-ins/2.2.1/i18n/ar.json"
  }
}
// get
const data = ref({})
onMounted(async () => {
  const { users, err } = await getUsers();
  if (err !== null) {
    toast.add({ severity: "warn", summary: "حدث حطأ", detail: err || 'حدث خطأ', life: 5000 });
    return;
  } else if (users) {
    data.value = users
  }
  const { years, err: err1 } = await getYears();
  if (err1 !== null) {
    toast.add({ severity: "warn", summary: "حدث حطأ", detail: err1 || 'حدث خطأ', life: 5000 });
    return;
  } else if (years) {
    data.value.years = years
  }
});
// add and update
const user = ref({});
const userDialog = ref(false);
const submitted = ref(false);
const hideDialog = () => {
  userDialog.value = false;
  submitted.value = false;
};
const saveUser = async () => {
  submitted.value = true;
  if (user?.value.username && user?.value.password) {
    if (!user.value.id) {
      const { newUser, err } = await createUser(user.value);
      if (err !== null) {
        toast.add({ severity: 'warn', summary: 'Fail', details: err || 'حدث خطأ', life: 5000 });
        return;
      } else if (newUser) {
        if (!Array.isArray(data.value.users)) {
          data.value.users = [];
        }
        data.value.users.push(newUser);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'تم ادخال المستخدم', life: 4000 });
        userDialog.value = false;
        user.value = {};
      }
    } else if (user.value.id && user.value.index >= 0) {
      const { index, id, created_at, ...dataToSend } = user.value
      const { newUser, err } = await updateUser(id, dataToSend)
      if (err !== null) {
        toast.add({ severity: 'warn', summary: 'Fail', details: err || 'حدث خطأ', life: 5000 });
        return;
      } else if (newUser) {
        data.value.users.splice(index, 1, newUser);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'تم تحديث المستخدم', life: 4000 });
        userDialog.value = false;
        user.value = {};
      }
    }
  } else {
    toast.add({ severity: 'warn', summary: 'Fail', details: 'حدث خطأ', life: 5000 });
  }
};
// update
const editUser = (index, rowData) => {
  user.value = { index, ...rowData };
  userDialog.value = true;
}
// delete
const deleteUserDialog = ref(false);
const confirmDeleteUser = (stud) => {
  user.value = stud;
  deleteUserDialog.value = true;
};
const deleteUser = async () => {
  if (user?.value.id) {
    const res = await deleteUserC(user.value.id);
    if (res !== true) {
      toast.add({ severity: 'warn', summary: 'Fail', details: res || 'حدث خطأ', life: 5000 });
    } else {
      data.value.users = data.value.users.filter(val => val.id !== user.value.id);
      deleteUserDialog.value = false;
      user.value = {};
      toast.add({ severity: 'success', summary: 'Successful', detail: 'تم حذف الطالب', life: 3000 });
    }
  } else {
    toast.add({ severity: 'warn', summary: 'Fail', details: 'حدث خطأ', life: 5000 });
  }
};
// privileges if
const userPrivileges = ref({});
const privilegesDialog = ref(false);
const groupedPrivileges = computed(() => {
  return Array.isArray(userPrivileges.value.privileges) ?
    userPrivileges.value.privileges.reduce((acc, priv) => {
      if (!acc[priv.year]) {
        acc[priv.year] = [];
      }
      acc[priv.year].push(priv);
      return acc;
    }, {}) : [];
});
const openPrivilegesDialog = async (index, rowData) => {
  const { privileges: privilegesData, err } = await getPrivileges(rowData.id);
  if (err !== null) {
    toast.add({ severity: 'warn', summary: 'Error', detail: err || 'حدث خطأ', life: 5000 });
    return;
  }
  userPrivileges.value = { ...privilegesData }
  privilegesDialog.value = true;
}
const privilege = ref({});
const privSubmitted = ref(false);
// priv
const privS = ref(false);
const openPrivS = () => {
  privS.value = true;
}
const insertPriv = async () => {
  privSubmitted.value = true;
  if (!privilege.value.table_name || !privilege.value.stage || !privilege.value.year) {
    toast.add({ severity: "warn", detail: "يرجى ملأ المعلومات المطلوبة", life: 5000 });
    return
  }
  if (privilege.value.can_read !== true) {
    privilege.value.can_read = false;
  }
  if (privilege.value.can_write !== true) {
    privilege.value.can_write = false;
  }
  privilege.value.year = privilege.value.year.year;
  privilege.value.table_name = privilege.value.table_name.value;
  privilege.value.stage = privilege.value.stage.value;
  privilege.value.user_id = userPrivileges.value.user?.id;
  if (!privilege.value.user_id || !privilege.value.year) {
    toast.add({ severity: "warn", detail: "حدث خطأ", life: 5000 });
    return;
  }
  // TODO
  const { newPrivilege, err } = await createPrivilege(privilege.value);
  if (err !== null) {
    toast.add({ severity: 'warn', summary: 'حدث خطأ', detail: err || 'حدث خطأ', life: 5000 });
    return;
  } else if (userPrivileges.value) {
    if (!Array.isArray(userPrivileges.value.privileges)) {
      userPrivileges.value.privileges = [];
    }
    userPrivileges.value.privileges.push(newPrivilege);
    toast.add({ severity: 'success', summary: 'Successful', detail: 'تم انشاء الصلاحية', life: 3000 });
    privS.value = false;
    privilege.value = {};
    privSubmitted.value = false;
  }
}
</script>
