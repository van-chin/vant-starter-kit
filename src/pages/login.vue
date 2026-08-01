<template>
  <div class="flex h-full flex-col overflow-hidden" :style="{ backgroundColor: '#f8f9fa' }">
    <!-- Welcome Section -->
    <div class="flex flex-1 flex-col items-center justify-center px-6">
      <div class="w-full max-w-sm">
        <!-- Headline -->
        <div class="mb-1 text-2xl font-bold text-gray-900">
          {{ t('login.welcome') }}
        </div>
        <div class="mb-8 text-sm text-gray-500">
          {{ t('login.subtitle') }}
        </div>

        <!-- Form -->
        <van-form @submit="onSubmit">
          <!-- Username -->
          <van-field
            v-model="form.username"
            name="username"
            :placeholder="t('login.placeholderUsername')"
            :rules="[{ required: true, message: t('login.placeholderUsername') }]"
            class="!mb-3 !rounded-xl !bg-white"
            input-align="left"
            left-icon="user-o"
          />

          <!-- Password -->
          <van-field
            v-model="form.password"
            type="password"
            name="password"
            :placeholder="t('login.placeholderPassword')"
            :rules="[{ required: true, message: t('login.placeholderPassword') }]"
            class="!mb-3 !rounded-xl !bg-white"
            input-align="left"
            left-icon="lock-o"
          />

          <!-- Forgot password -->
          <div class="mb-6 flex justify-end">
            <span class="text-sm text-blue-500">{{ t('login.forgotPassword') }}</span>
          </div>

          <!-- Login button -->
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="loading"
            :loading-text="t('login.logging')"
            class="!h-12 !text-base !font-medium"
          >
            {{ t('login.submit') }}
          </van-button>
        </van-form>

        <!-- Divider -->
        <div class="my-6 flex items-center gap-3">
          <div class="h-px flex-1 bg-gray-200"></div>
          <span class="text-xs text-gray-400">{{ t('login.orContinue') }}</span>
          <div class="h-px flex-1 bg-gray-200"></div>
        </div>

        <!-- Social Login -->
        <div class="flex items-center justify-center gap-5">
          <!-- Google -->
          <div
            class="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-100 active:bg-gray-200"
            @click="onSocialLogin('google')"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </div>

          <!-- Apple -->
          <div
            class="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-100 active:bg-gray-200"
            @click="onSocialLogin('apple')"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
              />
            </svg>
          </div>

          <!-- Facebook -->
          <div
            class="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-100 active:bg-gray-200"
            @click="onSocialLogin('facebook')"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#1877F2"
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
              />
            </svg>
          </div>
        </div>

        <!-- Sign Up Link -->
        <div class="mt-8 text-center">
          <span class="text-sm text-gray-600">{{ t('login.noAccount') }} </span>
          <span class="text-sm font-medium text-blue-500" @click="onGoSignUp">
            {{ t('login.signUp') }}
          </span>
        </div>
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

/** 第三方登录（占位，需对接实际 OAuth） */
function onSocialLogin(provider: string) {
  showToast(`${provider} 登录功能待接入`);
}

/** 跳转到注册页 */
function onGoSignUp() {
  // TODO: 注册页完成后跳转 /signup
  showToast('注册页待接入');
}
</script>
