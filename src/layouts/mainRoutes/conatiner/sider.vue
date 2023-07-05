<template>
  <a-layout-sider
    class="manage-silder"
    theme="light"
    v-model:collapsed="collapsed"
    :trigger="null"
    collapsible
  >
    <div class="logo">
      <span v-if="!isLogo">复创智云平台</span>
      <img v-if="isLogo" src="@/assets/image/logo.png" />
    </div>
    <a-menu
      mode="inline"
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      @select="selectKeysClick"
    >
      <template v-for="(item, index) in routes" :key="index">
        <template v-if="item.children">
          <a-sub-menu :index="item.path" :key="item.path">
            <template #icon>
              <config-icon :name="item.icon" class="svgClass" />
            </template>
            <template #title>
              <span>{{ item.title }}</span>
            </template>

            <div :key="subItem.path"
              v-for="(subItem, subIndex) in item.children">
              <a-menu-item v-if="!subItem.hideInMenu" :key="subItem.path">
                <span>{{ subItem.title }}</span>
                <router-link :to="subItem.path" :key="subIndex" />
              </a-menu-item>
            </div>
            
          </a-sub-menu>
        </template>

        <template v-else>
          <a-menu-item :key="item.path">
            <template #icon>
              <config-icon :name="item.icon" class="svgClass" />
            </template>
            <span>{{ item.title }}</span>
            <router-link :to="item.path" />
          </a-menu-item>
        </template>
      </template>
    </a-menu>
  </a-layout-sider>
</template>

<script lang="ts">
import { useAction, useState } from "@/hooks";
import { useRouter } from "vue-router";
import { defineComponent, toRefs, reactive, onMounted } from "vue";



export default defineComponent({
  setup() {
    let state = reactive({
      routes: [] as any,
    });

    const router = useRouter();
    const storeState = useState('mainModule',["collapsed", "isLogo", "openKeys", "selectedKeys"]);
    const storeAction = useAction('mainModule',['asyncUpdateSelectedKeys'])
    const selectKeysClick = (e: any) => {
      const { asyncUpdateSelectedKeys } = storeAction
      asyncUpdateSelectedKeys({selectedKeys: e.selectedKeys})
    };

    // 得到路由信息
    const getRoutes = () => {
      state.routes = router
        .getRoutes()
        .filter((item) => Object.is(item.name, "manage"))
        .map((ele) => ele.children)[0];
    };

    onMounted(() => {
      getRoutes();
    });

    return {
      ...toRefs(state),
      ...storeState,
      selectKeysClick,
    };
  },
});
</script>

<style scoped>
.manage-silder {
  /* border-right: 1px solid #d8d8d8; */
  box-shadow: 1px 1px 4px 1px #f6f6f6;
}
.manage-silder .logo {
  height: 32px;
  padding: 16px;
  background: rgb(244 245 245 / 30%);
  text-align: center;
  line-height: 32px;
  letter-spacing: 1px;
  box-sizing: content-box;
}
.manage-silder .logo span {
  color: #1e80ff;
  font-weight: 600;
  font-size: 16px;
}
.manage-silder .logo img {
  height: 100%;
}
.svgClass {
  vertical-align: -3px;
}
.ant-menu-inline {
  border: none;
}
</style>