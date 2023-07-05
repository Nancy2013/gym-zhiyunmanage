/**
 * 路由管理
 */

// 引入router
import { createRouter, createWebHashHistory } from 'vue-router';
//import routers from './config';
import { stAuthority } from './config';
//import { noAuthority } from './noAuthority';


// 暴露路由
export default createRouter({
    history: createWebHashHistory(),
    routes: [
        ...stAuthority,
        //...noAuthority
    ]
});