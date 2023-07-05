<template>
    <div class="trace-data-list">
        <!-- 表格 -->
        <div class="trace-data-tables">
            <div class="data-tables-search">
                <div class="search-left">
                    <div class="search-left-inline">
                        <a-input style="width: 200px;" placeholder="流程名称" />
                    </div>
                    <div class="search-left-inline">
                        <a-button type="primary">搜索</a-button>
                    </div>
                </div>
                <div class="search-right">
                    <div class="seach-right-inline">
                        <a-button type="primary">添加</a-button>
                    </div>
                </div>
            </div>
            <config-table 
              :configColumns="{
                 tableModules: {
                    columns,
                    dataSource,
                    rowKey: 'id',
                    loading: false,
                    bordered: true,
                    rowSelection: {}
                 },
                 actionModules: {
                    isAdd: false,
                    isSearch: false,
                    isAction: true
                 },
                 paginationModules: {

                 }
              }"
            >
            <template #bodyCell="{ column }">
                    <template v-if="column.key === 'action'">
                        <div class="action">
                            <a-button type="link" size="small" @click="showAction"> 修改 </a-button>
                            <a-divider type="vertical" />
                            <a-button type="link" size="small"> 复制 </a-button>
                            <a-divider type="vertical" />
                            <a-button type="link" danger size="small"> 删除 </a-button>
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
//@import url('./index.less');
</style>
