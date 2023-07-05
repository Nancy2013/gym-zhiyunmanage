<template>
    <div class="no-layouts-breamub" v-if="isStBreamub">
        <div class="breamub-left">
            <Breadcrumb>
                <BreadcrumbItem v-for="(breamubItem) in breamubTitleList" :key="breamubItem.path">
                    <router-link to><span @click="$router.replace({ path: breamubItem.path })">{{ breamubItem.title }}</span></router-link>
                </BreadcrumbItem>
            </Breadcrumb>

        </div>
        <!-- <div class="breamub-right" v-if="approvalStatus != -1">
         <div class="status-reason" v-if="approvalStatus == 3">
            <span class="dot"></span>
            <label>驳回原因: </label>
            <span>{{ reason }}</span>
         </div>
         <span v-if="approvalStatus == 1" :class="`status-text status-${approvalStatus}`">待审核</span>
         <span v-if="approvalStatus == 2" :class="`status-text status-${approvalStatus}`">已认证</span>
         <span v-if="approvalStatus == 3" :class="`status-text status-${approvalStatus}`">已驳回</span>
      </div> -->
    </div>
</template>
<script lang="ts">
import { useAction, useState } from "@/hooks";
import { useRoute, useRouter, RouteRecordRaw } from "vue-router";
import { Breadcrumb } from "ant-design-vue";
import { stAuthority } from "@/layouts/stRoutes/router/config";
import { defineComponent, watch, reactive, ref, toRefs } from "vue";
import { isEmpty } from "@/utils/common";
interface BreadcrumbItem {
    path: string,
    title?: string
}
export default defineComponent({
    components: {
        Breadcrumb,
        BreadcrumbItem: Breadcrumb.Item,
    },
    setup() {
        const route = useRoute();
        const getBreadcrumbFromPath = (routeList: RouteRecordRaw[], routerpath: string): BreadcrumbItem | undefined => {
            for (let i = 0; i < routeList.length; i++) {
                const routeItem = routeList[i];
                if (routeItem.path === routerpath && routeItem.title) {
                    return {
                        path: routeItem.path,
                        title: routeItem.title, 
                    };
                }
                if ( Array.isArray(routeItem.children) && routeItem.children.length ) {
                    const routerData = getBreadcrumbFromPath(routeItem.children, routerpath);
                    if (routerData && routerData.title) {
                        return routerData
                    }
                }
            }
        };

        const getBreadcrumb = (): BreadcrumbItem[] => {
            const routePathList = route.path.split("/");
            let path = "", breamubList: BreadcrumbItem[] = [];
            for (let i = 0; i < routePathList.length; i++) {
                const routePath = routePathList[i];
                if (routePath) {
                    path += `/${routePath}`;
                    const breadcrumbData = getBreadcrumbFromPath(stAuthority, path)
                    if (breadcrumbData) {
                        breamubList.push(breadcrumbData)
                    }
                }
            }
            return breamubList
        };

        const breamubTitleList = ref<BreadcrumbItem[]>(
            getBreadcrumb()
        );
        const storeState = useState("stModule", [
            "isStBreamub",
            "approvalStatus",
            "reason",
        ]);
        watch([route], (next, prev) => {
            breamubTitleList.value = getBreadcrumb();
        });
        return {
            ...storeState,
            breamubTitleList,
            isEmpty,
        };
    },
});
</script>
<style lang="less" scoped>
.no-layouts-breamub {
    margin: 16px 16px 0;
    height: 54px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 0;
}

.breamub-title {
    font-weight: 400;
    color: #151515;
}

.breamub-left {
    display: inline-flex;
    border-left: 4px solid #3873f0;
    padding-left: 30px;
    height: 25px;
}

.breamub-right {
    display: inline-flex;
    align-items: center;

    .status-reason,
    .status-text {
        display: inline-block;
    }
    .status-reason {
        margin-right: 30px;
        .dot {
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #d81e06;
            margin-right: 10px;
        }
    }
    .status-text {
        padding: 6px 10px;
        &.status-1 {
            color: #ff8814;
            background: #fbebd0;
        }
        &.status-2 {
            color: #185ef0;
            background: #e6ecfc;
        }
        &.status-3 {
            color: #d81e06;
            background: #fde6e6;
        }
    }
}
</style>