<template>
    <div style="height: 100%;">
        <vue-table :columns="columns" :dataSource="dataSource" :paginationConfig="pagination" @pageChange="paginationChange" :loading="loading" :searchRenderList="searchRenderList" :searchData="query" @search="handleSearch">

            <template #headerBtnArea>
                <a-button type="primary" @click="handleSearch"> 查询 </a-button>
            </template>

            <template #type="{ record }">
                <span :style="`color: ${record.type == 'system' ? '#1890ff' : ''}`">{{ antiFakeTypeDict[record.type] }}</span>
            </template>

            <template #scenario="{ record }">
                <span :style="`color: ${record.scenario == antiFakeScenarioDict.first ? '#1890ff' : ''}`">{{ antiFakeScenarioDict[record.scenario] }}</span>
            </template>

            <template #reviewStatus="{ record }">
                <span :style="`color: ${record.reviewStatus == 'submitted' ? '#faad14' : record.reviewStatus == 'pass' ? '#52c41a' : record.reviewStatus == 'reject' ? '#f5222d' : ''}`">{{ antiFakeAuditStatusDict[record.reviewStatus] }}</span>
            </template>

            <template #action="{ record }">
                <div class="action" v-if="record.reviewStatus == 'submitted'">
                    <a-button type="link" size="small" @click="showExamineModal(record)">审核</a-button>
                </div>
            </template>
        </vue-table>
    </div>

    <a-modal width="640px" v-model:visible="visible" title="审核扫码验证文字模板" okText="通过" cancelText="不通过" @cancel="handleCancel">
        <a-form ref="formRef" layout="horizontal" :model="formData" :rules="formRules" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }">
            <a-form-item label="显示场景" name="scenario">
                <a-radio-group v-model:value="formData.scenario" disabled>
                    <a-radio value="1">首次查询</a-radio>
                    <a-radio value="2">多次查询</a-radio>
                </a-radio-group>
            </a-form-item>

            <a-form-item label="模板名称" name="name">
                <a-input v-model:value="formData.name" placeholder="请输入模板名称" disabled />
            </a-form-item>

            <a-form-item label="防伪内容" name="text">
                <a-textarea disabled showCount v-model:value="formData.text" placeholder="请输入防伪文字内容(总计不超过200字)" maxlength="200" />
            </a-form-item>

            <a-form-item label="反馈内容" name="reviewComment" :validateStatus="validateStatus" hasFeedback>
                <a-input v-model:value="formData.reviewComment" placeholder="请输入反馈内容" @focus="handleFocus" />
            </a-form-item>
        </a-form>
        <template #footer>
            <a-button type="primary" @click="handleExamine('noPass')">不通过</a-button>
            <a-button type="primary" @click="handleExamine('pass')">通过</a-button>
        </template>
        <!-- <div class="modal-btns">
            
        </div> -->
    </a-modal>
</template>

<script lang="ts">
import Examine from "./examine";
export default Examine;
</script>
