<template>
    <div class="certificationAudit">
        <!-- 表格 -->
        <div class="certificationAudit-tables">
            <div class="certificationAudit-tables-search">
                <div class="search-left">
                    <div class="search-left-inline">
                        <a-input style="width: 200px" placeholder="企业名称/企业简称" v-model:value="search.companyName" />
                    </div>
                    <div class="search-left-inline">
                        <a-select style="width: 200px" placeholder="审核状态" :options="statusOptions" v-model:value="search.approvalStatus
                        "></a-select>
                    </div>
                    <div class="search-left-inline">
                        <a-button type="primary" @click="handleSearch">查询</a-button>
                    </div>
                </div>
            </div>
            <config-table :configColumns="{
                tableModules: {
                    loading,
                    columns,
                    dataSource,
                    rowKey: 'id',
                    scroll: { x: 1500 },
                    bordered:true,
                    pagination,
                    onChange: paginationChange
                },
                actionModules: {
                    isAdd: false,
                    isSearch: false,
                    isAction: false,
                }
            }">
                <template #bodyCell="{ column, record, index }">
                    <template v-if="column.key == 'index'">
                        {{ index + 1 }}
                    </template>
                    <template v-if="column.key == 'teaGardenSelf'">
                        <span v-if="record.teaGardenSelf == 1">是</span>
                        <span v-else>否</span>
                    </template>
                    <template v-if="column.key == 'approvalStatus'">
                        <div :class="`shzt shzt-${record.approvalStatus}`">
                            <span></span>
                            <span>{{ approvalStatusOptions[record.approvalStatus] ||  record.approvalStatus}}</span>
                        </div>
                    </template>
                    <template v-if="column.key === 'action'">
                        <div class="action">
                            <a-button type="link" size="small" @click="enterDetail(record)"> 详情 </a-button>
                            <template v-if="record.approvalStatus == 1">
                                <a-divider type="vertical" />
                                <a-button type="link" size="small" @click="showModal(record)"> 审核 </a-button>
                            </template>
                            <template v-if="record.approvalStatus == 2">
                                <a-divider type="vertical" />
                                <a-button type="link" size="small" @click="showCode(record)"> 企业码 </a-button>
                            </template>
                            <template v-if="record.approvalStatus == 3">
                                <a-divider type="vertical" />
                                <a-tooltip placement="bottom">
                                    <template #title>
                                        <span>{{record.reason}}</span>
                                    </template>
                                    <a-button type="link" size="small"> 驳回原因 </a-button>
                                </a-tooltip>
                            </template>
                        </div>
                    </template>
                </template>
            </config-table>
        </div>
        <!-- 弹框 -->
        <a-modal v-model:visible="visible" title="审核确认" :footer="null" :maskClosable="false" class="audit-modal" :bodyStyle="{padding:0,background:'#F6F8FA'}">
            <div class="modal">
                <div class='modal-content'>
                    <div class="modal-img">
                        <img :src="audit" />
                    </div>
                    <template v-if="modalCompanyName">
                        <div>
                            <p class="modalCompanyName-tip">是否认证所选企业</p>
                            <p>{{ modalCompanyName }} </p>
                        </div>
                    </template>
                    <textarea style="width: 100%" placeholder="请输入驳回原因（驳回时必填）" v-model="reason" rows="2"
                            class="textarea"></textarea>
                </div>
                <div class="modal-btns">
                    <a-button type="default" @click="cancel">驳回</a-button>
                    <a-button type="primary" @click="ok">认证通过</a-button>
                </div>
            </div>
        </a-modal>
        <!-- 弹框 -->
        <a-modal v-model:visible="isCode" title="企业身份码" :footer="null" :maskClosable="false" :bodyStyle="{padding:0,background:'#F6F8FA'}">
            <div class="modal">
                <div class='modal-content'>
                    <div class="modal-code">
                        <img :src="code" v-if="code"/>
                        <div class="bottom">
                            <div class="text">{{ modalCompanyName }}</div>
                        </div>

                    </div>
                </div>
                <div class="modal-btns">
                    <a-button type="default" @click="cancelCode">关闭</a-button>
                </div>
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