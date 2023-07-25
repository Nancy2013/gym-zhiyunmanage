<!--
 * @Description: 品牌下拉组件
 * @Author: zhang zhen
 * @Date: 2023-07-13 13:41:05
 * @LastEditors: zhang zhen
 * @LastEditTime: 2023-07-13 15:34:59
 * @FilePath: /zhiyun-outsource-web/src/components/plugins/brandSelect.vue
-->
<template>
  <a-select 
    :value="innerValue" 
    @change="handleChange"
    @search="handleSearch"
    :default-active-first-option="false"
    :filter-option="false"
    :loading="loadingOptions"
    style="width: 100%;"
    :showSearch="true"
    placeholder="请选择"
    allowClear
  >
    <a-select-option
    v-for="option in options"
    :key="option.id"
    :value="option.id"
    >
      {{ option.name }}
    </a-select-option>
  </a-select>
</template>

<script setup lang="ts">
    import { ref, onMounted, watch } from "vue";
    import request from "@/utils/axios";
    import { Response } from '@/types/mainInterface'
    import { Select } from 'ant-design-vue';
    // 传入变量
    const props = defineProps( Object.assign(Select.props, {}));

    // 下拉搜索组件模糊查询时候的loading
    const loadingOptions = ref(false);
    // emit 事件集合
    const emits = defineEmits(['update:value'])
    type optionsType = {
        name: string,
        id: string
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

    /**
     * @description: 下拉模糊查询
     * @param {String} value - 输入的查询值
     * @return {*}
     */    
    const handleSearch = (value: string) => {
        handleLoadBrandInfo(value)
    }
    /**
     * @description: 获取品牌列表
     * @param {String} name - 输入的查询值
     * @return {*}
     */    
    const handleLoadBrandInfo = (name?: string) => {
        request({
        url: `${import.meta.env.VITE_SERVER_URL}/brand/list`,
        method: "post",
        data: {
            pageNum: 1,
            pageSize: 15,
            name,
            status: '0'
        },
        }).then((res: Response | resposeType) => {
        const { code, rows } = res;
        if (code === 200) {
            options.value = rows;
        }
        });
    }
    
    // 监听传入的数据变化
    watch(() => props.value, (newVal, oldVal) => {
        innerValue.value = newVal
    })
    onMounted(() => {
        handleLoadBrandInfo()
    })
    defineExpose({
        innerValue,
        handleChange
    })
</script>
