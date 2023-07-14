<template>
    <div class="menu">
        <!-- 表格 -->
        <div class="menu-tables">
            <div class="menu-tables-search">
                <div class="search-left">
                    <div class="search-left-inline">
                        <a-input style="width:200px" placeholder="菜单名称/编码" v-model:value="query.name" />
                    </div>
                    <div class="search-left-inline">
                        <a-input style="width:200px" placeholder="层级" v-model:value="query.levels" />
                    </div>
                    <div class="search-left-inline">
                        <a-button type="primary" @click="queryList">搜索</a-button>
                        <a-divider type="vertical" />
                        <a-button type="primary" @click="expandAll">展开所有</a-button>
                        <a-divider type="vertical" />
                        <a-button type="primary" @click="closeAll">折叠所有</a-button>
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
                    scroll: { x: 1500 },
                    rowKey: 'id',
                    bordered: true,
                    expandedRowKeys,
                    loading,
                    pagination: false,
                    onChange: paginationChange,
                    onExpand: expandChange
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
                    <template v-if="column.key == 'menuFlag'">
                        <a-switch checked-children="是" un-checked-children="否"
                            :checked="record.menuFlag == 'Y' ? true : false" disabled />
                    </template>
                    <template v-if="column.key == 'action'">
                        <a-space>
                            <a-button type="link" size="small" @click="() => edit(record)">修改</a-button>
                            <a-button type="link" danger size="small" @click="deleteConfirm(record.id)">删除</a-button>
                        </a-space>
                    </template>
                </template>
            </config-table>
        </div>
        <!-- 弹框 -->
        <a-modal v-model:visible="visible" :title="title" :afterClose="destroyInfo" @ok="submit">
            <div class="modal-content">
                <a-form ref="formRef" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules">
                    <a-form-item ref="name" name="name" label="名称">
                        <a-input v-model:value="formState.name" placeholder="请输入名称" />
                    </a-form-item>
                    <a-form-item ref="code" name="code" label="菜单编号">
                        <a-input v-model:value="formState.code" placeholder="请输入菜单编号" />
                    </a-form-item>
                    <a-form-item ref="permissionCode" name="permissionCode" label="菜单权限码">
                        <a-input v-model:value="formState.permissionCode" placeholder="请输入菜单权限码" />
                    </a-form-item>
                    <a-form-item ref="pcode" name="pcode" label="父级编号">
                        <a-tree-select v-model:value="formState.pcode" :tree-data="treeSelect" placeholder="请选择父级编号"
                            tree-data-simple-mode tree-default-expand-all @select="selectTreeChange" />
                    </a-form-item>
                    <a-form-item ref="menuFlag" name="menuFlag" label="是否是菜单">
                        <a-radio-group v-model:value="formState.menuFlag">
                            <a-radio value="Y">
                                <span>是</span>
                            </a-radio>
                            <a-radio value="N">
                                <span>不是</span>
                            </a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item ref="buyFlag" name="buyFlag" label="是否可购买">
                        <a-radio-group v-model:value="formState.buyFlag">
                            <a-radio value="Y">
                                <span>是</span>
                            </a-radio>
                            <a-radio value="N">
                                <span>不是</span>
                            </a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item ref="url" name="url" label="请求地址">
                        <a-input v-model:value="formState.url" placeholder="请输入请求地址" />
                    </a-form-item>
                    <a-form-item ref="sort" name="sort" label="排序">
                        <a-input v-model:value="formState.sort" placeholder="请输入排序" />
                    </a-form-item>
                    <a-form-item ref="icon" name="icon" label="选择图标">
                        <a-radio-group v-model:value="formState.icon">
                            <div class="select-icons">
                                <p class="select-icon" v-for="(item, index) in icons" :key="index">
                                    <a-radio :value="item">
                                        <config-icon :name="item" class="svgClass" style="margin: 0;" />
                                    </a-radio>
                                </p>
                            </div>
                        </a-radio-group>
                    </a-form-item>
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