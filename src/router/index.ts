/**
 * 路由管理
 */

// 引入router
import { createRouter, createWebHashHistory } from 'vue-router';
import { mainAuthority } from '@/layouts/mainRoutes/router/config';
import { stAuthority } from "@/layouts/stRoutes/router/config";


// 暴露路由
export default createRouter({
    history: createWebHashHistory(),
    routes: [
        ...mainAuthority,
        ...stAuthority
    ]
});