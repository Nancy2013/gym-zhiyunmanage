<template>
    <div style="height: 100%;">
        <vue-table :columns="columns" :dataSource="dataSource" :paginationConfig="pagination" @pageChange="paginationChange" :loading="loading" :expandedRowKeys="expandedRowKeys" :searchRenderList="searchRenderList" :searchData="searchData" @search="handleSearch" @expand="handleExpand" @expandedRowsChange="handleExpandedRowsChange">

            <template #headerBtnArea>
                <a-button type="primary" @click="handleSearch">查询</a-button>
                <a-button type="primary" @click="handleAddFirst">添加一级分类</a-button>
            </template>

            <template #action="{ record }">
                <a-space>
                    <a-button :style="`visibility: ${record.treeLevel >= 3 ? 'hidden' : ''}`" type="link" size="small" @click="handleAddChild(record)">添加子类</a-button>
                    <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
                    <a-button type="link" danger size="small" @click="handleDelete(record)">删除</a-button>
                </a-space>
            </template>
        </vue-table>
    </div>

    <a-modal  v-model:visible="visible" :title="formData.id ? '编辑子类' : '添加子类' " @ok="handleSubmit()" @cancel="handleCancel">
        <tsx-form ref="formRef" :rules="rules" :renderList="renderFormList" :formData="formData" labelAlign="right" :labelCol="{ style: {width: '112px'} }"></tsx-form>
    </a-modal>

</template>

<script lang="ts">
import { defineComponent } from "vue";
import Main from "./productClass";
// import { FcJsxForm } from '@/components/jsx'
import { renderFormList } from "./config";
export default defineComponent({
    // components: {
    //     FcJsxForm
    // },
    setup() {
        return {
            ...Main(),
        };
    },
});
</script>

<style lang="less" scoped>
.objectClass-prompt {
    font-size: 12px;
    color: #666;
    margin-left: 120px;
}
</style>