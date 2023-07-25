<template>
    <a-layout-header class="manage-header">
        <div class="manage-header-left">
            <div class="manage-header-icon">
                <!-- <img :src="defaultLogo" alt=""> -->
                <Image width="34px" height="34px" :src="defaultLogo" :previewMask="false"></Image>
            </div>
            <div class="manage-header-name">石台硒产业生态大脑数字平台</div>
            <!-- {{ userInfo.tenantName }} -->
        </div>

        <div class="manage-header-content">
            <Tabs v-model:activeKey="innerActiveKey" @change="handleTabChange">
                <TabPane v-for="(tabItem) in routes" :key="tabItem.id" :tab="tabItem.name">{{ tabItem.name }}</TabPane>
            </Tabs>
        </div>
        <!-- <div class="action">
            <div class="action-collapsed">
                <menu-unfold-outlined v-if="collapsed" class="action-icon" @click="clickTrigger" />
                <menu-fold-outlined v-else class="action-icon" @click="clickTrigger" />
            </div>
            <div class="action-reload">
                <RedoOutlined class="action-icon" @click="()=> { $router.go(0) }" />
            </div>
        </div> -->

        <div class="manage-header-right">
            <div class="manage-header-mail">
                <Badge :count="3">
                    <img :src="mailImg" alt="">
                </Badge>
            </div>
            <div class="manage-header-user">
                <img :src="userImg" alt="">
            </div>

            <div class="manage-heade-username">{{ userInfo.name }}</div>
            <div class="manage-heade-logout">
                <a-popover placement="left">
                    <template #content>
                        <p class="popover-menu"><span>个人中心</span></p>
                        <p class="popover-menu" @click="logout"><span>退出登录</span></p>
                    </template>
                    <img :src="downImg" alt="">
                </a-popover>
            </div>
        </div>
        <a-drawer title="通知" placement="right" :closable="false" v-model:visible="visible">
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
import { defineComponent, ref, PropType, watch } from "vue";
import { message, Badge, Tabs } from "ant-design-vue";
import { TabPane } from 'ant-design-vue/es/tabs'
import { Image } from "ant-design-vue";
import defaultLogo from "@/assets/image/main/layout/logo.png";
import mailImg from "@/assets/image/main/layout/mail.png";
import userImg from "@/assets/image/main/layout/user.png";
import downImg from "@/assets/image/main/layout/down.png";
export default defineComponent({
    components: {
        MenuUnfoldOutlined,
        MenuFoldOutlined,
        RedoOutlined,
        Badge,
        Image,
        Tabs,
        TabPane
    },
    props: {
        routes: {
            type: Array as PropType<any[]>,
            require: true,
        },
        activeKey: {
            type:  Number,
        }
    },
    emits: ["update:activeKey", "change"],
    setup(props, {emit}) {
        const visible = ref<boolean>(false);
        const innerActiveKey = ref<string | number>("")
        const router = useRouter();
        const storeState = useState("mainModule", [
            "collapsed",
            "isLogo",
            "userInfo",
        ]);
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
                method: "get",
            }).then((res) => {
                message.success("已退出登录");
                router.push("/login");
            });
            //
        };

        const showDrawer = () => {
            visible.value = true;
        };

        /**
         * 处理切换tab事件
         * @param { String | Number } activeKey 当前选中的tab的id
         * @return
         */
        const handleTabChange = (activeKey: string | number) => {
            innerActiveKey.value = activeKey
            emit("change", activeKey)
            emit("update:activeKey", activeKey)
        }

        watch(() => props.activeKey as any, (newValue) => {
            innerActiveKey.value = newValue || ""
        }, { immediate: true })

        

        return {
            visible,
            innerActiveKey,
            showDrawer,
            handleTabChange,
            clickTrigger,
            logout,
            defaultLogo,
            mailImg,
            userImg,
            downImg,
            ...storeState,
        };
    },
});
</script>


<style scoped lang="less">
.manage-header {
    background: #fff !important;
    padding: 0;
    display: flex;
    align-items: center;
    line-height: normal;
    box-shadow: @box-shadow-base;
}

// .manage-header-left {
//     display: flex;
//     flex-direction: row;
//     align-items: center;
// }

.manage-header-icon {
    display: inline-block;
    margin: 0 31px 0 19px;
    width: 34px;
    height: 34px;
    vertical-align: middle;
    :deep(img) {
        display: block;
        width: 100%;
        height: 100%;
    }
}

.manage-header-name {
    display: inline-block;
    color: @primary-color;
    font-size: @font-size--md;
    font-weight: bold;
}

.manage-header-content {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    :deep(.ant-tabs) {
        .ant-tabs-nav {
            margin-bottom: 0;
        }
        .ant-tabs-nav::before {
            display: none;
        }
        .ant-tabs-content-holder {
            display: none;
        }
        .ant-tabs-tab {
            padding: 21px 0;
        }
    }
}

.manage-header-right {
    padding-right: 49px;
}

.manage-header-mail,
.manage-header-user {
    display: inline-block;
    width: 20px;
    height: 20px;
    vertical-align: middle;
    img {
        width: 20px;
        height: 20px;
    }
}

.manage-header-user {
    margin-left: 74px;
    margin-right: @space-sm;
}

.manage-heade-logout,
.manage-heade-username {
    display: inline-block;
    vertical-align: middle;
    div {
        vertical-align: middle;
    }
    img {
        width: 16px;
        height: 16px;
    }
}

@media only screen and (max-width: 1600px) {
    .manage-header-icon {
        margin: 0 27px 0 16px;
    }
    .manage-header-user {
        margin-left: 60px;
    }
}

@media only screen and (max-width: 1200px) {
    .manage-header-icon {
        margin: 0 23px 0 12px;
    }
    .manage-header-user {
        margin-left: 45px;
    }
}

@media only screen and (max-width: 992px) {
    .manage-header-icon {
        margin: 0 19px 0 9px;
    }
    .manage-header-user {
        margin-left: 30px;
    }
}

@media only screen and (max-width: 768px) {
    .manage-header-icon {
        margin: 0 15px 0 6px;
    }
    .manage-header-user {
        margin-left: @space-md;
    }
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