<template>
    <div class="error">
        <div class="error-title">404</div>
        <div class="error-remark">暂未查到该路由信息!</div>
        <div class="error-btns">
            <a-button danger @click="actionReturn">退出登录</a-button>
        </div>
    </div>
</template>
<script lang="ts">
import request from '@/utils/axios';
import { message } from 'ant-design-vue';
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
export default defineComponent({
    setup() {
        const router = useRouter();
        const actionReturn = () => {
            localStorage.removeItem("token");
            request({
                url: import.meta.env.VITE_BASE_URL + "/logout",
                type: "json",
                method: "get"
            }).then((res) => {
                message.success("已退出登录")
                router.push("/login");
            });
        }
        return {
            actionReturn
        }
    }
})
</script>
<style lang="less" scoped>
.error {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10rem 0;
}

.error-title {
    font-size: 10rem;
    letter-spacing: 1px;
    background-image: -webkit-linear-gradient(bottom, #1e80ff, #40a9ff, #fff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.error-remark {
    font-size: 1.5rem;
    margin: 0 0 20px 0;
    letter-spacing: 1px;
    color: #5f5e5e;
}
</style>