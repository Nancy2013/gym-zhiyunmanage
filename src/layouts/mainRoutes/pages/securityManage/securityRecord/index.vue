<template>
    <div class="security-record">
         <!-- 表格 -->
         <div class="security-record-tables">
             <div class="security-record-search">
                 <div class="search-left">
                    <div class="search-left-inline">
                        <a-input style="width:200px" placeholder="工业标识" />
                    </div>
                    <div class="search-left-inline">
                        <a-input style="width: 200px;" placeholder="时间筛选" />
                    </div>
                    <div class="search-left-inline">
                        <a-button type="primary">搜索</a-button>
                    </div>
                 </div>
                 <div class="search-right">
                    <div class="search-right-inline">
                        <a-radio-group button-style="solid">
                            <a-radio-button :value="0">防伪查询记录</a-radio-button>
                            <a-radio-button :value="1">防伪查询热力图</a-radio-button>
                        </a-radio-group>
                    </div>
                 </div>
             </div>
             <config-table :configColumns="{
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