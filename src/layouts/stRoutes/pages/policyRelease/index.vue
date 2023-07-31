<template>
    <div class="policyRelease">
        <!-- 表格 -->
        <div class="policyRelease-tables">
            <div class="policyRelease-tables-search">
                    <div class="search-left">
                        <div class="search-left-inline">
                            <a-input style="width: 200px" placeholder="政策标题/创建人" />
                        </div>
                        <div class="search-left-inline">
                            <a-select style="width: 200px" placeholder="审核状态" :options="[]"></a-select>
                        </div>
                        <div class="search-left-inline">
                            <a-button type="primary">搜索</a-button>
                        </div>
                    </div>
                    <div class="search-right">
                        <div class="search-right-inline">
                            <a-button type="primary">审核</a-button>
                        </div>
                    </div>
                </div>
                <tsx-table :configColumns="{
                    tableModules: {
                        columns,
                        dataSource,
                        scroll:{x: 1500},
                        rowKey: 'id',
                        bordered: false,
                        loading: false,
                        rowSelection:{}
                    },
                    actionModules: {
                        isAdd: false,
                        isSearch: false,
                        isAction: true,
                    },
                    paginationModules: {
                       
                    }
                }">
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key == 'shzt'">
                           <div :class="`shzt shzt-${record.shzt}`">
                              <span></span>
                              <span>{{ convertStatus(record.shzt) }}</span>
                           </div>
                        </template>
                        <template v-if="column.key === 'action'">
                              <div class="action">
                                <a-popover placement="leftBottom">
                                    <template #content>
                                       <p style="width:800px;opacity: 0.5;">青山吐新绿，又闻早茶香。3月25日上午，以“遇见石台去采茶”为主题的第二十届安徽·石台茶叶节大家采风活动启动仪式，在石台富硒资源核心区，中国最美富硒茶园西黄山坳头茶园举行。这里的百余亩茶树吐露新芽、进入采摘期，拉开了石台县各地茶园全面开采的序幕。一两春茶一两金，茶乡振兴看石台。在徽派古村落的掩映中，在黑色富硒土壤的映衬下，层层叠叠的金色黄金芽茶..</p>
                                    </template>
                                    <a-button type="link" size="small"> 详情 </a-button>
                                </a-popover>
                                <template v-if="record.shzt == 1">
                                    <a-divider type="vertical" />
                                    <a-button type="link" danger size="small"> 审核 </a-button>
                                </template>
                                <template v-if="record.shzt == 3">
                                    <a-divider type="vertical" />
                                    <a-button type="link" danger size="small"> 驳回原因 </a-button>
                                </template>
                              </div>
                        </template>
                    </template>
                </tsx-table>
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