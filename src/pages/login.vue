<template>
  <div class="login flex h-full flex-col overflow-hidden bg-white">
    <van-nav-bar :title="t('login.title')" :border="false" />

    <div class="flex-1 p-4">
      <div class="h-8"></div>
      <div class="text-lg font-bold">{{ t('login.title') }}</div>
      <div class="mt-8">
        <van-form @submit="onSubmit">
          <van-cell-group inset>
            <van-field
              v-model="form.username"
              name="username"
              :label="t('login.username')"
              :placeholder="t('login.placeholderUsername')"
              :rules="[{ required: true, message: t('login.placeholderUsername') }]"
            />
            <van-field
              v-model="form.password"
              type="password"
              name="password"
              :label="t('login.password')"
              :placeholder="t('login.placeholderPassword')"
              :rules="[{ required: true, message: t('login.placeholderPassword') }]"
            />
          </van-cell-group>
          <div class="mt-6 px-4">
            <van-button
              round
              block
              type="primary"
              native-type="submit"
              :loading="loading"
              :loading-text="t('login.logging')"
            >
              {{ t('login.submit') }}
            </van-button>
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { showToast } from 'vant';

definePage({
  meta: {
    showHeader: false,
    showFooter: false,
  },
});

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const loading = ref(false);

const form = reactive({
  username: '',
  password: '',
});

const onSubmit = async () => {
  loading.value = true;
  try {
    await authStore.login(form);
    showToast(t('login.success'));
    const redirect = (route.query.redirect as string) || '/';
    router.replace(redirect);
  } catch {
    showToast(t('login.fail'));
  } finally {
    loading.value = false;
  }
};
</script>
