/**
 * @说明 max Vue 全局混入
 */

 import { mapState } from 'vuex';
 import store from '@/store/index';
 import { App } from 'vue';
 
 // 将定义的state变量key全部加载到全局变量中
 const $mStoreKey = store.state ? Object.keys(store.state as unknown as any) : [];
 export class Max {
     vuex = (name: String, value: any): void=>{
         store.commit('$changeStore', {
             name, value
         })
     }
 }
 
 export default<T> (app: App<T>) => {
     // 全局混入
     // 将vuex方法挂载到$m中
     app.config.globalProperties.$m = new Max();
     app.mixin({
         computed: {
             // 将vuex的state中的所有变量，解构到全局混入的mixin中
             ...mapState($mStoreKey)
         }
     })
 }