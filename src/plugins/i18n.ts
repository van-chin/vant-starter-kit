import { createI18n } from 'vue-i18n';
import zhCN from '@/locales/zh-CN';
import en from '@/locales/en';

/**
 * 从 Pinia persist（localStorage key: vsk__app）读取已保存的语言，
 * 保证刷新后语言设置不丢失。
 */
function getInitialLocale(): string {
  try {
    const raw = localStorage.getItem('vsk__app');
    if (raw) {
      const saved = JSON.parse(raw) as { locale?: string };
      if (saved.locale) return saved.locale;
    }
  } catch {
    // 忽略解析错误，使用默认语言
  }
  return 'zh-CN';
}

/** vue-i18n 实例 */
export const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  messages: {
    'zh-CN': zhCN,
    en,
  },
});
