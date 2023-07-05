<template>
    <div class="identity-detail">
        <!-- 表格 -->
        <div class="identity-detail-tables">
            <div class="detail-tables-search">
                <div class="search-left">
                        <div class="search-left-inline">
                            <a-input style="width: 200px" placeholder="工业标识" v-model:value="query.idisCode" />
                        </div>
                        <div class="search-left-inline">
                            <a-input style="width: 200px" placeholder="对象名称" v-model:value="query.boName" />
                        </div>
                        <div class="search-left-inline">
                            <a-select style="width: 200px" placeholder="请选择" :options="statusOptions" v-model:value="query.syncStatus" ></a-select>
                        </div>
                        <div class="search-left-inline">
                            <a-range-picker style="width: 300px" format="YYYY-MM-DD HH:mm:ss" @change="rangeDateChange" :value="query.rangeTime" />
                        </div>
                        <div class="search-left-inline">
                            <a-button type="primary" @click="queryList">搜索</a-button>
                            <a-divider type="vertical" />
                            <a-button type="default" @click="reset">重置</a-button>
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
                        rowSelection:{},
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