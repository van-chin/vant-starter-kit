<template>
  <div
    class="login-oths-page relative flex h-full flex-col overflow-hidden bg-[var(--color-bg-page)]"
  >
    <!--
      Chakra 装饰（右上角，部分出屏）
      设计坐标：393×852 画板内 left 270 / top 55，宽高 198，右缘溢出 75.5px
      图案按设计旋转 180° 并水平镜像（参考代码 -rotate-180 -scale-x-100）
    -->
    <img
      src="/images/chakra-logo.svg"
      alt=""
      aria-hidden="true"
      class="chakra-deco pointer-events-none absolute select-none"
    />

    <div class="flex flex-1 flex-col items-center overflow-y-auto px-6">
      <div class="flex w-full max-w-[345px] flex-col" style="padding-top: var(--login-pt)">
        <!-- ─── 标题区 ─── -->
        <div class="login-title">
          <h1
            class="font-poppins text-[24px] leading-[36px] font-medium text-[var(--color-text-primary)]"
          >
            Welcome Back!
          </h1>
          <p class="font-poppins mt-2 text-base leading-6 text-[var(--color-text-secondary)]">
            Continue your Yoga journey.
          </p>
        </div>

        <!-- 标题 → 表单间距（响应式变量） -->
        <div :style="{ height: 'var(--login-gap)' }" />

        <!-- ─── 表单 ─── -->
        <van-form @submit="onSubmit" autocomplete="off">
          <!-- 用户名 -->
          <div class="field-wrapper">
            <van-field
              v-model="form.username"
              name="username"
              autocomplete="off"
              placeholder="Enter username"
              :rules="[{ required: true, message: 'Please enter username' }]"
              class="login-field"
              input-align="left"
            />
          </div>

          <!-- 密码 -->
          <div class="field-wrapper" :style="{ marginTop: 'var(--login-field-gap)' }">
            <van-field
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              name="password"
              autocomplete="new-password"
              placeholder="Password"
              :rules="[{ required: true, message: 'Please enter password' }]"
              class="login-field"
              input-align="left"
            >
              <template #right-icon>
                <button
                  type="button"
                  class="flex h-5 w-5 items-center justify-center"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  @click="showPassword = !showPassword"
                >
                  <img
                    src="/images/eye-off.svg"
                    alt=""
                    class="h-5 w-5 opacity-40 transition-opacity"
                    :class="{ 'opacity-70': showPassword }"
                  />
                </button>
              </template>
            </van-field>
          </div>

          <!-- 忘记密码 -->
          <div
            class="flex justify-end"
            :style="{ padding: '8px 0', marginTop: 'var(--login-forgot-mt)' }"
          >
            <button
              type="button"
              class="font-poppins text-xs font-medium text-[var(--color-accent)]"
              @click="onForgotPassword"
            >
              Forgot password?
            </button>
          </div>

          <!-- 登录按钮 -->
          <button
            type="submit"
            :disabled="loading"
            class="login-btn font-poppins flex h-[56px] w-full items-center justify-center rounded-[16px] text-base font-semibold text-white transition-opacity duration-200 active:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            :style="{ marginTop: 'var(--login-btn-mt)' }"
          >
            <template v-if="loading">
              <span class="loading-spinner mr-2" />
              Logging in...
            </template>
            <template v-else> Log In </template>
          </button>
        </van-form>

        <!-- ─── OR 分隔线 ─── -->
        <div class="flex items-center gap-3" :style="{ marginTop: 'var(--login-divider-mt)' }">
          <div class="or-line or-line-left" />
          <span
            class="shrink-0 text-xs text-[var(--color-text-secondary)]"
            style="font-family: Inter, sans-serif"
          >
            or continue with
          </span>
          <div class="or-line or-line-right" />
        </div>

        <!-- ─── 社交登录 ─── -->
        <div
          class="flex items-center justify-center"
          :style="{ gap: 'var(--login-social-gap)', marginTop: 'var(--login-social-mt)' }"
        >
          <!-- Google -->
          <button
            class="social-btn"
            type="button"
            aria-label="Continue with Google"
            @click="onSocialLogin('google')"
          >
            <svg class="h-6 w-6" viewBox="0 0 24 24" aria-hidden="true">
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
          <button
            class="social-btn"
            type="button"
            aria-label="Continue with Apple"
            @click="onSocialLogin('apple')"
          >
            <svg
              class="h-8 w-8 text-black dark:text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
              />
            </svg>
          </button>

          <!-- Facebook -->
          <button
            class="social-btn"
            type="button"
            aria-label="Continue with Facebook"
            @click="onSocialLogin('facebook')"
          >
            <svg class="h-6 w-6" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#1877F2"
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
              />
            </svg>
          </button>
        </div>

        <!-- ─── 注册入口 ─── -->
        <div class="text-center" :style="{ marginTop: 'var(--login-signup-mt)' }">
          <span class="font-poppins text-xs text-[var(--color-text-tertiary)]">New here? </span>
          <button
            type="button"
            class="font-poppins text-xs font-medium text-[var(--color-accent)]"
            @click="onGoSignUp"
          >
            Sing Up
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showToast } from 'vant';

definePage({
  meta: {
    showHeader: false,
    showFooter: false,
  },
});

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
    showToast('Login successful');
    const redirect = (route.query.redirect as string) || '/';
    router.replace(redirect);
  } catch {
    showToast('Login failed, please check credentials');
  } finally {
    loading.value = false;
  }
};

