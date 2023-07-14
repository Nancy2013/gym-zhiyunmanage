<template>
    <div class="identity-strategy">
        <!-- 表格 -->
        <div class="identity-strategy-tables">
            <div class="operate">
                <a-form layout="inline" :model="query">
                    <a-form-item label="">
                        <a-input style="width: 200px" placeholder="标识策略名称" v-model:value="query.ruleName" />
                    </a-form-item>
                    <a-form-item label="">
                        <a-select style="width: 200px" placeholder="生码类型" :options="ruleTypeoptions" v-model:value="query.ruleType" :getPopupContainer="getPopupContainer"></a-select>
                    </a-form-item>
                    <a-form-item label="">
                        <a-button type="primary" @click="queryList">搜索</a-button>
                        <a-divider type="vertical" />
                        <a-button type="default" @click="reset">重置</a-button>
                    </a-form-item>
                </a-form>

                <div>
                    <a-button type="primary" @click="showAction('add')">添加</a-button>
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
                    <template v-if="column.key === 'ruleType'">
                        <template v-if="record.ruleType == 1"><a-tag color="green">手动生码</a-tag></template>
                        <template v-if="record.ruleType == 2"><a-tag color="blue">自动生码</a-tag></template>
                    </template>
                    <template v-if="column.key === 'action'">
                        <div class="action">
                            <a-button type="link" size="small" @click="showAction('edit', record.id)"> 编辑 </a-button>
                            <a-divider type="vertical" />
                            <a-button type="link" size="small" @click="showAction('copy', record.id)"> 复制 </a-button>
                            <a-divider type="vertical" />
                            <a-button type="link" danger size="small" @click="deleteConfirm(record.id)"> 删除 </a-button>
                        </div>
                    </template>
                </template>
            </config-table>
        </div>
    </div>
</template>
<script lang="ts">
import Index from './index'
export default Index
</script>
<style lang="less" scoped>
@import url('./index.less');
</style>
<style lang="less">
.full-modal {
    .ant-modal {
        max-width: 100%;
        top: 0;
        padding-bottom: 0;
        margin: 0;
    }

    .ant-modal-content {
        display: flex;
        flex-direction: column;
        height: calc(100vh);
    }

    .ant-modal-body {
        flex: 1;
    }
}
</style>