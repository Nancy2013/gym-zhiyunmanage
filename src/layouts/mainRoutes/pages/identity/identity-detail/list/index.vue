<template>
    <div class="identity-detail">
        <!-- 表格 -->
        <div class="identity-detail-tables">
            <div class="operate">
                <a-form layout="inline" :model="query">
                    <a-form-item label="">
                        <a-input style="width: 200px" placeholder="工业标识/对象名称" v-model:value="query.idisCodeOrBoName" />
                    </a-form-item>
                    <a-form-item label="">
                        <a-select style="width: 200px" placeholder="请选择状态" :options="statusOptions"
                            v-model:value="query.syncStatus" allowClear :getPopupContainer="getPopupContainer"></a-select>
                    </a-form-item>
                    <a-form-item label="">
                        <a-range-picker style="width: 300px" format="YYYY-MM-DD HH:mm:ss" @change="rangeDateChange"
                            :value="query.rangeTime" :getPopupContainer="getPopupContainer"/>
                    </a-form-item>
                    <a-form-item label="">
                        <a-button type="primary" @click="queryList">搜索</a-button>
                        <a-divider type="vertical" />
                        <a-button type="default" @click="reset">重置</a-button>
                    </a-form-item>
                </a-form>
            </div>
            <config-table :configColumns="{
                tableModules: {
                    columns,
                    dataSource,
                    rowKey: 'id',
                    bordered: true,
                    loading,
                    pagination,
                    rowSelection: {},
                    onChange: paginationChange,
                    scroll: { x: 1500 },
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
                    <template v-if="column.key == 'businessObjectCategoryName'">
                        {{record.dataType?"产品 > ":'' }}{{record.businessObjectCategoryName}}
                    </template>
                    <template v-if="column.key == 'syncStatus'">
                        <template v-if="record.syncStatus == 1"><a-tag color="orange">已创建</a-tag></template>
                        <template v-if="record.syncStatus == 2"><a-tag color="green">已同步</a-tag></template>
                        <template v-if="record.syncStatus == 3"><a-tag color="red">同步失败</a-tag></template>
                    </template>
                    <template v-if="column.key === 'action'">
                        <div class="action">
                            <a-button type="link" size="small" @click="showInfo(record.idisCode)"> 详情 </a-button>
                        </div>
                    </template>
                </template>
            </config-table>
        </div>
    </div>
</template>
<script lang="ts">
import Index from './index';
export default Index
</script>
<style lang="less" scoped>
@import url('./index.less');
</style>