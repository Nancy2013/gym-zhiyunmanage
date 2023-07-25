<!--
 * @Description: 公共的弹出组件
 * @Author: zhang zhen
 * @Date: 2023-07-13 10:00:41
 * @LastEditors: zhang zhen
 * @LastEditTime: 2023-07-13 11:44:32
 * @FilePath: /zhiyun-outsource-web/src/components/plugins/PModal.vue
-->
<template>
    <a-modal :visible="props.visible" wrapClassName="pony-modal-wrapper" :title="props.title" :width="props.width" :footer="null" @cancel="handleClose">
        <template #closeIcon>
            <img src="~@/assets/image/closeIcon.png" alt="" class="closeIcon">
        </template>
        <!-- 内容区域 -->
        <slot></slot>
        <div class="btn-area">
            <a-button @click="handleClose" style="background-color: #E7E7E7;color: rgba(0,0,0,0.9);border: none;">取消</a-button>
            <a-button type="primary" :loading="props.confirmLoading" @click="handleOk">确定</a-button>
        </div>
    </a-modal>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  
  const props = defineProps({
    title: { // 弹出标题
        type: String,
        required: true
    },
    width: { // 弹出的宽度
        type: Number,
        default: 520
    },
    visible: { // 显示隐藏
        type: Boolean,
        required: false
    },
    confirmLoading: { // 提交时候加载效果
        type: Boolean,
        required: false,
        default: false
    }
  })

  /**
   * @description: 关闭函数
   * @return {*}
   */  
  const handleClose = () => emits('cancel')
  const handleOk = () => emits('ok')
  // emit 事件
  const emits = defineEmits(['ok', 'cancel'])
</script>

<style lang="less" scoped>
.btn-area {
    text-align: right;
    .ant-btn {
        &+.ant-btn {
            margin-left: 8px;
        }
    }
}
img.closeIcon {
    width: 16px;
    height: 16px;
}
</style>