<template>
  <Toast />
  <div class="flex flex-col w-5/6 md:w-8/12">
    <InputGroup>
      <InputGroupAddon>
        <i class="pi pi-user"></i>
      </InputGroupAddon>
      <InputText v-model="info.username" placeholder="معرف المستخدم"></InputText>
    </InputGroup>
    <InputGroup>
      <InputGroupAddon>
        <i class="pi pi-password"></i>
      </InputGroupAddon>
      <InputText v-model="info.password" placeholder="الرمز السري"></InputText>
    </InputGroup>
    <Button @click="logUser()">تسجيل الدخول</Button>
  </div>
</template>
<script setup>
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import { ref, inject } from 'vue';
import { login } from '@/controllers/auth';
import { useRouter } from 'vue-router';

const toast = useToast();
const router = useRouter();
const info = ref({
  username: '',
  password: ''
})
const updateCurrentUser = inject('updateCurrentUser');

const logUser = async () => {
  if (!info.value.username || !info.value.password) {
    toast.add({ severity: 'warn', detail: "يرجى ملأ يجميع الحقول", life: 5000 });
    return;
  }
  const { user, err } = await login(info.value);
  if (err) {
    toast.add({ severity: "warn", summary: "حدث خطأ", detail: err || "حدث خطأ", life: 5000 });
    return
  } else if (user) {
    updateCurrentUser(user);
    router.push('/');
  }
}
</script>
