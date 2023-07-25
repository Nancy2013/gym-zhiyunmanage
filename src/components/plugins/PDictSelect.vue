<!--
 * @Description: 字典组件下拉
 * @Author: zhang zhen
 * @Date: 2023-07-13 14:51:43
 * @LastEditors: zhang zhen
 * @LastEditTime: 2023-07-14 11:44:21
 * @FilePath: /zhiyun-outsource-web/src/components/plugins/PDictSelect.vue
-->
<template>
    <a-select 
      :value="innerValue" 
      @change="handleChange"
      style="width: 100%;"
      :showSearch="true"
      placeholder="请选择"
      allowClear
    >
      <a-select-option
      v-for="option in options"
      :key="option.value"
      :value="option.value"
      >
        {{ option.title }}
      </a-select-option>
    </a-select>
  </template>
  
  <script setup lang="ts">
      import { ref, onMounted, watch } from "vue";
      import request from "@/utils/axios";
      import { Select } from 'ant-design-vue';
      // 传入变量
      const props = defineProps( Object.assign(Select.props, {
        dictTypeCode: {
            type: String,
            required: true
        }
      }));

      // emit 事件集合
      const emits = defineEmits(['update:value'])
      type optionsType = {
          value: string,
          title: string
      }
      // 品牌下拉数据
      const options = ref<Array<optionsType>>([])
      
      // 下拉显示的值
      const innerValue = ref<any>(props.value);
  
      /**
       * @description: 下拉选中参数变化捕捉
       * @param {String} value - 下拉组件选中的值
       * @return {*}
       */    
      const handleChange = (value: string) => {
          innerValue.value = value;
          emits('update:value', value);
      }

      type dictDataType = {
        code: number,
        data?: any
      }
      /**
       * @description: 获取字典接口
       * @return {*}
       */    
      const handleGetDict = () => {
          request({
          url: `${import.meta.env.VITE_SERVER_URL}/sysdict/getDictItems/${ props.dictTypeCode}`,
          method: "get",
          params: {
            
          },
          }).then((res: dictDataType | resposeType) => {
          const { code, data } = res;
            if (code === 200) {
                options.value = data || [];
            }
          });
      }
      
      // 监听传入的数据变化
      watch(() => props.value, (newVal, oldVal) => {
          innerValue.value = newVal
      })
      onMounted(() => {
        handleGetDict()
      })
      defineExpose({
          innerValue,
          handleChange
      })
  </script>
  