<template>
    <a-layout class="manage">
        <Sider />
        <a-layout>
            <Header />
            <Breaumb />
            <Content />
        </a-layout>
    </a-layout>
</template>

<script lang="ts">
import { useAction } from "@/hooks";
import { isEmpty } from "@/utils/common";
import {
    Sider,
    Header,
    Breaumb,
    Content,
} from "@/layouts/mainRoutes/conatiner";
import { Store } from "ant-design-vue/lib/form/interface";
import { defineComponent, reactive, ref, toRefs, onMounted } from "vue";
import { RouteRecordRaw, useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { message } from "ant-design-vue";
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
        });

        const router = useRouter();
        const route = useRoute();
        if (isEmpty(localStorage.getItem("token"))) {
            message.error("请先登录")
            router.push({ path: '/login' })
        }
        const storeAction = useAction("mainModule", [
            "asyncUpdateSelectedKeys",
            "asyncUpdateOpenKeys",
        ]);
        const redirectRouter = () => {
            const routes: RouteRecordRaw[] = router
                .getRoutes()
                .filter((item) => Object.is(item.name, "manage"))
                .map((item) => item.children)[0];
            if (route.path == "/") {
                let url: string = routes[0].children ? routes[0].children[0].path : routes[0].path;
                router.push(url);
                selectKeysClick([url]);
                openKeysClick([routes[0].path]);
            } else {
                route.matched.forEach((item, index) => {
                    let getOpenkeys: string =
                        item.path && index != 0
                            ? route.matched[index - 1].path
                            : "";
                    console.log('getOpenkeys', getOpenkeys)
                    openKeysClick([getOpenkeys]);
                });
                selectKeysClick([route.path]);
            }
        };

        const selectKeysClick = (keys: string[]) => {
            const { asyncUpdateSelectedKeys } = storeAction;
            asyncUpdateSelectedKeys({ selectedKeys: keys });
        };

        const openKeysClick = (keys: string[]) => {
            const { asyncUpdateOpenKeys } = storeAction;
            asyncUpdateOpenKeys({ openKeys: keys });
        };

        onMounted(() => {
            redirectRouter();
        });

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
