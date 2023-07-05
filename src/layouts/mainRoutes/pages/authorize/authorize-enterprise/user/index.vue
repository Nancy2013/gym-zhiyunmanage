<template>
    <div class="authorization-user">
        <div class="operate">
            <a-form layout="inline" :model="searchData">
                <a-form-item label="">
                    <a-input v-model:value="searchData.name" placeholder="账号/姓名/手机号" @pressEnter="handleSearch" />
                </a-form-item>
                <a-form-item label="">
                    <a-range-picker v-model:value="searchData.time" />
                </a-form-item>
                <a-form-item>
                    <a-space>
                        <a-button type="default" @click="handleFresh">重置</a-button>
                        <a-button type="primary" @click="handleSearch">查询</a-button>
                    </a-space>
                </a-form-item>
            </a-form>
            <div>
                <a-button type="primary" @click="handleAdd">添加</a-button>
            </div>
        </div>
        <config-table :configColumns="{
            tableModules: {
                columns,
                dataSource,
                rowKey: 'id',
                bordered: true,
                loading,
                pagination,
                onChange: paginationChange
            },
            actionModules: {
                isAdd: false,
                isSearch: false,
                isAction: true,
                receive: handleFresh
            },
        }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key == 'status'">
                        <template v-if="record.status == 'ENABLE'"><a-tag color="green">启用</a-tag></template>
                        <template v-if="record.status == 'DISABLE'"><a-tag color="red">停用</a-tag></template>
                </template>
                <template v-if="column.key === 'action'">
                    <a-space>
                        <a-button v-if="record.status == 'ENABLE'" type="link" size="small" @click="handleUpdate(record)">停用</a-button>
                        <a-button v-if="record.status == 'DISABLE'" type="text" size="small" @click="handleUpdate(record)">启用</a-button>
                        <a-button type="link" size="small" @click="handleEdit(record)"> 修改 </a-button>
                        <a-button type="link" size="small" danger @click="handleDel(record)"> 删除 </a-button>
                        <a-button type="link" size="small" @click="bindRole(record)"> 分配角色 </a-button>
                    </a-space>
                </template>
            </template>
        </config-table>

        <a-modal v-model:visible="visible" :title="title" @ok="handleSubmit()" @cancel="handleCancel">
            <a-form ref="formRef" layout="horizontal" :model="formData" :rules="rules" :label-col="labelCol"
                :wrapper-col="wrapperCol">
                <a-form-item label="账号" name="account" v-if="!formData.id">
                    <a-input v-model:value="formData.account" placeholder="请输入" />
                </a-form-item>
                <a-form-item label="联系人" name="name">
                    <a-input v-model:value="formData.name" placeholder="请输入联系人" />
                </a-form-item>
                <a-form-item label="联系电话" name="phone">
                    <a-input v-model:value="formData.phone" placeholder="请输入电话" />
                </a-form-item>
            </a-form>
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