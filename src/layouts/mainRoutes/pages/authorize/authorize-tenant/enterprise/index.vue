<template>
    <div class="enterprise">
        <!-- 表格 -->
        <div class="enterprise-tables">
            <div class="enterprise-tables-search">
                <div class="search-left">
                    <div class="search-left-inline">
                        <a-select v-model:value="query.enterpriseType" style="width:200px" placeholder="选择角色名称"
                            :options="options"></a-select>
                    </div>
                    <div class="search-left-inline">
                        <a-input v-model:value="query.tenantName" style="width:200px" placeholder="企业名称" />
                    </div>
                    <div class="search-left-inline">
                        <a-select v-model:value="query.status" style="width:200px" placeholder="选择状态" :options="statusOptions"></a-select>
                    </div>
                    <div class="search-left-inline">
                        <a-button type="default" @click="reset">重置</a-button>
                        <a-divider type="vertical" />
                        <a-button type="primary" @click="queryList">查询</a-button>
                    </div>
                </div>
                <div class="search-right">
                    <div class="search-right-inline">
                        <a-button type="primary" @click="add">添加</a-button>
                    </div>
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
                    receive: reset
                },
                paginationModules: {}
            }">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key == 'status'">
                        <template v-if="record.status == 'ENABLE'"><a-tag color="green">启用</a-tag></template>
                        <template v-if="record.status == 'DISABLE'"><a-tag color="red">停用</a-tag></template>
                    </template>
                    <template v-if="column.key == 'action'">
                        <a-space>
                            <a-button v-if="record.status == 'ENABLE'" type="link" size="small"
                                @click="modifyEnterpriseStatus(record.id, 'DISABLE')">停用</a-button>
                            <a-button v-if="record.status == 'DISABLE'" type="text" size="small"
                                @click="modifyEnterpriseStatus(record.id, 'ENABLE')">启用</a-button>
                            <a-button type="link" size="small" @click="edit(record)">编辑</a-button>
                            <a-button type="link" size="small" @click="see(record)">查看</a-button>
                        </a-space>
                    </template>
                </template>
            </config-table>
        </div>
        <!-- 弹框 -->
        <a-modal v-model:visible="visible" :title="title" :afterClose="destroyInfo">
            <template #footer>
                <a-space v-if="isSubmit">
                    <a-button type="default" @click="() => { visible = false }">关闭</a-button>
                    <a-button type="primary" @click="submit">提交</a-button>
                </a-space>
                <a-space v-else>
                    <a-button type="default" @click="() => { visible = false }">关闭</a-button>
                </a-space>
            </template>
            <div class="modal-content">
                <a-form ref="formRef" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules">
                    <a-form-item ref="tenantName" name="tenantName" label="企业名称">
                        <a-input v-model:value="formState.tenantName" placeholder="请输入" />
                    </a-form-item>
                    <a-form-item ref="contact" name="contact" label="企业联系人">
                        <a-input v-model:value="formState.contact" placeholder="请输入" />
                    </a-form-item>
                    <a-form-item ref="contactPhone" name="contactPhone" label="联系电话">
                        <a-input v-model:value="formState.contactPhone" placeholder="请输入" />
                    </a-form-item>
                    <a-form-item ref="enterpriseType" name="enterpriseType" label="企业类型">
                        <a-select v-model:value="formState.enterpriseType" placeholder="请选择" :options="options" />
                    </a-form-item>
                    <a-form-item class="form-tree" ref="selectMenuList" name="selectMenuList" label="功能权限">
                        <a-tree checkable v-model:checkedKeys="formState.selectMenuList" :tree-data="menuTree"
                            :fieldNames="{ title: 'name', key: 'id' }" />
                    </a-form-item>
                    <!-- <a-form-item ref="status" name="status" label="状态">
                        <a-radio-group v-model:value="formState.status">
                            <a-radio value="ENABLE">
                                <span>启用</span>
                            </a-radio>
                            <a-radio value="DISABLE">
                                <span>停用</span>
                            </a-radio>
                        </a-radio-group>
                    </a-form-item> -->
                </a-form>
            </div>
        </a-modal>
    </div>
</template>
<script lang="ts">
import Index from './index';
export default Index
</script>
<style lang="less" scoped>
@import url('./index.less');
</style>