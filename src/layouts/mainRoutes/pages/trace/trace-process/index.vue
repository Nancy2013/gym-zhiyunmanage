<template>
    <div class="trace-process">
        <!-- 表格 -->
        <div class="trace-process-tables">
            <div class="process-tables-search">
                <div class="search-left">
                    <div class="search-left-inline">
                        <a-input style="width: 300px;" placeholder="流程名称/流程说明" v-model:value="query.condition" />
                    </div>
                    <div class="search-left-inline">
                        <a-button type="primary" @click="queryList">搜索</a-button>
                        <a-divider type="vertical" />
                        <a-button type="default" @click="reset">重置</a-button>
                    </div>
                </div>
                <div class="search-right">
                    <div class="seach-right-inline">
                        <a-button type="primary" @click="showModal('添加流程')">添加</a-button>
                    </div>
                </div>
            </div>
            <config-table :configColumns="{
                tableModules: {
                    columns,
                    dataSource,
                    rowKey: 'id',
                    scroll: { x: 1500 },
                    loading,
                    bordered: true,
                    pagination,
                    rowSelection: {},
                    onChange: paginationChange
                },
                actionModules: {
                    isAdd: false,
                    isSearch: false,
                    isAction: true,
                    receive: reset
                },
                paginationModules: {

                }
            }">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'action'">
                        <div class="action">
                            <a-button type="link" size="small" @click="showModal('修改流程', record)"> 修改 </a-button>
                            <a-divider type="vertical" />
                            <a-button type="link" size="small" @click="showModal('复制流程', record)"> 复制 </a-button>
                            <a-divider type="vertical" />
                            <a-button type="link" danger size="small" @click="deleteConfirm(record.id)"> 删除 </a-button>
                        </div>
                    </template>
                </template>
            </config-table>
        </div>
        <!-- 弹框 -->
        <a-modal v-model:visible="visible" :title="title" :afterClose="destroyInfo" width="800px" @ok="submit">
            <div class="modal-content">
                <a-form ref="formRef" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules">
                    <a-form-item ref="name" name="name" label="流程名称">
                        <a-input v-model:value="formState.name" placeholder="请输入流程名称" />
                    </a-form-item>
                    <a-form-item ref="treeLevel" name="treeLevel" label="流程层级">
                        <a-select v-model:value="formState.treeLevel" placeholder="请选择层级" :options="levelOptions"
                            @change="selectTreeLevel"></a-select>
                    </a-form-item>
                    <a-form-item ref="remark" name="remark" label="流程说明">
                        <a-input v-model:value="formState.remark" placeholder="请输入流程说明" />
                    </a-form-item>
                    <a-form-item ref="stepParams" name="stepParams" label="流程配置">
                        <config-tree :treeConfigs="{
                            treeModules: {
                                treeData: formState.stepParams,
                                showLine: true,
                                autoExpandParent: true,
                                defaultExpandAll: true,
                                level: formState.treeLevel,
                                nodeName: '新流程'
                            }
                        }">
                        </config-tree>
                    </a-form-item>
                </a-form>
            </div>
        </a-modal>
    </div>
</template>
<script lang="ts">
import Index from './index'
export default Index
</script>
<style lang="less" scoped>
@import url('./index.less');
</style>
