<template>
    <div class="type">
        <!-- 表格 -->
        <div class="type-tables">
            <div class="type-tables-search">
                <div class="search-left">
                    <div class="search-left-inline">
                        <a-select style="width:200px" v-model:value="query.name" placeholder="选择类型名称"
                            :options="options"></a-select>
                    </div>
                    <div class="search-left-inline">
                        <a-input style="width:200px" v-model:value="query.creatorName" placeholder="创建人" />
                    </div>
                    <div class="search-left-inline">
                        <a-range-picker :show-time="{ format: 'HH:mm:ss' }" format="YYYY-MM-DD HH:mm:ss"
                            :placeholder="['开始时间', '结束时间']" @change="selectTimeChange" :value="query.rangeTime" />
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
                }
            }">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key == 'action'">
                        <a-space>
                            <a-button v-if="record.status == 'ENABLE'" type="link" size="small"
                                @click="statusTenantMealModify(record.id, 'DISABLE')">停用</a-button>
                            <a-button v-if="record.status == 'DISABLE'" type="text" size="small"
                                @click="statusTenantMealModify(record.id, 'ENABLE')">启用</a-button>
                            <a-button type="link" size="small" @click="edit(record)">权限编辑</a-button>
                            <a-button type="link" danger size="small" @click="deleteConfirm(record.id)">删除</a-button>
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
                    <a-form-item ref="name" name="name" label="类型名称">
                        <a-input v-model:value="formState.name" placeholder="请输入类型名称" />
                    </a-form-item>
                    <a-form-item class="form-tree" ref="selectMenulist" name="selectMenulist" label="功能权限">
                        <a-tree checkable v-model:checkedKeys="formState.selectMenulist" :tree-data="menuTree"
                            :fieldNames="{ title: 'name', key: 'id' }" />
                    </a-form-item>
                </a-form>
            </div>
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