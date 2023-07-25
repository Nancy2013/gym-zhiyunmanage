<template>
    <div style="height: 100%;">
        <FcTable :columns="columns" :dataSource="dataSource" :paginationConfig="pagination" @pageChange="paginationChange" :loading="loading" :searchRenderList="searchRenderList" :searchData="searchData" @search="handleSearch">

            <template #headerBtnArea>
                <a-button type="primary" @click="handleSearch">查询</a-button>
                <a-button type="default" @click="handleFresh">重置</a-button>
                <a-button type="primary" @click="visible = true">添加</a-button>
            </template>

            <template #platformType="{ record }">
                <span>{{ platformTypeDict[record.platformType] }}</span>
            </template>

            <template #terminalType="{ record }">
                <span>{{ terminalTypeDict[record.terminalType] }}</span>
            </template>

            <template #action="{ record }">
                <a-space>
                    <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
                    <a-button type="link" danger size="small" @click="handleDelete(record)">删除</a-button>
                    <a-button type="link" size="small" @click="handleSetAuthority(record)">权限配置</a-button>
                </a-space>
            </template>
        </FcTable>
    </div>

    <a-modal width="440px" v-model:visible="visible" :title="formData.id ? '编辑角色' : '添加角色' " @ok="handleSubmit()" @cancel="handleCancel">
        <FcForm ref="formRef" :rules="rules" boxType="page" :renderList="renderFormList" v-model:formData="formData" labelAlign="right" :labelCol="{ style: {width: '72px'} }"></FcForm>
    </a-modal>

    <a-modal v-model:visible="visibleAuth" title="配置权限" @ok="handleAuthSubmit" @cancel="handleAuthCancel">
        <a-tree :key="roleId" v-model:checkedKeys="selectAuthList" checkable :tree-data="authTreeData" :fieldNames="{title: 'name', key: 'id'}"></a-tree>
    </a-modal>

</template>

<script lang="ts">
import Index from './index';
export default Index;
</script>
<style lang="less" scoped>
@import url('./index.less');
</style>