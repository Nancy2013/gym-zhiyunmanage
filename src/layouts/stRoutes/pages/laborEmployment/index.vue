<template>
    <div class="laborEmployment">
        <!-- 面板 -->
        <div class="laborEmployment-pannel">
            <!-- 卡片 -->
            <div class="pannel-cards">
                <div class="pannel-cards-item" v-for="(item, index) in cardsList" :key="index">
                    <div class="item-top">
                        <div class="item-top-name"><span>{{ item.name }}</span></div>
                        <div class="item-top-progress">
                            <div class="progress-dots">
                                <div class="progress-dots-select" :style="`width:${item.progress}`"></div>
                            </div>
                            <div class="progress-roate">{{ item.progress }}</div>
                        </div>
                    </div>
                    <div class="item-bottom">
                        <div class="item-bottom-left">
                            <label>{{ item.count }}</label>
                            <img :src="item.icon" />
                            <span :style="`color: ${item.color}`">{{ item.roate }}</span>
                        </div>
                        <div class="item-bottom-right">
                            <div class="right-yrz">
                                <template v-if="item.yrzCount">
                                    <p>
                                        <label></label>
                                        <span>已认证</span>
                                    </p>
                                    <p>
                                        <span>{{ item.yrzCount }}</span>
                                    </p>
                                </template>
                            </div>
                            <div class="right-drz">
                                <template v-if="item.drzCount">
                                    <p>
                                        <label></label>
                                        <span>待认证</span>
                                    </p>
                                    <p>
                                        <span>{{ item.drzCount }}</span>
                                    </p>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 表格 -->
            <div class="pannel-tables">
                <div class="pannel-tables-search">
                    <div class="search-left">
                        <div class="search-left-inline">
                            <a-input style="width: 200px" placeholder="企业简称/茶园工/产茶工" />
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
                <config-table :configColumns="{
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
                                <a-button type="link" size="small"> 详情 </a-button>
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
                </config-table>
            </div>
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