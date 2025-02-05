<template>
  <Toast />
  <div
    class="flex flex-col w-5/6 sm:w-3/6 md:w-4/12 h-64 justify-self-center place-self-center justify-center items-center"
    dir="rtl">
    <InputGroup class="h-16">
      <InputGroupAddon>
        <i class="pi pi-user"></i>
      </InputGroupAddon>
      <InputText v-model="info.username" placeholder="معرف المستخدم"></InputText>
    </InputGroup>
    <InputGroup class="h-16 mt-5">
      <InputGroupAddon>
        <i class="pi pi-lock"></i>
      </InputGroupAddon>
      <InputText v-model="info.password" placeholder="الرمز السري"></InputText>
    </InputGroup>
    <Button class="mt-5" @click="logUser()">تسجيل الدخول</Button>
  </div>
</template>
<script setup>
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import { ref } from 'vue';
import { login } from '@/controllers/auth';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const toast = useToast();
const router = useRouter();
const info = ref({
  username: '',
  password: ''
})
const authStore = useAuthStore()
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
    authStore.current_user = user;
    router.push('/');
  }
}
</script>
