<template>
    <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <a-form layout="inline" :model="searchData">
            <a-form-item label="">
                <a-input v-model:value="searchData.name" @pressEnter="handleSearch"  placeholder="批次标题/产品名称"  />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" @click="handleSearch">查询</a-button>
            </a-form-item>
        </a-form>
        <div>
            <a-button type="primary" @click="visible = true">添加</a-button>
        </div>
    </div>
    <config-table :configColumns="{
      tableModules: {
        columns,
        dataSource,
        rowKey: 'id',
        bordered: true,
        loading: false,
        pagination,
        onChange: paginationChange
      },
      actionModules: {
        isAdd: false,
        isSearch: false,
        isAction: true,
        receive:handleFresh,
      },
    }">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
                <a-space>
                    <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
                    <a-button type="link" danger size="small" @click="handleDelete(record)">删除</a-button>
                </a-space>
            </template>
        </template>
    </config-table>

    <a-modal width="660px" v-model:visible="visible" title="添加产品批次" @ok="handleSubmit()" @cancel="handleCancel">
        <FcForm ref="formRef" :rules="formRules" :renderList="renderList" :formData="formData" labelAlign="right" :labelCol="{ style: {width: '72px'} }"></FcForm>
    </a-modal>

</template>

<script lang="ts">
import { defineComponent } from "vue";
import productBatch from './productBatch'
import FcForm from '@/components/form/form'
export default defineComponent({
    components: {
        FcForm
    },
	setup() {
		return {
			...productBatch()
        };
    },
});
</script>