import { ref } from "vue";

/**
 * 硒茶状态管理
 */
export default {
  namespaced: true,
  state: {
    isStBreamub: ref<Boolean>(false),
    breamubTitle: ref<String>(""),
    approvalStatus: ref<Number>(-1),
    reason: ref<string>(""),
    stSelectedKeys: ref<Array<string>>([]),
    userInfo: ref<Object>({}),
  },
  mutations: {
    // 更改原因状态
    updateReason(state: { reason: any }, payload: { reason: any }) {
      state.reason = payload.reason;
    },
    // 更改审核状态
    updateApprovalStatus(
      state: { approvalStatus: any },
      payload: { approvalStatus: any }
    ) {
      state.approvalStatus = payload.approvalStatus;
    },
    // 更改用户数据状态
    updateUserInfo(state: { userInfo: any }, payload: { userInfo: any }) {
      state.userInfo = payload.userInfo;
    },
    // 更改硒茶面包屑数据状态
    updateStBreamub(
      state: { isStBreamub: any },
      payload: { isStBreamub: any }
    ) {
      state.isStBreamub = payload.isStBreamub;
    },
    // 更改硒茶顶部的选中状态
    updateStSelectedKeys(
      state: { stSelectedKeys: any },
      payload: { stSelectedKeys: any }
    ) {
      state.stSelectedKeys = payload.stSelectedKeys;
    },

    // 更改面包屑标题
    updateBreamubTitle(
      state: { breamubTitle: any },
      payload: { breamubTitle: any }
    ) {
      state.breamubTitle = payload.breamubTitle;
    },
  },
  actions: {
    // 更改原因
    asyncUpdateReason({ commit }: any, payload: any) {
      commit("updateReason", payload);
    },
    // 更改审核状态
    asyncUpdateApprovalStatus({ commit }: any, payload: any) {
      commit("updateApprovalStatus", payload);
    },
    // 更改用户数据状态
    asyncUpdateUserInfo({ commit }: any, payload: any) {
      commit("updateUserInfo", payload);
    },
    // 更改硒茶面包屑数据状态
    asyncUpdateIsStBreamub({ commit }: any, payload: any) {
      commit("updateStBreamub", payload);
    },
    // 更改硒茶顶部的选中状态
    asyncUpdateStSelectedKeys({ commit }: any, payload: any) {
      commit("updateStSelectedKeys", payload);
    },

    // 更改面包屑标题
    asyncUpdateBreamubTitle({ commit }: any, payload: any) {
      commit("updateBreamubTitle", payload);
    },
  },
  getters: {
    isStBreamub: (state: { isStBreamub: any }) => state.isStBreamub,
    userInfo: (state: { userInfo: any }) => state.userInfo,
    approvalStatus: (state: { approvalStatus: any }) => state.approvalStatus,
    breamubTitle: (state: { breamubTitle: any }) => state.breamubTitle,
  },
};
