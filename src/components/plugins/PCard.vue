<!--
 * @Description: 卡片组件
 * @Author: zhang zhen
 * @Date: 2023-07-17 16:29:01
 * @LastEditors: zhang zhen
 * @LastEditTime: 2023-07-17 17:08:35
 * @FilePath: /zhiyun-outsource-web/src/components/plugins/PCard.vue
-->
<template>
    <div class="fc-card">
        <div class="fc-card-header">
            <h3 class="fc-card-header-title">{{ props.title }}</h3>

            <div class="fc-card-header-options">
                <!-- 按钮区域 -->
                <slot name="options"></slot>
            </div>
        </div>
        <div class="fc-card-content">
            <!-- 内容区域 -->
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
    const props = defineProps({
        title: { // 卡片标题
            type: String,
            required: true,
        },

    })
</script>

<style lang="less" scoped>
.fc-card {
    background: #FFF;
    border-radius: @border-radius-card;
    padding: 32px;
    box-sizing: border-box;
    &-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 18px;
        &-title {
            font-size: 20px;
            font-weight: 400;
            color: rgba(0,0,0,0.9);
            line-height: 28px;
            margin-bottom: 0;
        }
        &-options {
            text-align: right;
            .ant-btn {
                &+.ant-btn  {
                    margin-left: 8px;
                }
            }
        }
    }
    &+.fc-card {
        margin-bottom: 22px;
    }
}
</style>