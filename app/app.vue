<template>
  <GlobalProvider>
    <n-scrollbar
      :content-style="{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
      }"
      style="height: 100vh"
      @scroll="siteScroll"
    >
      <SiteNav />
      <Transition name="fade">
        <SiteHeader v-if="statusStore.loginStatus" />
      </Transition>
      <!-- 主内容 -->
      <main v-if="siteLoaded" id="main">
        <Transition name="fade" mode="out-in">
          <!-- 密码验证 -->
          <SiteLogin v-if="!statusStore.loginStatus" />
          <!-- 站点卡片 -->
          <SiteCards v-else />
        </Transition>
      </main>
      <SiteFooter />
      <!-- 回到顶部 -->
      <n-back-top :visibility-height="10" />
    </n-scrollbar>
  </GlobalProvider>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const statusStore = useStatusStore();

const { setLocale } = useI18n();

// 加载状态
const siteLoaded = ref<boolean>(false);

// 验证状态 - 直接跳过
const checkSite = async () => {
  // 直接设置登录状态为 true，不再请求 /api/check
  statusStore.loginStatus = true;
  siteLoaded.value = true;
};

// 页面滚动
const siteScroll = (e: Event) => {
  const scrollTop = (e.target as HTMLElement).scrollTop;
  statusStore.scrollTop = scrollTop;
};

// 更改站点语言
const setSiteLang = (lang: string) => {
  setLocale(lang);
  useHead({ htmlAttrs: { lang } });
};

// 监听站点状态
watch(
  () => statusStore.siteStatus,
  (status) => {
    const { siteTitle } = config.public;
    const isError = status === "error" || status === "warn";
    const error = statusStore.siteData?.status?.error || 0;
    const unknown = statusStore.siteData?.status?.unknown || 0;
    useHead({
      title: isError ? `( ${error + unknown} ) ` + siteTitle : siteTitle,
    });
    useFavicon(isError ? "/favicon-error.ico" : "/favicon.ico");
  },
);

// 语言更改
watch(() => statusStore.siteLang, setSiteLang);

onBeforeMount(checkSite);

onMounted(() => {
  setSiteLang(statusStore.siteLang);
});
</script>

<style lang="scss" scoped>
main {
  width: 100%;
  height: 100%;
  flex: 1;
}
</style>
