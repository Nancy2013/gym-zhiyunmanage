<template>
    <div class="security-template">
        <!-- 表格 -->
        <div class="security-template-tables">
            <div class="security-template-search">
                <div class="search-left">
                    <div class="search-left-inline">
                        <a-input style="width:200px" placeholder="模板名称" />
                    </div>
                    <div class="search-left-inline">
                        <a-select style="width:200px" placeholder="类型" :options="[]" />
                    </div>
                    <div class="search-left-inline">
                        <a-select style="width:200px" placeholder="显示场景" :options="[]" />
                    </div>
                    <div class="search-left-inline">
                        <a-select style="width:200px" placeholder="审核状态" :options="[]" />
                    </div>
                    <div class="search-left-inline">
                        <a-button type="primary">搜索</a-button>
                    </div>
                </div>
                <div class="search-right">
                    <div class="search-right-inline">
                        <a-button type="primary">添加</a-button>
                    </div>
                </div>
            </div>
            <tsx-table :configColumns="{
                tableModules: {
                   columns,
                   dataSource: [],
                   rowKey: 'id'
                },
                actionModules: {
                    isAdd: false,
                    isSearch: false,
                    isAction: true
                },
                paginationModules: {
                    
                }
             }">
            
            </tsx-table>
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