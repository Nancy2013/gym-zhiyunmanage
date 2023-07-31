<template>
    <div style="height: 100%;">
        <vue-table :columns="columns" :dataSource="dataSource" :paginationConfig="pagination" @pageChange="paginationChange" :loading="loading" :searchRenderList="searchRenderList" :searchData="searchData" @search="handleSearch">

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
        </vue-table>
    </div>

    <a-modal width="440px" v-model:visible="visible" :title="formData.id ? '编辑角色' : '添加角色'" @ok="handleSubmit()" @cancel="handleCancel">
        <tsx-form ref="formRef" :rules="rules" boxType="page" :renderList="renderFormList" v-model:formData="formData" labelAlign="right" :labelCol="{ style: {width: '72px'} }"></tsx-form>
    </a-modal>

    <a-modal width="640px" v-model:visible="visibleAuth" title="配置权限" @ok="handleAuthSubmit" @cancel="handleAuthCancel">
        <a-row>
            <a-col :span="6" style="padding-right: 16px;">
                <div class="authority-add">
                    <a-space>
                        <a-button type="text" primary @click="addAuthorityList(4)">新增</a-button>
                        <a-button type="text" danger @click="deleteAuthorityList">删除</a-button>
                    </a-space>
                </div>
                <div class="authority-list">
                    <a-menu mode="inline" v-model:selectedKeys="selectedMenuKeys">
                        <a-menu-item v-for="(item, index) in allAuthorityList" :key="index">第{{ index + 1
                            }}条数据</a-menu-item>
                    </a-menu>
                </div>
            </a-col>
            <a-col :span="18">
                <a-form v-for="(item, index) in allAuthorityList" :key="index" :label-col="labelCol"
                    :wrapper-col="wrapperCol">
                    <div v-if="selectedMenuKeys[0] == index">
                        <a-form-item label="选择平台">
                            <a-select v-model:value="item.platformType" placeholder="请选择平台" :options="platformOptions"
                                @change="reactSelect"></a-select>
                        </a-form-item>
                        <a-form-item label="终端类型">
                            <a-select v-model:value="item.terminalType" placeholder="请选择终端类型"
                                :options="terminalOptions" @change="terminalSelect"></a-select>
                        </a-form-item>
                        <a-form-item label="功能权限">
                            <a-tree :key="roleId" v-model:checkedKeys="item.menuIds" checkable :tree-data="authTreeData"
                                :fieldNames="{ title: 'name', key: 'id' }"></a-tree>
                        </a-form-item>
                    </div>
                </a-form>
            </a-col>
        </a-row>
    </a-modal>
</template>

<script lang="ts">
import Index from './index';
export default Index;
</script>
<style lang="less" scoped>
@import url('./index.less');
</style>