/** 第三方登录（占位，需对接实际 OAuth） */
function onSocialLogin(provider: string) {
  showToast(`${provider} login not connected yet`);
}

/** 跳转到注册页 */
function onGoSignUp() {
  // TODO: 注册页完成后跳转 /signup
  showToast('Sign up page coming soon');
}

/** 忘记密码 */
function onForgotPassword() {
  // TODO: 忘记密码页完成后跳转
  showToast('Forgot password coming soon');
}
</script>

<style scoped>
/*
 * ─── 间距变量：以设计稿 393×852 为基准 ─────────────────────────
 * 标题区 top 88px；标题(68) → 输入1(294)；输入1(54) → 输入2(380)；
 * 输入2(56) → Forgot(441)；Forgot(34) → 按钮(515)；按钮(56) → OR(611)；
 * OR(15) → 社交(658)；社交(48) → 注册入口(bottom 102)。
 * 小屏（≤736px 高）通过媒体查询压缩，保证内容不溢出。
 */
.login-oths-page {
  --login-pt: 88px;
  --login-gap: 138px;
  --login-field-gap: 32px;
  --login-forgot-mt: 5px;
  --login-btn-mt: 40px;
  --login-divider-mt: 40px;
  --login-social-mt: 32px;
  --login-social-gap: 42px;
  --login-signup-mt: 44px;
}

/* Chakra 装饰：设计 left 270 / top 55、198×198、右缘溢出 75.5px */
.chakra-deco {
  top: 55px;
  right: -75px;
  width: 198px;
  height: 198px;
  transform: rotate(180deg) scaleX(-1);
  opacity: 0.15;
}

:global(.dark) .chakra-deco {
  opacity: 0.08;
}

/* ─── 输入框容器：校验错误绝对定位，不占布局空间 ─── */
.field-wrapper {
  position: relative;
  overflow: visible;
}

/* 覆盖 van-cell 样式（设计：345×54 / 白底 / 圆角 16 / padding 18 / 浅阴影） */
.field-wrapper :deep(.van-cell) {
  height: 54px;
  padding: 0 18px;
  border-radius: 16px;
  background: var(--color-bg-surface);
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);
  overflow: visible;
}

.login-field :deep(.van-field__control) {
  font-size: 12px;
  font-family: 'Poppins', ui-sans-serif, system-ui, sans-serif;
}

.login-field :deep(.van-field__control::placeholder) {
  color: var(--color-text-secondary);
  font-size: 12px;
}

/* 校验错误：绝对定位，不撑开布局 */
.login-field :deep(.van-field__error-message) {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  font-size: 10px;
  line-height: 1.2;
  color: #ee0a24;
  z-index: 1;
}

/* ─── 登录按钮（设计渐变 70.56deg：#89C6FF → #BC91D3） ─── */
.login-btn {
  background-image: linear-gradient(70.56deg, #89c6ff 6.7%, #bc91d3 102.9%);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
}

:global(.dark) .login-btn {
  background-image: linear-gradient(70.56deg, #5a7fcf 6.7%, #8b6db8 102.9%);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
}

/* ─── OR 分隔线 ─── */
.or-line {
  height: 1px;
  flex: 1;
}

.or-line-left {
  background: linear-gradient(90deg, rgba(139, 139, 139, 1) 0%, rgba(248, 249, 250, 0) 80%);
}

.or-line-right {
  background: linear-gradient(270deg, rgba(139, 139, 139, 1) 0%, rgba(248, 249, 250, 0) 80%);
}

:global(.dark) .or-line-left {
  background: linear-gradient(90deg, rgba(139, 139, 139, 1) 0%, rgba(30, 30, 32, 0) 80%);
}

:global(.dark) .or-line-right {
  background: linear-gradient(270deg, rgba(139, 139, 139, 1) 0%, rgba(30, 30, 32, 0) 80%);
}

/* ─── 社交按钮 ─── */
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

/* ─── 加载转圈 ─── */
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

/* ─── 深色模式：输入框阴影 ─── */
:global(.dark) .field-wrapper :deep(.van-cell) {
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3);
}

:global(.dark) .login-field :deep(.van-field__control) {
  color: var(--color-text-primary);
}

/*
 * ─── 紧凑屏适配（视口高度 ≤ 736px） ───────────────────────────
 * 覆盖 iPhone SE / 6 / 7 / 8 等小屏设备：压缩间距与元素尺寸。
 */
@media (max-height: 736px) {
  .login-oths-page {
    --login-pt: 44px;
    --login-gap: 64px;
    --login-field-gap: 24px;
    --login-forgot-mt: 4px;
    --login-btn-mt: 24px;
    --login-divider-mt: 20px;
    --login-social-mt: 18px;
    --login-social-gap: 32px;
    --login-signup-mt: 24px;
  }

  .chakra-deco {
    top: 30px;
    right: -70px;
    width: 170px;
    height: 170px;
  }

  .login-title h1 {
    font-size: 20px;
    line-height: 28px;
  }

  .login-title p {
    font-size: 13px;
    margin-top: 4px;
  }

  .field-wrapper :deep(.van-cell) {
    height: 46px;
    padding: 0 14px;
  }

  .login-btn {
    height: 44px;
  }

  .social-btn {
    height: 38px;
    min-width: 38px;
    padding: 6px 20px;
  }
}

/*
 * ─── 超高屏（≥ 900px，如大屏安卓 / 平板） ─────────────────────
 * 内容垂直居中，避免表单悬在顶部太空旷。
 */
@media (min-height: 900px) {
  .login-oths-page > div {
    justify-content: center;
  }
}
</style>
