import { ref } from "vue";

/**
 * 主路由状态管理
 */
export default {
  namespaced: true,
  state: {
    collapsed: ref<Boolean>(false),
    breamubTitle: ref<String>(""),
    isLogo: ref<Boolean>(false),
    openKeys: ref<Array<string>>([]),
    selectedKeys: ref<Array<string>>([]),
    userInfo: ref<Object>({}),
    menuRoutes: ref<Array<any>>([])
  },
  mutations: {
    // 更改数据状态
    updateCollapse(state: { collapsed: any }, payload: { collapsed: any }) {
      state.collapsed = payload.collapsed;
    },

    // 更改头部状态
    updateIsLogo(state: { isLogo: any }, payload: { isLogo: any }) {
      state.isLogo = payload.isLogo;
    },

    // 更改侧边栏的选中状态
    updateSelectedKeys(
      state: { selectedKeys: any },
      payload: { selectedKeys: any }
    ) {
      state.selectedKeys = payload.selectedKeys;
    },

    // 更改侧边栏二级菜单的打开状态
    updateOpenKeys(state: { openKeys: any }, payload: { openKeys: any }) {
      state.openKeys = payload.openKeys;
    },

    // 更改面包屑标题
    updateBreamubTitle(state: { breamubTitle: any }, payload: { breamubTitle: any }) {
      state.breamubTitle = payload.breamubTitle;
    },

    // 更改用户数据状态
    updateUserInfo(state: { userInfo: any }, payload: { userInfo: any }) {
      state.userInfo = payload.userInfo;
    },

    // 更改菜单数据
    updateMenuRoutes(state: { menuRoutes: any }, payload: { menuRoutes: any }) {
       state.menuRoutes = payload.menuRoutes;
    }
  },
  actions: {
    // 更改数据状态
    asyncUpdateCollapse({ commit }: any, payload: any) {
      commit("updateCollapse", payload);
    },

    // 更改头部状态
    asyncUpdateIsLogo({ commit }: any, payload: any) {
      commit("updateIsLogo", payload);
    },

    // 更改侧边栏的选中状态
    asyncUpdateSelectedKeys({ commit }: any, payload: any) {
      commit("updateSelectedKeys", payload);
    },

    // 更改侧边栏的二级菜单的打开状态
    asyncUpdateOpenKeys({ commit }: any, payload: any) {
      commit("updateOpenKeys", payload);
    },

    // 更改面包屑标题
    asyncUpdateBreamubTitle({ commit }: any, payload: any) {
      commit("updateBreamubTitle", payload);
    },

    // 更改用户数据状态
    asyncUpdateUserInfo({ commit }: any, payload: any) {
       commit("updateUserInfo", payload)
    },

    // 更改菜单数据
    asyncUpdateMenuRoutes({ commit }: any, payload: any) {
       commit("updateMenuRoutes", payload)
    }
  },
  getters: {
    collapsed: (state: { collapsed: any }) => state.collapsed,
    isLogo: (state: { isLogo: any }) => state.isLogo,
    breamubTitle: (state: { breamubTitle: any }) => state.breamubTitle,
    userInfo: (state: { userInfo: any }) => state.userInfo,
    menuRoutes: (state: { menuRoutes: any }) => state.menuRoutes
  },
};
