<template>
    <div class="authorizationReview">
        <!-- 表格 -->
        <div class="authorizationReview-tables">
            <div class="authorizationReview-tables-search">
                <div class="search-left">
                    <div class="search-left-inline">
                        <a-input style="width: 200px" placeholder="企业名称/申请人/申请人手机号" v-model:value="query.condition" />
                    </div>
                    <!-- <div class="search-left-inline">
                        <a-input style="width: 200px" placeholder="申请码量" v-model:value="query.applyCodeCount"></a-input>
                    </div>
                    <div class="search-left-inline">
                        <a-input style="width: 200px" placeholder="授权码量" v-model:value="query.acturalCodeCount"></a-input>
                    </div> -->
                    <div class="search-left-inline">
                        <a-select style="width: 200px" placeholder="审核状态" :options="statusOptions"
                            v-model:value="query.status"></a-select>
                    </div>
                    <div class="search-left-inline">
                        <a-button type="primary" @click="clickQuery()">查询</a-button>
                    </div>
                </div>
                <div class="search-right">
                    <div class="search-right-inline">
                        <a-button type="primary" :disabled="selectedRowKeys.length ? false : true"
                            @click="showModal('all')">审核</a-button>
                    </div>
                </div>
            </div>
            <config-table :configColumns="{
                tableModules: {
                    loading,
                    columns,
                    dataSource,
                    scroll: { x: 1500 },
                    rowKey: 'id',
                    bordered: false,
                    pagination,
                    rowSelection: rowSelection,
                    onChange: paginationChange
                },
                actionModules: {
                    isAdd: false,
                    isSearch: false,
                    isAction: true,
                    receive: clickQuery
                }
            }">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key == 'status'">
                        <div :class="`shzt shzt-${record.status}`">
                            <span></span>
                            <span>{{ convertStatus(record.status) }}</span>
                        </div>
                    </template>
                    <template v-if="column.key === 'action'">
                        <div class="action">
                            <!-- <a-button type="link" size="small"> 详情 </a-button> -->
                            <template v-if="record.status == 0">
                                <a-divider type="vertical" />
                                <a-button type="link" danger size="small" @click="showModal('each', record)"> 审核 </a-button>
                            </template>
                            <template v-if="record.status == 2">
                                <a-divider type="vertical" />
                                <a-button type="link" danger size="small" @click="reasonModal(record)"> 驳回原因 </a-button>
                            </template>
                        </div>
                    </template>
                </template>
            </config-table>
        </div>
        <!-- 弹框 -->
        <a-modal v-model:visible="visible" title="审核确认" cancelText="驳回" okText="认证通过" :footer="null">
            <div class="modal">
                <div class="modal-top">
                    <template v-if="brand || applyCount">
                        <p>
                            <label>品牌名称:&nbsp;</label>
                            <span>{{ brand }}</span>
                        </p>
                        <p>
                            <label>申请码量:&nbsp;</label>
                            <span>{{ applyCount }}</span>
                        </p>
                    </template>
                </div>
                <div class="modal-main">
                    <p>
                        <a-input style="width: 300px" placeholder="请输入实际可授权码量( 通过时必填 )" v-model:value="actualCount" />
                    </p>
                    <p>
                        <a-input style="width: 300px" placeholder="请输入驳回原因" v-model:value="reason" />
                    </p>
                </div>
                <div class="modal-btns">
                    <a-button type="primary" @click="ok">确认</a-button>
                    <a-button type="default" @click="cancel">驳回</a-button>
                </div>
            </div>
        </a-modal>
    </div>
</template>
<script lang="ts">
import Index from './index'
export default Index
</script>
<style lang="less" scoped>@import url('./index.less');</style>