<template>
  <div class="login-page relative flex h-full flex-col overflow-hidden bg-[var(--color-bg-page)]">
    <!-- Chakra decorative logo: top-right, partially off-screen -->
    <img
      src="/images/chakra-logo.svg"
      alt=""
      class="pointer-events-none absolute top-[55px] -right-[93px] h-[198px] w-[198px] opacity-[0.15] select-none dark:opacity-[0.08]"
    />

    <div class="flex flex-1 flex-col items-center overflow-hidden px-6">
      <div class="flex w-full max-w-[345px] flex-col" style="padding-top: var(--login-pt)">
        <!-- Title Section -->
        <div class="login-title">
          <h1
            class="font-poppins text-[24px] leading-[36px] font-medium text-[var(--color-text-primary)]"
          >
            {{ t('login.welcome') }}
          </h1>
          <p class="font-poppins mt-2 text-base leading-6 text-[var(--color-text-secondary)]">
            {{ t('login.subtitle') }}
          </p>
        </div>

        <!-- Gap to form (Figma: title→form, responsive) -->
        <div style="height: var(--login-gap)" />

        <!-- Form -->
        <van-form @submit="onSubmit" autocomplete="off">
          <!-- Username -->
          <div class="field-wrapper">
            <van-field
              v-model="form.username"
              name="username"
              autocomplete="off"
              :placeholder="t('login.placeholderUsername')"
              :rules="[{ required: true, message: t('login.placeholderUsername') }]"
              class="login-field"
              input-align="left"
            />
          </div>

          <!-- Password -->
          <div class="field-wrapper" style="margin-top: 14px">
            <van-field
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              name="password"
              autocomplete="new-password"
              :placeholder="t('login.placeholderPassword')"
              :rules="[{ required: true, message: t('login.placeholderPassword') }]"
              class="login-field"
              input-align="left"
            >
              <template #right-icon>
                <button
                  type="button"
                  class="flex h-5 w-5 items-center justify-center"
                  @click="showPassword = !showPassword"
                >
                  <img
                    src="/images/eye-off.svg"
                    alt="toggle password"
                    class="h-5 w-5 opacity-40"
                    :class="{ 'opacity-70': showPassword }"
                  />
                </button>
              </template>
            </van-field>
          </div>

          <!-- Forgot Password -->
          <div class="forgot-pwd-row flex justify-end" style="padding: 8px 0; margin-top: 7px">
            <button
              type="button"
              class="font-poppins text-xs font-medium text-[var(--color-accent)]"
              @click="onForgotPassword"
            >
              {{ t('login.forgotPassword') }}
            </button>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="loading"
            class="login-btn font-poppins flex h-[52px] w-full items-center justify-center rounded-2xl bg-[linear-gradient(25deg,#89C6FF,#BC91D3)] text-base font-semibold text-white shadow-[0px_2px_4px_rgba(0,0,0,0.15)] transition-opacity duration-200 active:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[linear-gradient(25deg,#5a7fcf,#8b6db8)]"
            style="margin-top: var(--login-btn-mt)"
          >
            <template v-if="loading">
              <span class="loading-spinner mr-2" />
              {{ t('login.logging') }}
            </template>
            <template v-else>
              {{ t('login.submit') }}
            </template>
          </button>
        </van-form>

        <!-- OR Divider -->
        <div class="flex items-center gap-3" style="margin-top: var(--login-divider-mt)">
          <div
            class="h-px flex-1 bg-[linear-gradient(90deg,rgba(139,139,139,1)_0%,rgba(248,249,250,0)_80%)] dark:bg-[linear-gradient(90deg,rgba(139,139,139,1)_0%,rgba(30,30,32,0)_80%)]"
          />
          <span
            class="shrink-0 text-xs text-[var(--color-text-secondary)]"
            style="font-family: Inter, sans-serif"
          >
            {{ t('login.orContinue') }}
          </span>
          <div
            class="h-px flex-1 bg-[linear-gradient(270deg,rgba(139,139,139,1)_0%,rgba(248,249,250,0)_80%)] dark:bg-[linear-gradient(270deg,rgba(139,139,139,1)_0%,rgba(30,30,32,0)_80%)]"
          />
        </div>

        <!-- Social Login -->
        <div
          class="flex items-center justify-center gap-[42px]"
          style="margin-top: var(--login-social-mt)"
        >
          <!-- Google -->
          <button class="social-btn" @click="onSocialLogin('google')">
            <svg class="h-6 w-6" viewBox="0 0 24 24">
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
          </button>

          <!-- Apple -->
          <button class="social-btn" @click="onSocialLogin('apple')">
            <svg class="h-8 w-8 text-black dark:text-white" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
              />
            </svg>
          </button>

          <!-- Facebook -->
          <button class="social-btn" @click="onSocialLogin('facebook')">
            <svg class="h-6 w-6" viewBox="0 0 24 24">
              <path
                fill="#1877F2"
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
              />
            </svg>
          </button>
        </div>

        <!-- Sign Up Link -->
        <div class="text-center" style="margin-top: var(--login-signup-mt)">
          <span class="font-poppins text-xs text-[var(--color-text-tertiary)]">
            {{ t('login.noAccount') }}
          </span>
          <button
            type="button"
            class="font-poppins text-xs font-medium text-[var(--color-accent)]"
            @click="onGoSignUp"
          >
            {{ t('login.signUp') }}
          </button>
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
const showPassword = ref(false);

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

