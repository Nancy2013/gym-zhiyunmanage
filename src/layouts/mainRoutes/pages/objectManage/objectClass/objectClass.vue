<template>
    <div style="height: 100%;">
        <FcTable :columns="columns" :dataSource="dataSource" :paginationConfig="pagination" @pageChange="paginationChange" :loading="loading" :searchRenderList="searchRenderList" :searchData="searchData" @search="handleSearch">

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
        </FcTable>
    </div>

    <a-modal v-model:visible="visible" :title="formData.id ? '编辑对象分类' : '添加对象分类' " @ok="handleSubmit()" @cancel="handleCancel">
        <a-form ref="formRef" layout="horizontal" :model="formData" :rules="formRules" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">

            <a-form-item label="选择对象分类" name="treeLevel">
                <a-radio-group v-model:value="formData.treeLevel" name="radioGroup">
                    <a-radio :value="1">一级对象分类</a-radio>
                    <a-radio :value="2">二级对象分类</a-radio>
                </a-radio-group>
            </a-form-item>

            <a-form-item label="一级对象分类" name="categoryName" v-if="formData.treeLevel == 1">
                <a-input v-model:value="formData.categoryName" @change="filterInputCategoryName.filterInput" show-count :maxlength="30" placeholder="请输入一级对象分类名称" />
            </a-form-item>


            <a-form-item label="一级对象分类" name="parentId" v-if="formData.treeLevel == 2">
                <a-select v-model:value="formData.parentId" placeholder="请选择一级对象分类" allowClear>
                    <a-select-option v-for="(item, key) in ruleOptions" :key="key" :value="item.value">{{ item.label }}</a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item label="二级对象分类" name="categoryName" v-if="formData.treeLevel == 2">
                <a-input v-model:value="formData.categoryName" @change="filterInputCategoryName.filterInput" show-count :maxlength="30" placeholder="请输入二级对象分类名称" />
            </a-form-item>
        </a-form>
    </a-modal>

</template>

<script lang="ts">
import { defineComponent } from "vue";
import Main from "./objectClass";
export default defineComponent({
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