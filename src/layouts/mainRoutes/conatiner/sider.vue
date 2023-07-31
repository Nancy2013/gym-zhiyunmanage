<template>
    <a-layout-sider class="manage-silder" theme="light" :trigger="null" collapsible>
        <a-menu mode="inline" v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys">
            <template v-for="(item, index) in routeList" :key="index">
                <template v-if="item.children">
                    <a-sub-menu :index="item.path" :key="item.path">
                        <template #icon>
                            <div class="manage-silder-icon" :style="`background-color: ${colorList[index % 5]}`">
                                <tsx-icon v-if="item.icon" color="#fff" width="16px" height="16px" :name="item.icon" class="svgClass" />
                            </div>
                        </template>
                        <template #title>
                            <span>{{ item.title }}</span>
                        </template>

                        <div :key="subItem.url" v-for="(subItem, subIndex) in item.children">
                            <a-menu-item v-if="subItem.ismenu == 'Y'" :key="subItem.path">
                                <span>{{ subItem.title }}</span>
                                <router-link :to="subItem.path" :key="subIndex" />
                            </a-menu-item>
                        </div>
                    </a-sub-menu>
                </template>

                <template v-else>
                    <a-menu-item :key="item.path">
                        <template #icon>
                            <tsx-icon v-if="item.icon" :name="item.icon" class="svgClass" />
                        </template>
                        <span>{{ item.title }}</span>
                        <router-link :to="item.path" />
                    </a-menu-item>
                </template>
            </template>
        </a-menu>
    </a-layout-sider>
</template>

<script lang="ts">
import { useAction, useState } from "@/hooks";
import { RouteRecordRaw, useRoute, useRouter } from "vue-router";
import request from "@/utils/axios";

import { defineComponent, toRefs, reactive, ref, watch, PropType } from "vue";
import { isEmpty } from "@/utils/common";

export default defineComponent({
    props: {
        routeList: {
            type: Array as PropType<any[]>,
            require: true,
        },
    },

    setup(props) {
        let state = reactive({
            openKeys: [] as any[],
            selectedKeys: [] as any[],
        });
        const colorList = [
            "#368EC4",
            "#2BA471",
            "#E37318",
            "#D54941",
            "#50AFA9",
        ];
        const route = useRoute();

        const setOpenKeys = (openKeys: any) => {
            state.openKeys = openKeys;
        };

        /**
         * 路由跳转
         * @param
         * @return
         */
        const redirectRouter = (routeList: any, openKeys = []) => {
            for (let i = 0; i < routeList.length; i++) {
                const routeItem: any = routeList[i];
                if (routeItem.path === route.path) {
                    if (routeItem.ismenu === 'Y') {
                        state.selectedKeys = [routeItem.path];
                    } else {
                        state.selectedKeys = [openKeys[openKeys.length - 1]]
                    }
                    state.openKeys = openKeys
                }
                if (Array.isArray(routeItem.children) && routeItem.children.length) {
                    redirectRouter(routeItem.children, [...openKeys, routeItem.path] as any);
                }
            }
        };

        /**
         * 获取当前选中的路由path
         * @param
         * @return
         */
        const getSelectedKeys = (routeList = props.routeList as any, parentPath: string = "") => {
            for (let i = 0; i < routeList.length; i++) {
                const routeItem = routeList[i]
                if (routeItem.path === route.path) {
                    if (routeItem.ismenu === 'Y') {
                        return route.path
                    } else {
                        return parentPath
                    }
                }
                if (Array.isArray(routeItem.children) && routeItem.children.length) {
                    const path: any = getSelectedKeys(routeItem.children, routeItem.path)
                    if (path) {
                        return path
                    }
                }
            }
        }

        watch(() => props.routeList, (newValue, oldValue) => {
                if (isEmpty(oldValue)) {
                    redirectRouter(newValue);
                } 
            }
        );

        watch(route, (route) => {
            state.selectedKeys = [getSelectedKeys()]
        });

        return {
            ...toRefs(state),
            redirectRouter,
            setOpenKeys,
            colorList,
        };
    },
});
</script>

<style scoped lang="less">
@select-color: #e7ecef;
.manage-silder {
    overflow: auto;
    box-shadow: 1px 1px 4px 1px #f6f6f6;
    :deep(.ant-menu) {
        color: @text-color-secondary;
        .ant-menu-submenu {
            color: @text-color-secondary;
            .ant-menu-submenu-arrow {
                color: @text-color-tertiary;
            }
        }
        .ant-menu-submenu-selected {
            .ant-menu-submenu-title {
                color: @text-color;
            }
            .ant-menu-submenu-arrow {
                color: @text-color;
            }
        }
        .ant-menu-item:hover {
            background-color: rgba(231, 236, 239, 0.7);
            color: @text-color-secondary;
        }

        .ant-menu-item-selected {
            color: @text-color-secondary;
            background-color: @select-color;
        }
        .ant-menu-item-selected:hover {
            color: @text-color-secondary;
            background-color: @select-color;
        }
        .ant-menu-submenu-title:hover {
            color: @text-color;
        }

        .ant-menu-inline .ant-menu-item-selected::after {
            border-right: 6px solid @secondary-color;
        }

        .ant-menu-inline .ant-menu-item {
            width: 100%;
            height: 50px;
            margin: 0;
        }
        .ant-menu-submenu-title {
            width: 100%;
        }

        .ant-menu-submenu-title:active {
            background-color: @select-color;
        }

        svg {
            margin: 0;
        }
    }
}

.manage-silder::-webkit-scrollbar {
    display: none;
    width: 5px;
    height: 5px;
}
.manage-silder::-webkit-scrollbar-track {
    background: #fff;
    border-radius: 2px;
}
.manage-silder::-webkit-scrollbar-thumb {
    background: rgb(205, 206, 206);
    border-radius: 10px;
}
.manage-silder::-webkit-scrollbar-thumb:hover {
    background: #333;
}
.manage-silder::-webkit-scrollbar-corner {
    background: #fff;
}

.manage-silder-icon {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 4px;
}

.manage-silder .logo {
    height: 32px;
    padding: 16px;
    background: rgb(244 245 245 / 30%);
    text-align: center;
    line-height: 32px;
    letter-spacing: 1px;
    box-sizing: content-box;
}

.manage-silder .logo span {
    color: #1e80ff;
    font-weight: 600;
    font-size: 16px;
}

.manage-silder .logo img {
    height: 100%;
}

.svgClass {
    vertical-align: -3px;
}

.ant-menu-inline {
    border: none;
}
</style>