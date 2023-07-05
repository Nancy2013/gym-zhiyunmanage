<template>
    <a-layout-header class="manage-header">
        <div class="action">
            <div class="action-collapsed">
                <menu-unfold-outlined v-if="collapsed" class="action-icon" @click="clickTrigger" />
                <menu-fold-outlined v-else class="action-icon" @click="clickTrigger" />
            </div>
            <div class="action-reload">
                <RedoOutlined class="action-icon" @click="()=> { $router.go(0) }" />
            </div>
        </div>
        <div class="user">
            <div class="user-message">
                <Badge :count="3">
                    <config-icon name="message" color="#333" class="message-icon" @click="showDrawer" />
                </Badge>
            </div>
            <a-avatar class="user-logo">U</a-avatar>
            <span class="user-text">{{ userInfo.tenantName }}</span>
            <a-popover placement="left">
                <template #content>
                    <p class="popover-menu"><span>个人中心</span></p>
                    <p class="popover-menu" @click="logout"><span>退出登录</span></p>
                </template>
                <config-icon name="arrow-down" color="#333" style="width: 15px;" />
            </a-popover>
        </div>
        <a-drawer title="通知" placement="right" :closable="false" v-model:visible="visible" :after-visible-change="afterVisibleChange">
        </a-drawer>
    </a-layout-header>
</template>

<script lang="ts">
import { useAction, useState } from "@/hooks";
import { useRouter } from "vue-router";
import request from "@/utils/axios";
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    RedoOutlined,
} from "@ant-design/icons-vue";
import { defineComponent, ref } from "vue";
import { message, Badge } from 'ant-design-vue'

export default defineComponent({
    components: {
        MenuUnfoldOutlined,
        MenuFoldOutlined,
        RedoOutlined,
        Badge
    },
    setup() {
        const visible = ref<boolean>(false);
        const router = useRouter();
        const storeState = useState("mainModule", ["collapsed", "isLogo", "userInfo"]);
        const storeAction = useAction("mainModule", [
            "asyncUpdateCollapse",
            "asyncUpdateIsLogo",
        ]);
        const clickTrigger = () => {
            const { asyncUpdateCollapse, asyncUpdateIsLogo } = storeAction;
            asyncUpdateCollapse({ collapsed: !storeState.collapsed.value });
            setTimeout(
                () => {
                    asyncUpdateIsLogo({ isLogo: !storeState.isLogo.value });
                },
                storeState.isLogo.value ? 100 : 0
            );
        };

        // 退出登录
        const logout = () => {
            localStorage.removeItem("token");
            request({
                url: import.meta.env.VITE_BASE_URL + "/logout",
                type: "json",
                method: "get"
            }).then((res) => {
                message.success("已退出登录")
                router.push("/login");
            });
            //
        };

        const showDrawer = () => {
            visible.value = true;
        };

        return {
            visible,
            showDrawer,
            clickTrigger,
            logout,
            ...storeState,
        };
    },
});
</script>


<style scoped>
.manage-header {
    background: #fff !important;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.action {
    display: inline-flex;
}
.action-icon {
    font-size: 18px;
    line-height: 64px;
    padding: 0 12px 0 24px;
    cursor: pointer;
    transition: color 0.3s;
}
.user {
    cursor: pointer;
    display: flex;
    align-items: center;
}

.user-message {
    display: inline-block;
    margin: 0px 20px;
    cursor: pointer;
}
.message-icon {
    width: 25px;
    height: 25px;
    margin: 0;
    vertical-align: -8px;
}
.user-logo {
    margin: 0px 10px;
}

.user-text {
    padding: 0 10px;
}
.popover-menu {
    cursor: pointer;
}
.popover-menu:hover {
    color: #1890ff;
    font-weight: 600;
}
</style>