<template>
    <div class="codeAuthorize">
        <!-- 表格 -->
        <div class="codeAuthorize-tables">
            <div class="codeAuthorize-tables-search">
                <div class="search-left">
                    <div class="search-left-inline">
                        <a-input style="width: 200px" placeholder="品牌名称" v-model:value="search.brandName" />
                    </div>
                    <div class="search-left-inline">
                        <a-select style="width: 200px" placeholder="审核状态" :options="statusOptions" v-model:value="search.status
                            "></a-select>
                    </div>
                    <div class="search-left-inline">
                        <a-range-picker v-model:value="search.time" valueFormat="YYYY-MM-DD" :placeholder="['申请开始时间','申请结束时间']"/>
                    </div>
                    <div class="search-left-inline">
                        <a-button class='left-btn' type="primary" @click="handleSearch">查询</a-button>
                        <a-button type="primary" @click="reset">重置</a-button>
                    </div>
                </div>
            </div>
            <tsx-table :configColumns="{
                tableModules: {
                    loading,
                    columns,
                    dataSource,
                    rowKey: 'id',
                    scroll: { x: 1500 },
                    bordered: true,
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
                    <template v-if="column.key == 'status'">
                        <div :class="`shzt shzt-${record.status}`">
                            <span></span>
                            <span>{{ codeStatus[record.status] }}</span>
                        </div>
                    </template>
                    <template v-if="column.key == 'grantTime'">
                        <span>{{ record.grantTime?showTime(record.grantTime):'' }}</span>
                    </template>
                    <template v-if="column.key === 'action'">
                        <div class="action">
                            <template v-if="record.status === 0">
                                <a-button type="link" size="small" @click="showModal(record)"> 审核 </a-button>
                            </template>
                            <template v-else>
                                <a-button type="link" size="small" @click="showModal(record)"> 查看 </a-button>
                            </template>
                        </div>
                    </template>
                </template>
            </tsx-table>
        </div>
        <!-- 弹框 -->
        <a-modal v-model:visible="visible" title="审核" :footer="null" :maskClosable="false" class="audit-modal"
            :bodyStyle="{ padding: 0, background: '#F6F8FA' }" :afterClose="handleClose">
            <div class="modal">
                <div class='modal-content'>
                    <a-form ref="formRef" layout="horizontal" :model="formData" :rules="formData.status === 0?rules:{}" :label-col="labelCol"
                        :wrapper-col="wrapperCol">
                        <a-form-item label="企业名称" name="enterpriseName">
                            {{ formData.enterpriseName }}
                        </a-form-item>
                        <a-form-item label="品牌名称" name="brandName">
                            {{ formData.brandName }}
                        </a-form-item>
                        <a-form-item label="申请码量" name="applyCodeNum">
                            {{ formData.applyCodeNum }}
                        </a-form-item>
                        <a-form-item label="申请时间" name="createdTime">
                            {{ formData.createdTime }}
                        </a-form-item>
                        <a-form-item label="申请理由" name="applyRemark">
                            {{ formData.applyRemark }}
                        </a-form-item>
                        <template v-if="formData.status !== 0">
                            <a-form-item label="审核状态" name="status">
                                {{ codeStatus[formData.status] }}
                            </a-form-item>
                        </template>
                        <a-form-item label="发放码量" name="grantCodeNum" v-if="formData.status === 0">
                            <div class="input">
                                <a-input-number v-model:value="formData.grantCodeNum" placeholder=""
                                style="width: 100%" />
                                <div class="input-placeholder" v-if="!formData.grantCodeNum">请输入发放码量<span>（审核通过时必填）</span></div>
                            </div>
                        </a-form-item>
                        <template v-if="formData.status !== 0">
                            <a-form-item label="发放码量" name="grantCodeNum">
                                {{ formData.grantCodeNum }}
                            </a-form-item>
                            <a-form-item label="发放时间" name="grantTime">
                                {{ formData.grantTime?showTime(formData.grantTime):'' }}
                            </a-form-item>
                        </template>
                        <a-form-item label="驳回原因" name="grantRemark">
                            <div class="textarea">
                                <a-textarea style="width: 100%" placeholder="" v-model:value="formData.grantRemark"
                                :rows="2" :disabled="formData.status !== 0"/>
                                <div class="textarea-placeholder" v-if="formData.status === 0&&!formData.grantRemark">请输入驳回原因<span>（驳回时必填）</span></div>
                            </div>
                        </a-form-item>
                    </a-form>
                </div>
                <div class="modal-btns">
                    <template v-if="formData.status === 0">
                        <a-button type="default" @click="reject">驳回</a-button>
                        <a-button type="primary" @click="ok">审核通过</a-button>
                    </template>
                    <template v-else>
                        <a-button type="default" @click="hideModal">关闭</a-button>
                    </template>

                </div>
            </div>
        </a-modal>
    </div>
</template>
<script lang="ts">
import moment from 'moment';
import Index from './index';
export default Index
</script>
<style lang="less" scoped>
@import url('./index.less');
</style>