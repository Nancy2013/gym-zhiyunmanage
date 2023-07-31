<!--
 * @Description: 物料选择
 * @Author: zhang zhen
 * @Date: 2023-07-18 09:23:00
 * @LastEditors: zhang zhen
 * @LastEditTime: 2023-07-18 10:28:24
 * @FilePath: /zhiyun-outsource-web/src/components/plugins/ingredientSelection.vue
-->
<template>
  <p-modal :visible="visible" title="物料选择" :width="1200" @cancel="handleCancel" @ok="handleOk">
    <!-- 查询区域 -->
    <a-form layout="inline" style="width: 100%; margin-bottom: 15px;">
        <a-form-item label="物料名称">
            <a-input v-model:value="queryParams.name" placeholder="请输入" />
        </a-form-item>
        <a-form-item label="物料分类">
            <a-select v-model:value="queryParams.category" style="width: 178px" placeholder="请选择">
            <a-select-option value="1">原料</a-select-option>
            <a-select-option value="2">成品</a-select-option>
            </a-select>
        </a-form-item>
        <a-form-item label="规格">
            <a-select v-model:value="queryParams.specs" style="width: 178px" placeholder="请选择">
            <a-select-option value="1">规格1</a-select-option>
            <a-select-option value="2">规格2</a-select-option>
            </a-select>
        </a-form-item>
        <a-form-item class="fc-card-header-options">
            <a-button type="primary" @click="handleSearch"> 查询 </a-button>
            <a-button class="sec-btn" @click="handleReload"> 重置 </a-button>
        </a-form-item>
    </a-form>
    <a-table
        :columns="columns"
        row-key="id"
        :data-source="dataSource"
        :pagination="pageInfo"
        :loading="loading"
        :scroll="{y: 600}"
        :row-selection="{ selectedRowKeys: newSelectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
    >
    </a-table>
  </p-modal>
</template>

<script setup lang="ts">
import PModal from './pmodal.vue';
import { ref, reactive } from 'vue'
import request from '@/utils/axios';
import { Response, ColumnItem } from '@/types/mainInterface'
    // 弹出的显示和关闭
    const visible = ref(false);

    // 请求条件的类型定义
    type queryType = {
        name: string;
        category: any;
        specs: any;
    }
    // 查询条件
    const queryParams = reactive<queryType>({
        name: '',
        category: undefined,
        specs: undefined
    })
    // 分页类型的定义
    type PageType = {
        current: number;
        pageSize: number;
        total: number
    }
    // 分页条件
    const pageInfo = ref<PageType>({
        current: 1,
        pageSize: 10,
        total: 0
    })
    // 表头
    const columns: Array<ColumnItem> = [
        {
            title: '序号',
            align: 'center',
            dataIndex: 'rowIndex',
            width: 70,
            customRender: ({ text, record, index, column }: { text: string, record: any, index: number, column: any }) => index + 1
        },
        {
            title: "物料编码",
            align: "center",
            dataIndex: "code",
            width: 120,
        },
        {
            title: "物料名称",
            align: "center",
            dataIndex: "name",
            width: 140,
        },
        {
            title: "物料分类",
            align: "center",
            dataIndex: "category",
            width: 140,
            customRender: ({ text, record, index, column }: { text: string, record: any, index: number, column: any }) => {
            return text == '1' ? '原料' : text == '2' ? '成品' : ''
            }
        },
        {
            title: "规格",
            align: "center",
            dataIndex: "specs",
            width: 140,
        },
        {
            title: "等级",
            align: "center",
            dataIndex: "level",
            width: 140,
        },
        {
            dataIndex: "sellingPrice",
            title: "销售价",
        },
        {
            dataIndex: "num",
            title: "当前库存",
        },
        {
            dataIndex: "unit",
            title: "单位",
        },
    ];

    // table选中的row
    const SelectRows = ref<Array<any>>([])
    // 选中的ID
    const newSelectedRowKeys = ref<Array<any>>([])

    // 列表请求下的刷新
    const loading = ref(false)
    // 列表数据
    const dataSource = ref<Array<any>>([])
    
    const emits = defineEmits(['ok'])
    /**
     * @description: 列表数据变化
     * @return {*}
     */    
    const handleTableChange = (
      pag: { pageSize: number; current: number },
      filters: any,
      sorter: any,
    ) => {
        pageInfo.value.current = pag.current;
        pageInfo.value.pageSize = pag.pageSize;
        handleSearch() // 搜索
    }
    /**
     * @description: 列表行选择事件
     * @param {*} selectedRowKeys
     * @return {*}
     */    
    const onSelectChange = (selectedRowKeys: Array<string>, selectedRows: Array<any>) => {
      newSelectedRowKeys.value = selectedRowKeys;
      SelectRows.value = selectedRows;
    };
    /**
     * @description: 搜索方法
     * @return {*}
     */    
    const handleSearch = () => {
        const { current, pageSize } = pageInfo.value
        loading.value = true
        // 请求数据
        request({
            url: `${import.meta.env.VITE_SERVER_URL}/product/list`,
            method: "post",
            data: {
                    ...queryParams,
                    pageNum: current,
                    pageSize,
                },
            }).then((res: Response | resposeType) => {
            const { code, rows, total } = res;
            loading.value = false
            if (code === 200) {
                dataSource.value = rows;
                pageInfo.value.total = total;
            }
        });
    }

    /**
     * @description: 重置方法
     * @return {*}
     */    
    const handleReload = () => {
        cleanParams() // 清空方法
        handleSearch()
    }
    /**
     * @description: 清空查询条件
     * @return {*}
     */    
    const cleanParams = () => {
        queryParams.name = ''
        queryParams.category = undefined
        queryParams.specs = undefined
        pageInfo.value = { // 还原分页
            current: 1,
            pageSize: 10,
            total: 0
        }
        newSelectedRowKeys.value = [];
        SelectRows.value = [];
        loading.value = false
    }
    /**
     * @description: 触发显示选择框子
     * @return {*}
     */    
    const handleSelectedOpen = () => {
        visible.value = true
        handleSearch() // 搜索
    }
    /**
     * @description: 确认选择
     * @return {*}
     */    
    const handleOk = () => {

        emits('ok', {
            selectedRowKeys: newSelectedRowKeys.value,
            selectedRows: SelectRows.value
        })
        handleCancel()
    }
    /**
     * @description: 关闭页面
     * @return {*}
     */    
    const handleCancel = () => {
        visible.value = false
        cleanParams()
    }

    defineExpose({ handleSelectedOpen })
</script>

<style lang="less" scoped>

</style>