/** 忘记密码 */
function onForgotPassword() {
  // TODO: 忘记密码页完成后跳转
  showToast('忘记密码功能待接入');
}
</script>

<style scoped>
/* ─── Spacing Variables: large-screen defaults (>736px viewport height) ─── */
/* Verified: fits iPhone 12 mini through Pro Max with browser chrome */
.login-page {
  --login-pt: 56px;
  --login-gap: 64px;
  --login-btn-mt: 36px;
  --login-divider-mt: 28px;
  --login-social-mt: 22px;
  --login-signup-mt: 28px;
}

/* ─── Field Wrapper: reserve space for error messages ─── */
.field-wrapper {
  position: relative;
  /* 28px bottom = 14px visual gap + 14px error text reserve */
  padding-bottom: 28px;
  overflow: visible;
}

/* Override van-cell styles from field-wrapper (reliable ancestor selector) */
.field-wrapper :deep(.van-cell) {
  padding: 18px;
  border-radius: 16px;
  background: var(--color-bg-surface);
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.08);
  overflow: visible;
}

/* ─── Input Fields ─── */
.login-field :deep(.van-field__control) {
  font-size: 12px;
  font-family: 'Poppins', ui-sans-serif, system-ui, sans-serif;
}

.login-field :deep(.van-field__control::placeholder) {
  color: var(--color-text-secondary);
  font-size: 12px;
}

/* ─── Error Message: absolutely positioned → never pushes content ─── */
.login-field :deep(.van-field__error-message) {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  font-size: 10px;
  line-height: 1.2;
  color: #ee0a24;
}

/* ─── Social Buttons ─── */
.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  height: 48px;
  padding: 12px 26px;
  border-radius: 8px;
  background: var(--color-bg-page);
  border: 1px solid var(--color-bg-surface);
  box-shadow: 0px 1px 1px var(--color-border-subtle);
  cursor: pointer;
  transition: opacity 0.15s;
}

.social-btn:active {
  opacity: 0.7;
}

/* ─── Loading Spinner ─── */
.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ─── Dark Mode: minimal overrides — most colors handled by global tokens ─── */
:global(.dark) .field-wrapper :deep(.van-cell) {
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3);
}

:global(.dark) .login-field :deep(.van-field__control) {
  color: var(--color-text-primary);
}

/* ─── Compact screen (≤736px viewport): tighter spacing + smaller elements ─── */
/* Covers iPhone SE, iPhone 6/7/8, and older devices */
@media (max-height: 736px) {
  /* Spacing variables: reduced for limited vertical space */
  .login-page {
    --login-pt: 28px;
    --login-gap: 32px;
    --login-btn-mt: 20px;
    --login-divider-mt: 16px;
    --login-social-mt: 12px;
    --login-signup-mt: 16px;
  }

  /* Title */
  .login-title h1 {
    font-size: 20px;
    line-height: 28px;
  }
  .login-title p {
    font-size: 13px;
    margin-top: 4px;
  }

  /* Field wrappers */
  .field-wrapper {
    padding-bottom: 14px;
  }
  .field-wrapper :deep(.van-cell) {
    padding: 12px;
  }
  .field-wrapper + .field-wrapper {
    margin-top: 10px !important;
  }

  /* Forgot password */
  .forgot-pwd-row {
    padding: 4px 0 !important;
    margin-top: 4px !important;
  }

  /* Login button */
  .login-btn {
    height: 42px;
  }

  /* OR divider */
  .login-page .gap-3 {
    gap: 0.375rem;
  }

  /* Social buttons */
  .social-btn {
    height: 36px;
    min-width: 36px;
    padding: 6px 20px;
  }
}
</style>
