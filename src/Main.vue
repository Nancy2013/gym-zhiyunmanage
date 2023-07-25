<template>
  <a-config-provider :locale="zhCN">
    <router-view></router-view>
  </a-config-provider>
</template>

<style>
html,
body {
  margin: 0 auto;
}

#app {
  height: 100%;
}


</style>
<script lang="ts">
import { defineComponent } from 'vue';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'
import zhCN from 'ant-design-vue/es/locale/zh_CN';

dayjs.locale('en')
export default defineComponent({
  setup() {
    return {
      zhCN
    }
  }
})
</script>
