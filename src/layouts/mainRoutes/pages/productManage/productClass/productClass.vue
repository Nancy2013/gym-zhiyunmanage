<template>
    <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <a-form layout="inline" :model="searchData">
            <a-form-item label="">
                <a-input v-model:value="searchData.firstCategoryName" @pressEnter="handleSearch" placeholder="对象分类名称" />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" @click="handleSearch">查询</a-button>
            </a-form-item>
        </a-form>
        <div>
            <a-button type="primary" @click="handleAddFirst">添加一级分类</a-button>
        </div>
    </div>
    <config-table :key="tableKey" :configColumns="{
      tableModules: {
        columns,
        dataSource,
        rowKey: 'id',
        bordered: true,
        loading: false,
        indentSize: 30,
        pagination: {
            pageSize,
		    current: pageNum,
		    total
        },
        expandedRowKeys: expandedRowKeys,
        onChange: handlePageChange,
        onExpand: handleExpand,
        onExpandedRowsChange: handleExpandedRowsChange
      },
      actionModules: {
        isAdd: false,
        isSearch: false,
        isAction: true,
      }
    }">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
                <a-space>
                    <a-button :style="`visibility: ${record.treeLevel >= 3 ? 'hidden' : ''}`" type="link" size="small" @click="handleAddChild(record)">添加子类</a-button>
                    <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
                    <a-button type="link" danger size="small" @click="handleDelete(record)">删除</a-button>
                </a-space>
            </template>
        </template>
    </config-table>

    <a-modal  v-model:visible="visible" :title="formData.id ? '编辑子类' : '添加子类' " @ok="handleSubmit()" @cancel="handleCancel">
        <FcForm ref="formRef" :rules="rules" :renderList="renderFormList" :formData="formData" labelAlign="right" :labelCol="{ style: {width: '112px'} }"></FcForm>
    </a-modal>

</template>

<script lang="ts">
import { defineComponent } from "vue";
import Main from "./productClass";
import FcForm from '@/components/form/form'
import { renderFormList } from "./config";
export default defineComponent({
    components: {
        FcForm
    },
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