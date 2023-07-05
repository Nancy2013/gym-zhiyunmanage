<template>
    <div class="gym-login">
        <div class="login-head">
            <img src="@/assets/image/loginLogo.png" />
            <span>欢迎登录</span>
        </div>
        <div class="login-main">
            <img src="@/assets/image/login1.png" class="lbgImg" />
            <img src="@/assets/image/login2.png" class="rbg1Img" />
            <img src="@/assets/image/login3.png" class="rbg2Img" />
            <img src="@/assets/image/login4.png" class="rbg3Img" />
            <div class="login-card">
                <div class="login-card-header">
                    <span>登录</span>
                </div>
                <a-form :model="formState" name="normal_login" class="login-form" @finish="onFinish"
                    @finishFailed="onFinishFailed">
                    <a-form-item :rules="[
                        { required: true, message: '请输入账号' },
                    ]">
                        <a-input v-model:value="formState.userName" placeholder="请输入账号">
                            <template #prefix>
                                <UserOutlined class="site-form-item-icon" />
                            </template>
                        </a-input>
                    </a-form-item>

                    <a-form-item :rules="[
                        { required: true, message: '请输入密码' },
                    ]">
                        <a-input-password v-model:value="formState.password" placeholder="请输入密码">
                            <template #prefix>
                                <LockOutlined class="site-form-item-icon" />
                            </template>
                        </a-input-password>
                    </a-form-item>

                    <a-form-item>
                        <a-button :disabled="disabled" type="primary" html-type="submit" class="login-form-button"
                            @click="interfaceLogin(formState)">
                            登录
                        </a-button>
                    </a-form-item>
                </a-form>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { message } from "ant-design-vue";
import { defineComponent, reactive, computed } from "vue";
import { RouteRecordRaw, useRouter } from "vue-router";
import request from "@/utils/axios";
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { useAction } from "@/hooks";
interface FormState {
    userName: string;
    password: string;
    remember: boolean;
}
export default defineComponent({
    components: {
        UserOutlined,
        LockOutlined,
    },
    setup() {
        const formState = reactive<FormState>({
            userName: '',
            password: '',
            remember: true,
        });

        const router = useRouter();
        const storeAction = useAction("mainModule", ["asyncUpdateUserInfo"]);

        const onFinish = (values: any) => {
            console.log('Success:', values);
        };

        const onFinishFailed = (errorInfo: any) => {
            console.log('Failed:', errorInfo);
        };
        const disabled = computed(() => {
            return !(formState.userName && formState.password);
        });

        // 接口
        const interfaceLogin = async (data: any) => { 
            let res: any = await request({
                url: `${import.meta.env.VITE_BASE_URL}/login`,
                type: "json",
                method: "post",
                data: data,
            });
            const { asyncUpdateUserInfo } = storeAction;
            asyncUpdateUserInfo({ userInfo: res.data });
            localStorage.setItem("token", res.data.token);
            router.push({ path: '/' });
            message.success("登录成功!");
        }

        return {
            formState,
            onFinish,
            onFinishFailed,
            interfaceLogin,
            disabled,
        };
    },
});
</script>
<style lang="less" scoped>
@num: 14;

.gym-login {
    margin: 0 auto;
}

.login-head {
    width: 100%;
    height: calc(88em / @num);
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 2px 5px 0 rgb(151 151 151);
    z-index: 10;
}

.login-head img {
    width: calc(147em / @num);
    margin-left: calc(100em / @num);
}

.login-head span {
    font-size: 1.3rem;
    vertical-align: middle;
    letter-spacing: 2px;
    color: #4970e0;
    margin-right: calc(100em / @num);
}

.login-main img:nth-child(1) {
    width: calc(149em / @num);
    height: calc(469em / @num);
    display: block;
    position: fixed;
    left: 0px;
    top: calc(88em / @num);
}

.login-main img:nth-child(2) {
    width: calc(772em / @num);
    height: calc(701em / @num);
    display: block;
    position: fixed;
    right: 0px;
    bottom: 0px;
    z-index: -2;
}

.login-main img:nth-child(3) {
    width: calc(711em / @num);
    height: 100%;
    display: block;
    position: fixed;
    top: calc(88em / @num);
    right: 0px;
    bottom: 0px;
    z-index: -1;
}

.login-main img:nth-child(4) {
    width: calc(573em / @num);
    height: calc(435em / @num);
    display: block;
    position: fixed;
    right: calc(20em / @num);
    bottom: calc(50em / @num);
    z-index: 3;
}

.login-card {
    width: calc(460em / @num);
    position: fixed;
    top: calc(300em / @num);
    left: calc(155em / @num);
    background-color: rgb(19 82 163 / 20%);
    padding: calc(20em / @num);
    border-radius: 10px;
}

.login-card-header {
    text-align: center;
    font-weight: 400;
    font-size: calc(20em / @num);
    border-bottom: 0px;
    color: #ffffff;
    margin-bottom: calc(10em / @num);
    letter-spacing: 1px;
}

.login-card-header span {
    font-size: calc(26em / @num);
    color: #4970e0;
}

.login-form {
    position: relative;
    padding: calc(10em / @num) calc(15em / @num);
    line-height: calc(24em / @num);
}

.login-form .ant-form-item {
    margin: 0 calc(30em / @num) calc(15em / @num);
}

.login-form .ant-input-affix-wrapper {
    border: none;
    border-radius: 5px;
    height: calc(45em / @num);
}

.login-form>input {
    background-color: #f2f2f2;
}

.login-form .login-form-button {
    margin: calc(15em / @num) 0;
    height: calc(45em / @num);
    width: 100%;
}
</style>