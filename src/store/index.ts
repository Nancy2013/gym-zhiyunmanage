/**
 * 全局状态管理
 */
import { createStore } from "vuex";
import createPersistedstate from "vuex-persistedstate";
import mainModule from './mainModule'
import stModule from "./stModule"
import zlModule from './zlModule'

export default createStore({
  // modules
  modules: {
    mainModule,
    stModule,
    zlModule
  },
  plugins: [createPersistedstate()],
});
