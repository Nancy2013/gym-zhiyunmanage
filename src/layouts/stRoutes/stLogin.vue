<template>
    <div class="gym-login">
        <div class="login-main">
            <div class="login-top-bg"></div>
            <div class="login-bottom-bg"></div>
            <div class="login-icon"></div>
            <div class="login-tip"></div>
            <!-- <div class="login-main-left">
                <img src="@/assets/image/loginLeftIcon.png" class="loginLeftImg" />
            </div>
            <div class="login-main-right">
                <img src="@/assets/image/loginRightIcon.png" class="loginRightImg" />
            </div> -->
            <div class="login-card">
                <div class="login-card-header">
                    <span>账号登录</span>
                    <div class="login-card-header-line">
                        <div></div>
                    </div>
                </div>
                <a-form ref="formRef" :model="formState" name="normal_login" class="login-form" @finish="onFinish" @finishFailed="onFinishFailed">
                    <a-form-item :rules="[
                        { required: true, message: '请输入账号' },
                    ]">
                        <a-input v-model:value="formState.userName" placeholder="请输入手机号">
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

                    <!-- <div class="login-tip">
                        <p>忘记密码</p>
                        <p>注册账户</p>
                    </div> -->

                    <a-form-item>
                        <a-button :disabled="disabled" type="primary" html-type="submit" class="login-form-button" @click="interfaceLogin(formState)">
                            登录
                        </a-button>
                    </a-form-item>
                </a-form>
                <!-- <img src="@/assets/image/textIcon.png" class="loginTextImg" /> -->
            </div>

            <div class="loginTextImg">
                <p>石台硒产业大脑生态平台</p>
            </div>
        </div>
    </div>
</template>
<style lang="less" scoped>
@num: 14;

.gym-login {
    margin: 0 auto;
    height: 100%;
    background-color: #f1f4fd;
}

.login-top-bg {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 177px;
    background-size: 100% 100%;
    background-image: url(@/assets/image/shitai/login/login-top-bg.png);
}

.login-bottom-bg {
    position: absolute;
    left: 0;
    bottom: 30px;
    right: 0;
    height: 659px;
    background-size: 100% 100%;
    background-image: url(@/assets/image/shitai/login/login-bottom-bg.png);
}

.login-icon {
    position: absolute;
    left: 80px;
    bottom: 17.3%;
    width: 880px;
    height: 456px;
    background-size: 100% 100%;
    background-image: url(@/assets/image/shitai/login/login-icon.png);
}

.login-tip {
    position: absolute;
    top: 14.54%;
    right: 0;
    width: 90px;
    height: 113px;
    background-size: 100% 100%;
    background-image: url(@/assets/image/shitai/login/login-tip.png);
}

.login-tip {
    display: flex;
    justify-content: flex-end;
    padding: 0 20px;

    > p {
        padding: 0 10px;
        margin: 0;
        border-right: 1px solid #d8d8d8;

        &:first-child {
            color: #b1adad;
        }

        &:last-child {
            border: none;
            color: #629b88;
        }
    }
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

    > img {
        width: calc(147em / @num);
        margin-left: calc(100em / @num);
    }

    > span {
        font-size: 1.3rem;
        vertical-align: middle;
        letter-spacing: 2px;
        color: #4970e0;
        margin-right: calc(100em / @num);
    }
}

.login-main {
    height: 100%;
    background-size: 100% 100%;
    //background-image: url(@/assets/image/shitai/login/login-bg.png);
}

.login-card {
    width: 430px;
    height: 510px;
    position: fixed;
    top: 78px;
    bottom: 0;
    right: 13.542%;
    margin: auto 0;
    padding: 84px 26px 136px;
    border-radius: 8px;
    box-shadow: 0px 0px 6px 3px rgba(228, 228, 228, 0.5);
    background-color: #ffffff;
    &-header {
        > span {
            font-size: 18px;
            line-height: 25px;
            color: #333;
        }
        &-line {
            position: relative;
            margin-top: 15px;
            height: 1px;
            background: rgba(0, 0, 0, 0.1);
            div {
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                margin: auto 0;
                height: 2px;
                width: 76px;
                background-color: #333333;
            }
        }
    }
}

.loginTextImg {
    position: absolute;
    left: 15.21%;
    top: 31.3%;
    font-weight: 500;
    letter-spacing: 2px;
    color: #222;
    > p {
        font-size: 32px;
        line-height: 45px;
    }
}

.login-form {
    position: relative;
    margin-top: 40px;
    .ant-form-item:first-child {
        margin-bottom: 10px;
    }
    .ant-input-affix-wrapper {
        height: 40px;
        padding-left: 17px;
        border: 1px solid #dddddd;
        border-radius: 4px;
        background: #f4f4f4;
        :deep(.ant-input-prefix) {
            display: none;
        }
        &:deep(.ant-input) {
            font-size: 16px;
            background: #f6f6f6;
        }
    }

    .login-form-button {
        margin-top: 29px;
        height: 40px;
        width: 100%;
        border-radius: 4px;
        // background-color: #3D71F6;
        // border-color: #3D71F6;
        color: #fff;
    }
}
</style>
<script lang="ts">
import { message } from "ant-design-vue";
import { defineComponent, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import request from "@/utils/axios";
import { useAction } from "@/hooks";
interface FormState {
    userName: string;
    password: string;
}
export default defineComponent({
    components: {
        UserOutlined,
        LockOutlined,
    },
    setup() {
        const formState = reactive<FormState>({
            userName: "",
            password: "",
        });
        const storeAction = useAction("stModule", ["asyncUpdateUserInfo"]);
        const router = useRouter();

        const onFinish = (values: any) => {
            console.log("Success:", values);
        };

        const onFinishFailed = (errorInfo: any) => {
            console.log("Failed:", errorInfo);
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
            console.log("res", res);
            try {
                const { asyncUpdateUserInfo } = storeAction;
                asyncUpdateUserInfo({ userInfo: res.data });
                localStorage.setItem("token", res.data.token);
                router.push({ path: "/stPublic/dashboard" });
                message.success("登录成功!");
            } catch (err) {
                console.log(err);
            }
        };

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