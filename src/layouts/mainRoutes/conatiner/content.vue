<template>
    <a-layout-content class="manage-content">
        <div class="manage-content-layout" :class="isFluidPage && 'fullPage'">
            <router-view />
        </div>
    </a-layout-content>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
// 是否是全屏isFluidPage
const isFluidPage = ref<boolean>(false);
// 当前路由的配置
const route = useRoute();

/**
 * @description: 获取路由配置的参数 - 判断是否需要背景色
 * @return {*}
 */
const handleGetPageSetting = () => (isFluidPage.value = route.meta ? !!route.meta.isFluidPage : false);
// 第一次初始化时候执行
handleGetPageSetting();
// 监听路由变化
watch(
    () => route.name,
    (newVal) => handleGetPageSetting()
);
</script>
<style lang="less" scoped>
.manage-content {
    flex: 1;
    overflow-y: hidden;
    padding: @space-md @space-md 11px @space-md;
}
.manage-content-layout {
    height: 100%;
    overflow-y: auto;
    padding: @space-lg;
    background: #fff;
    box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    &.fullPage {
        padding: 0;
        background: #fff;
        box-shadow: none;
        border-radius: 0;
        background: transparent;
    }
}

.manage-content-layout::-webkit-scrollbar {
    width: 5px;
    height: 10px;
}
.manage-content-layout::-webkit-scrollbar-track {
    background: #fff;
    border-radius: 2px;
}
.manage-content-layout::-webkit-scrollbar-thumb {
    background: #cdcece;
    border-radius: 10px;
}
.manage-content-layout::-webkit-scrollbar-thumb:hover {
    background: #333;
}
.manage-content-layout::-webkit-scrollbar-corner {
    background: #fff;
}
</style>
