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
                    <a-select style="width:200px" v-model:value="searchData.status" placeholder="请选择状态" :options="[{ label: '启用', value: 'ENABLE' }, { label: '停用', value: 'DISABLE' }]"></a-select>
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
                <!-- <template v-if="column.key === 'status'">
                    <a-switch :checked="record.status === 'ENABLE'" checked-children="正常" un-checked-children="冻结"
                        @click="handleUpdate(record)" />
                </template> -->
                <template v-if="column.key === 'status'">
                    <template v-if="record.status == 'ENABLE'"><a-tag color="green">启用</a-tag></template>
                        <template v-if="record.status == 'DISABLE'"><a-tag color="red">停用</a-tag></template>
                </template>
                <template v-if="column.key === 'action'">
                    <a-space>
                        <a-button v-if="record.status == 'ENABLE'" type="link" size="small"
                                @click="handleUpdate(record)">停用</a-button>
                            <a-button v-if="record.status == 'DISABLE'" type="text" size="small"
                                @click="handleUpdate(record)">启用</a-button>
                        <a-button type="link" size="small" @click="handleEdit(record)"> 修改 </a-button>
                        <a-button type="link" size="small" @click="handleDel(record)"> 删除 </a-button>
                        <a-button type="link" size="small" @click="bindRole(record)"> 分配角色 </a-button>
                        <a-button type="link" size="small" @click="handleReset(record)"> 重置密码 </a-button>
                    </a-space>
                </template>
            </template>
        </config-table>

        <a-modal v-model:visible="visible" title="添加用户" @ok="handleSubmit()" @cancel="handleCancel">
            <a-form ref="formRef" layout="horizontal" :model="formData" :rules="rules" :label-col="labelCol"
                :wrapper-col="wrapperCol">
                <a-form-item label="账号" name="account" v-if="!formData.id">
                    <a-input v-model:value="formData.account" placeholder="请输入账号" />
                </a-form-item>
                <a-form-item label="姓名" name="name">
                    <a-input v-model:value="formData.name" placeholder="请输入姓名" />
                </a-form-item>
                <a-form-item label="出生日期" name="birthday">
                    <a-date-picker style="width:100%" v-model:value="formData.birthday" placeholder="请输入出生日期"
                        value-format="YYYY-MM-DD" />
                </a-form-item>
                <a-form-item label="密码" name="password" v-if="!formData.id">
                    <a-input v-model:value="formData.password" placeholder="请输入密码" type="password" readonly="readonly"
                        onfocus="this.removeAttribute('readonly')" />
                </a-form-item>
                <a-form-item label="重复密码" name="repeat" v-if="!formData.id">
                    <a-input v-model:value="formData.repeat" placeholder="请输入重复密码" type="password" readonly="readonly"
                        onfocus="this.removeAttribute('readonly')" />
                </a-form-item>
                <a-form-item label="邮箱" name="email">
                    <a-input v-model:value="formData.email" placeholder="请输入邮箱" />
                </a-form-item>
                <a-form-item label="性别" name="sex">
                    <a-radio-group v-model:value="formData.sex" name="sex">
                        <a-radio value="man">男</a-radio>
                        <a-radio value="woman">女</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="电话" name="phone">
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