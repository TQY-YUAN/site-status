<template>
  <footer id="footer">
    <n-flex class="link" align="center">
      <n-button
        v-for="(item, key, index) in linkData"
        :key="index"
        :focusable="false"
        quaternary
        circle
        @click="jumpLink(item)"
      >
        <template #icon>
          <Icon :name="`icon:${key}`" />
        </template>
      </n-button>
    </n-flex>
    <n-flex :size="4" class="text" align="center" vertical>
      <!-- 第二行：修改为基于 Cloudflare Workers 自建 -->
      <n-p depth="3">
        {{ $t("footer.basedOn") }}
        <n-text depth="3" @click="jumpLink('https://developers.cloudflare.com/workers/')">
          Cloudflare Workers
        </n-text>
        {{ $t("footer.interface") }} |
        {{ $t("footer.checkFrequency") }}
        {{ $t("footer.fiveMinutes") }}
      </n-p>
      <!-- 第三行：年份固定为 2026，链接改为你的主页 -->
      <n-p depth="3">
        Copyright &copy; 2026
        <n-text depth="3" @click="jumpLink('https://jianc.dpdns.org/')">
          简藏
        </n-text>
        <n-text
          v-if="siteIcp"
          depth="3"
          @click="jumpLink('https://beian.miit.gov.cn/')"
        >
          | {{ siteIcp }}
        </n-text>
      </n-p>
    </n-flex>
  </footer>
</template>

<script setup lang="ts">
const { public: configPublic } = useRuntimeConfig();
const { siteIcp } = configPublic; // version 已移除

const linkData = {
  home: "https://jianc.dpdns.org/",
  // 如需其他图标链接可在此添加，例如：
  // github: "https://github.com/yourname",
};
</script>

<style lang="scss" scoped>
footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px 90px;
  margin-top: auto;
  z-index: 100;
  .text {
    margin-top: 12px;
    .n-p,
    .n-text {
      margin: 0;
      font-size: 13px;
      line-height: 26px;
    }
    .n-text {
      font-weight: bold;
      cursor: pointer;
      &:hover {
        color: var(--normal-color);
      }
    }
  }
}
</style>
