<template>
    <div class="manage-breamub">
        <a-breadcrumb>
            <a-breadcrumb-item v-for="(item) in breamubList" :key="item.path">
                <router-link v-if="item.path && currentPath !== item.path" :to="`${item.path}`">
                    {{ item.name }}
                </router-link>
                <span v-else>{{ item.name }}</span>
            </a-breadcrumb-item>
        </a-breadcrumb>
    </div>
</template>
<script lang="ts">
import { Breadcrumb } from "ant-design-vue";
import { useAction, useState } from "@/hooks";
import { defineComponent, watch, PropType, reactive, toRefs } from "vue";
import { useRoute } from "vue-router";
export default defineComponent({
    components: {
        Breadcrumb,
    },
    props: {
        routeList: {
            type: Array as PropType<any[]>,
            require: true,
        },
        activeKey: {
            type: Number,
            require: true,
        }
    },
    setup(props) {
        const route: any = useRoute();
        let state = reactive({
            breamubList: [] as any[],
            currentPath: route.path,
        });
        const storeState = useState("mainModule", [
            "selectedKeys",
            "breamubTitle",
            "isBreamub",
        ]);

        watch([() => props.routeList, route], (next, prev) => {
            const [routeList = [], route ] = next
            state.breamubList = getBreamubList(routeList as any[], route.path, []);
        });

        /**
         * 获取面包屑列表
         * @param
         * @return
         */
        const getBreamubList = (routeList: any[], path: any, breamubList: any[]): any => {
            for (let i = 0; i < routeList.length; i++) {
                const routeItem = routeList[i];
                if (routeItem.path === path) {
                    breamubList.push(routeItem);
                    return breamubList;
                }
                if (Array.isArray(routeItem.children) && routeItem.children.length) {
                    const result = getBreamubList(routeItem.children, path, ([] as any).concat(breamubList, [routeItem]))
                    if (Array.isArray(result)) {
                        return result
                    }
                    
                }
            }
            
        };

        return {
            ...toRefs(state),
            ...storeState,
        };
    },
});
</script>
<style lang="less" scoped>
.manage-breamub {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: @space-lg;
    height: 48px;
    background: #fff;
    border-top: 1px solid #f0f0f0;
}
// .breamub-title::before {
//     content: "";
//     border-left: 5px solid #40a9ff;
//     padding-right: 15px;
// }
// .breamub-title {
//     display: inline-block;
//     font-size: 18px;
//     padding: 16px;
//     letter-spacing: 1px;
//     color: #878789;
//     font-weight: 600;
// }
</style>