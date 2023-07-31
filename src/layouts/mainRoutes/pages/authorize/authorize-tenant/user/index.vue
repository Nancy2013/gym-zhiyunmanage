<template>
    <div class="authorization-user" style="height: 100%">
        <vue-table :columns="columns" :dataSource="dataSource" :paginationConfig="pagination" @pageChange="paginationChange" :loading="loading" :searchRenderList="searchRenderList" :searchData="searchData" @search="handleSearch">

            <template #headerBtnArea>
                <a-button type="primary" @click="handleSearch">查询</a-button>
                <a-button type="default" @click="handleFresh">重置</a-button>
                <a-button type="primary" @click="handleAdd">添加</a-button>
            </template>

            <template #status="{ record }">
                <template v-if="record.status == 'ENABLE'"><a-tag color="green">启用</a-tag></template>
                <template v-if="record.status == 'DISABLE'"><a-tag color="red">停用</a-tag></template>
            </template>

            <template #action="{ record }">
                <a-space>
                    <a-button v-if="record.status == 'ENABLE'" type="link" size="small" @click="handleUpdate(record)">停用</a-button>
                    <a-button v-if="record.status == 'DISABLE'" type="text" size="small" @click="handleUpdate(record)">启用</a-button>
                    <a-button type="link" size="small" @click="handleEdit(record)"> 编辑 </a-button>
                    <a-button type="link" size="small" @click="handleDel(record)"> 删除 </a-button>
                    <a-button type="link" size="small" @click="bindRole(record)"> 分配角色 </a-button>
                    <a-button type="link" size="small" @click="handleReset(record)"> 重置密码 </a-button>
                </a-space>
            </template>
        </vue-table>

        <a-modal width="660px" v-model:visible="visible" :title="title" @ok="handleSubmit()" @cancel="handleCancel">
            <tsx-form ref="formRef" :rules="rules" :renderList="renderFormList" v-model:formData="formData" labelAlign="right" :labelCol="{ style: {width: '72px'} }"></tsx-form>
        </a-modal>

        <a-modal v-model:visible="visibleRole" title="角色分配" @ok="handleSubmitRole()" @cancel="handleCancelRole">
            <a-tree autoExpandParent v-model:expandedKeys="expandedKeys" v-model:selectedKeys="selectedKeys"
                v-model:checkedKeys="checkedKeys" checkable checkStrictly :tree-data="roleSource" :field-names="fieldNames">
            </a-tree>
        </a-modal>
    </div>
</template>

<script lang="ts">
import Index from './index';
export default Index;
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>