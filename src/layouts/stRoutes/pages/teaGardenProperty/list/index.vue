<template>
    <div class="teaGardenProperty">
        <!-- 表格 -->
        <div class="teaGardenProperty-tables">
            <div class="teaGardenProperty-tables-search">
                <div class="search-left">
                    <div class="search-left-inline">
                        <a-input style="width: 248px" placeholder="茶园名称/企业名称" v-model:value="query.condition" @pressEnter="clickQuery" />
                    </div>
                    <div class="search-left-inline">
                        <a-select style="width: 248px" placeholder="审核状态" :options="teaConfirmStatusOptions" v-model:value="query.status"></a-select>
                    </div>
                    <div class="search-left-inline">
                        <a-button type="primary" @click="clickQuery">搜索</a-button>
                    </div>
                </div>
            </div>
            <div class="teaGardenProperty-table" id="teaGardenProperty-table">
                <a-table :scroll="{ y: tHeight }" :columns="columns" :dataSource="dataSource" :pagination="pagination" :loading="loading" @change="paginationChange">
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'authorizedStatus'">
                            <div :class="`teaConfirmStatus teaConfirmStatus-${record.authorizedStatus}`">
                                <div></div>
                                <div>{{ teaConfirmStatusDict[record.authorizedStatus] }}</div>
                            </div>
                        </template>

                        <template v-if="column.key === 'action'">
                            <a-button type="link" @click="handleInfo(record)">详情</a-button>
                            <a-divider v-if="record.authorizedStatus == teaConfirmStatusDict.wait" type="vertical" />
                            <a-button v-if="record.authorizedStatus == teaConfirmStatusDict.wait" type="link" @click="handleAudit(record)">审核</a-button>
                            <a-divider v-if="record.authorizedStatus == teaConfirmStatusDict.complate" type="vertical" />
                            <a-button v-if="record.authorizedStatus == teaConfirmStatusDict.complate" type="link" @click="handleTeaCode(record)">茶园码</a-button>
                            <a-divider v-if="record.authorizedStatus == teaConfirmStatusDict.reject" type="vertical" />
                            <a-tooltip>
                                <template #title>{{ record.reason }}</template>
                                <a-button v-if="record.authorizedStatus == teaConfirmStatusDict.reject" type="link">驳回原因</a-button>
                            </a-tooltip>
                            
                        </template>
                    </template>
                </a-table>
            </div>
        </div>

        <a-modal v-model:visible="visibleTeaCode" :bodyStyle="{ padding: '10px', backgroundColor: '#F6F8FA' }" width="710px" title="茶园码" :footer="null" class="teaCode-modal">
            <div class="teaCode-modal-box">
                <div class="teaCode-modal-content">
                    <div class="teaCode-modal-code" id="qrcode" :key="teaCodeKey"></div>
                    <div class="teaCode-modal-name">{{ teaGardenData.teaGardenName }}</div>
                </div>
            </div>
        </a-modal>
        <!-- 弹框 -->
        <a-modal v-model:visible="visible" :bodyStyle="{ padding: '0'}" title="审核确认" cancelText="驳回" okText="认证通过" :footer="null" class="teaAudit-modal" @cancel="handleCloseTeaAuditModal">
            <div class="teaAudit-modal-box">
                <div class="teaAudit-modal-content">
                    <div class="teaAudit-modal-detail">
                        <img src="@/assets/image/shitai/teaGardenProperty/teaGardenAuditIcon.png" alt="">
                        <div class="teaAudit-modal-title">是否确权所选茶园</div>
                        <div class="teaAudit-modal-name">{{ teaGardenData.teaGardenName }}</div>
                        <div class="teaAudit-modal-remark">
                            <a-form :model="formData">
                                <a-form-item name="reason" :validateStatus="validateStatus" hasFeedback :rules="[{ message: '请输入' }]">
                                    <a-textarea v-model:value="formData.reason" @focus="handleFocus"></a-textarea>
                                </a-form-item>
                            </a-form>
                            <div class="teaAudit-modal-placeholder" v-if="!formData.reason">请输入驳回原因<span>（驳回时必填）</span></div>
                        </div>
                    </div>
                </div>
                <div class="modal-btns">
                    <a-button type="primary" @click="ok">确权通过</a-button>
                    <a-button type="default" @click="cancel">驳回</a-button>
                </div>
            </div>
        </a-modal>
    </div>
</template>
<script lang="ts">
import Index from "../list/index";
export default Index;
</script>
<style lang="less" scoped>
@import url("./index.less");
</style>