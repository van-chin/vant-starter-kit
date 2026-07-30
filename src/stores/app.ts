/** 应用全局配置 Store */
export const useAppStore = defineStore(
  'app',
  () => {
    // ─── State ───
    /** 当前语言 */
    const locale = ref('zh-CN');

    /** 是否首次启动 */
    const isFirstLaunch = ref(true);

    // ─── Actions ───

    /** 切换语言 */
    const setLocale = (lang: string) => {
      locale.value = lang;
    };

    /** 标记已启动 */
    const markLaunched = () => {
      isFirstLaunch.value = false;
    };

    return { locale, isFirstLaunch, setLocale, markLaunched };
  },
  {
    persist: true,
  },
);
