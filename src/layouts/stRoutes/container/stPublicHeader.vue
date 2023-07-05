<template>
    <a-layout-header class="no-layouts-header">
        <!-- 左布局 -->
        <div class="header-left">
            <div class="header-left-title">
                <p>石台硒产业生态大脑数字平台</p>
                <!-- <a-divider type="vertical" style="height: 30px; margin-left: 30px; background-color: #fff" /> -->
            </div>
            <!-- <div class="header-left-nav">
                <a-menu mode="horizontal" v-model:selectedKeys="stSelectedKeys" @select="selectKeysClick">
                    <template v-for="(item, index) in routes" :key="index">
                        <template v-if="item.children">
                            <a-sub-menu :index="item.path" :key="item.path">
                                <template #icon>
                                    <svg-icon :name="item.icon" class="svgClass" />
                                </template>
                                <template #title>
                                    <span>{{ item.title }}</span>
                                </template>
                                <a-menu-item :key="subItem.path" v-for="(subItem, subIndex) in item.children">
                                    <span>{{ subItem.title }}</span>
                                    <router-link :to="subItem.path" :key="subIndex" />
                                </a-menu-item>
                            </a-sub-menu>
                        </template>
                        <template v-else-if="item.level == 1">
                            <a-menu-item :key="item.path">
                                <template #icon>
                                    <config-icon :name="item.icon" color="#fff" class="svgClass" />
                                </template>
                                <span>{{ item.title }}</span>
                                <router-link :to="item.path" />
                            </a-menu-item>
                        </template>
                    </template>
                </a-menu>
            </div> -->
        </div>
        <!-- 右布局 -->
        <div class="header-right">
            <div class="header-right-icons">
                <div class="icons-message">
                  <Badge count="">
                    <img :src="messageIcon" @click="$router.push({ path: '/stPublic/application/message' })" />
                   </Badge>
                </div>
                <div class="icons-type">
                    <!-- <label></label>
                    <span>{{ userInfo.deptName }}</span> -->
                    <span>{{ userInfo.name }}</span>
                </div>
                <a-popover>
                    <config-icon name="user-filling" color="#fff" class="svgClass" />
                    <!-- <span style="color:#fff;padding: 0 10px;">{{ userInfo.name }}</span> -->
                    <template #content>
                       <p class="popover-p" @click="$router.push({ path: '/stPublic/dashboard' })"><span>个人中心</span></p>
                       <p class="popover-p" @click="$router.replace('/stlogin')"><span>退出登录</span></p>
                    </template>
                </a-popover>
            </div>
        </div>
    </a-layout-header>
</template>
<script lang="ts">
import { useAction, useState } from '@/hooks';
import { useRouter } from 'vue-router'
import messageIcon from '@/assets/image/messageIcon.png'
import { defineComponent, toRefs, reactive, onMounted } from 'vue'
import { Badge } from 'ant-design-vue'
export default defineComponent({
    components: {
        Badge
    },
    setup() {
        let state = reactive({
            routes: [] as any,
            messageIcon
        });
        const router = useRouter()
        const storeState = useState('stModule', ['userInfo', 'stSelectedKeys'])
        const storeAction = useAction('stModule', ['asyncUpdateStSelectedKeys'])
        // 得到路由信息
        const getRoutes = () => {
            state.routes = router.getRoutes().filter(item => Object.is(item.name, 'stPublic')).map(ele => ele.children)[0]
        }

        // 路由切换
        const selectKeysClick = (e: any) => {
            const { asyncUpdateStSelectedKeys } = storeAction
            asyncUpdateStSelectedKeys({stSelectedKeys:e.selectedKeys})
        }

        onMounted(() => {
            getRoutes();
        })
        return {
            ...toRefs(state),
            ...storeState,
            selectKeysClick
        };
    }
})
</script>
<style scoped>
.no-layouts-header {
    /* background: #629B88 !important; */
    overflow: hidden;
    height: 67px;
    padding: 0 21px 0 48px;
    background: url(@/assets/image/shitai/container/publicHeader/stHeadIcon.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
}

.header-left {
    float: left;
    display: flex;
    align-items: center;
    justify-content: center;
}

.header-left-title {
    padding: 0 20px 0 0;
}

.header-left-title>p {
    margin: 0;
    font-size: 24px;
    font-weight: 500;
    color: #FFFFFF;
    display: inline-block;
    vertical-align: -3px;
}

.header-left-nav:deep(.ant-menu-horizontal) {
    background: transparent;
    color: #fff;
    border: none;
}

.header-left-nav:deep(.ant-menu-horizontal > .ant-menu-item) {
    top: 0;
    height: 48px;
    line-height: 48px;
    margin: 0 10px 0 0;
}
.header-left-nav:deep(.ant-menu-horizontal > .ant-menu-item svg) {
    fill: #fff;
}
.header-left-nav:deep(.ant-menu-horizontal > .ant-menu-item::after) {
    border: none;
}

.header-left-nav:deep(.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item:hover::after) {
    border: none;
}

.header-left-nav:deep(.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item-selected::after) {
    border: none;
}

.header-left-nav:deep(.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item-selected) {
    background: #FFFFFF;
    opacity: 0.85 !important;
    color: #629B88;
}
.header-left-nav:deep(.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item-selected svg) {
    fill: #629B88;
}
.header-right {
    float: right;
}
.header-right-icons .icons-message, .icons-type {
    display: inline-block;
    margin: 0 24px;
    color: #fff;
}
.header-right-icons label {
    display: inline-block;
    width: 20px;
    height: 20px;
    background: #fff;
    vertical-align: -5px;
    margin: 0 10px;
    border-radius: 4px;
}
.header-right-icons img {
    width: 23px;
    vertical-align: -8px;
    cursor: pointer;
}
.header-right-icons svg {
    height: 2rem;
    width: 2rem;
    vertical-align: -10px;
    cursor: pointer;
}
.svgClass {
    vertical-align: -4px;
    margin: 0;
}
.popover-p {
    margin: 15px 0;
    padding: 0;
    cursor: pointer;
}
</style>