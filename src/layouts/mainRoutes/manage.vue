<template>
    <a-layout class="manage">
        <Header :routes="routes" v-model:activeKey="activeKey" @change="handleTabChange" />
        <a-layout>
            <Sider ref="sliderRef" :routeList="routeList"  :activeKey="activeKey" />
            <a-layout>
                <Breaumb :routeList="routeList" :activeKey="activeKey" />
                <Content />
            </a-layout>
        </a-layout>
    </a-layout>
</template>

<script lang="ts">
import { isEmpty } from "@/utils/common";
import {
    Sider,
    Header,
    Breaumb,
    Content,
} from "@/layouts/mainRoutes/conatiner";
import { Store } from "ant-design-vue/lib/form/interface";
import { defineComponent, reactive, ref, toRefs, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import request from "@/utils/axios";
import { message } from "ant-design-vue";
import { convertTree } from "@/utils/function";
export default defineComponent({
    components: {
        Sider,
        Header,
        Breaumb,
        Content,
    },
    setup() {
        let state = reactive({
            store: ref<Store>(useStore()),
            routes: [] as any,
            activeKey: -1,
            routeList: [] as any
        });

        const router = useRouter();
        const route = useRoute();
        const sliderRef = ref()
        if (isEmpty(localStorage.getItem("token"))) {
            message.error("请先登录");
            router.push({ path: "/login" });
        }

        /**
         * 获取选中的一层菜单
         * @param { Array } routes 路由列表
         * @param { String } firstKey 一级路由
         * @return
         */
        const getActiveKey = (routes: any[], firstKey?: number) => {
            
            for (let i = 0; i < routes.length; i++) {
                const routeItem = routes[i];
                if (routeItem.path === route.path) {
                    state.activeKey = firstKey ? firstKey : routeItem.id;
                }
                if (Array.isArray(routeItem.children) && routeItem.children.length) {
                    getActiveKey(routeItem.children, firstKey ? firstKey : routeItem.id);
                }
            }
        };

        const getRoutes = async () => {
            let res = await request({
                url: import.meta.env.VITE_BASE_URL + "/menu/current/user/menu",
                type: "json",
                method: "get",
            });
            if (res.code == 200) {
                const menus = res.data as any;
                if (Array.isArray(menus) && menus.length) {
                    const routes = convertTree(menus
                            .sort((a: any, b: any) => a.num - b.num)
                            .map((item: any) => {
                                return Object.assign({}, item, {
                                    path: item.url,
                                    title: item.name,
                                });
                            }),{ id: "id", pid: "parentId" }
                    );
                    state.routes = routes
                    if (route.path === '/') {
                        const activeKey = routes[0].id
                        state.activeKey = activeKey
                        handleTabChange(activeKey)
                    } else {
                        getActiveKey(routes);
                    }
                    
                } else {
                    router.push("/error");
                }
            }
        };


        /**
         * 处理tab改变时触发
         * @param
         * @return
         */
        const handleTabChange = (activeKey: number) => {
            const { routes } = state
            for (let i = 0; i < routes.length; i++) {
                if (routes[i].id === activeKey) {
                    const routeList = routes[i].children || []
                    for (let i = 0; i < routeList.length; i++) {
                        const routes = routeList[i]
                        if (routes && Array.isArray(routes.children) && routes.children.length ) {
                            for (let j = 0; j < routes.children.length; j++) {
                                const routeItem = routes.children[j];
                                if (routeItem.ismenu === "Y" && routeItem.path) {
                                    sliderRef.value.setOpenKeys([routes.path])
                                    router.push(routeItem.path)
                                    return
                                }
                            }
                        }
                    }
                }
            }
        }

        getRoutes();

        watch([() => state.routes, () => state.activeKey], (newValue) => {
            const [routes, activeKey] = newValue
            for (let i = 0; i < routes.length; i++) {
                if (routes[i].id === activeKey) {
                    state.routeList = routes[i].children || []
                }
            }
        }, { immediate: true })

        return {
            ...toRefs(state),
            sliderRef,
            handleTabChange,
        };
    },
});
</script>

<style scoped>
.manage {
    height: 100vh;
    overflow: hidden;
}
</style>
