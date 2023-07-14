<template>
    <a-layout class="manage">
        <Header />
        <a-layout>
            <Sider :routes="routes" />
            <a-layout>
                <Breaumb :routes="routes" />
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
import { defineComponent, reactive, ref, toRefs } from "vue";
import { useRouter } from "vue-router";
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
            routes: [],
        });

        const router = useRouter();
        if (isEmpty(localStorage.getItem("token"))) {
            message.error("请先登录");
            router.push({ path: "/login" });
        }

        const getRoutes = async () => {
            let res = await request({
                url: import.meta.env.VITE_BASE_URL + "/menu/current/user/menu",
                type: "json",
                method: "get",
            });
            if (res.code == 200) {
                const menus = res.data as any;
                if (menus.length) {
                    state.routes = convertTree(
                        menus
                            .sort((a: any, b: any) => a.num - b.num)
                            .map((item: any) =>
                                Object.assign({}, item, {
                                    path: item.url,
                                    title: item.name,
                                })
                            ),
                        { id: "id", pid: "parentId" }
                    );
                    //redirectRouter(state.routes);
                } else {
                    router.push("/error");
                }
            }
        };

        getRoutes()

        return {
            ...toRefs(state),
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
