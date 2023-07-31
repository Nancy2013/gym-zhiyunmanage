<template>
    <div style="height: 100%;">
        <vue-table :columns="columns" :dataSource="dataSource" :paginationConfig="pagination" @pageChange="paginationChange" :loading="loading" :searchRenderList="searchRenderList" :searchData="searchData" @search="handleSearch">

            <template #headerBtnArea>
                <a-button type="primary" @click="handleSearch">查询</a-button>
                <a-button type="primary" @click="visible = true">添加</a-button>
            </template>

            <template #action="{ record }">
                <a-space>
                    <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
                    <a-button type="link" danger size="small" @click="handleDelete(record)">删除</a-button>
                </a-space>
            </template>
        </vue-table>
    </div>
    <a-modal width="660px" v-model:visible="visible" :title="`${formData.id ? '编辑产品批次' : '添加产品批次'}`" @ok="handleSubmit()" @cancel="handleCancel">
        <tsx-form ref="formRef" :rules="formRules" :renderList="renderList" v-model:formData="formData" labelAlign="right" :labelCol="{ style: {width: '72px'} }"></tsx-form>
    </a-modal>

</template>

<script lang="ts">
import { defineComponent } from "vue";
import productBatch from './productBatch'
export default defineComponent({
    // components: {
    //     tsx-form
    // },
	setup() {
		return {
			...productBatch()
        };
    },
});
</script>