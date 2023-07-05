<template>
    <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <a-form layout="inline" :model="searchData">
            <a-form-item label="">
                <a-input v-model:value="searchData.name" @pressEnter="handleSearch" placeholder="角色名称" />
            </a-form-item>
            <a-form-item>
                <a-space>
                    <a-button type="default" @click="handleFresh">重置</a-button>
                    <a-button type="primary" @click="handleSearch">查询</a-button>
                </a-space>
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
      },
      actionModules: {
        isAdd: false,
        isSearch: false,
        isAction: true,
        receive: handleFresh
      },
    }">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'platformType'">
                <span>{{ platformTypeDict[record.platformType] }}</span>
            </template>
            <template v-if="column.key === 'terminalType'">
                <span>{{ terminalTypeDict[record.terminalType] }}</span>
            </template>
            <template v-if="column.key === 'action'">
                <a-space>
                    <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
                    <a-button type="link" danger size="small" @click="handleDelete(record)">删除</a-button>
                    <a-button type="link" size="small" @click="handleSetAuthority(record)">权限配置</a-button>
                </a-space>
            </template>
        </template>
    </config-table>

    <a-modal v-model:visible="visible" :title="formData.id ? '编辑角色' : '添加角色' " @ok="handleSubmit()" @cancel="handleCancel">
        <a-form ref="formRef" layout="horizontal" :model="formData" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-item label="角色名称" name="name">
                <a-input v-model:value="formData.name" placeholder="请输入角色名称" />
            </a-form-item>

            <a-form-item label="上级名称" name="pid">
                <a-tree-select v-model:value="formData.pid" :tree-data="roleTreeList" placeholder="请选择上级名称" :field-names="{ label: 'name', value: 'id' }"></a-tree-select>
            </a-form-item>

            <a-form-item label="别名" name="anotherName">
                <a-input v-model:value="formData.anotherName" placeholder="请输入别名" />
            </a-form-item>

            <a-form-item label="排序" name="sort">
                <a-input v-model:value="formData.sort" placeholder="排序" />
            </a-form-item>

            <!-- <a-form-item label="所属平台" name="platformType">
                <a-radio-group v-model:value="formData.platformType" @change="handleChange($event, 'platformType')">
                    <a-radio v-for="(item, key) in platformTypeOptions" :key="key" :value="item.value">{{ item.label }}</a-radio>
                </a-radio-group>
            </a-form-item>

            <a-form-item label="终端" name="terminalType">
                <a-select v-model:value="formData.terminalType" :placeholder="terminalTypeOptions.length ? '请选择终端' : '请先选择所属平台'" allowClear>
                    <a-select-option v-for="(item, key) in terminalTypeOptions" :key="key" :value="item.value">{{ item.label }}</a-select-option>
                </a-select>
            </a-form-item> -->
        </a-form>
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