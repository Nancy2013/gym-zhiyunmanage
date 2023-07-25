<template>
    <div class="aniFakeTemplate" style="height: 100%">
        <FcTable  :columns="columns" :dataSource="dataSource" :paginationConfig="pagination" @pageChange="paginationChange" :loading="loading" :searchRenderList="searchRenderList" :searchData="query" @search="handleSearch">

            <template #headerBtnArea>
                <a-button type="primary" @click="handleSearch"> 查询 </a-button>
                <a-button type="primary"  @click="handleAdd"> 添加 </a-button>
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
                <div class="action" v-if="record.reviewStatus == 'submitted' || record.reviewStatus == 'reject'">
                    <a-button type="link" size="small" @click="handleEdit(record)">修改</a-button>
                    <a-button type="link" size="small" @click="handleDelete(record)">删除</a-button>
                </div>
            </template>
        </FcTable>
    </div>

    <a-modal width="640px" v-model:visible="visible" :title="`${formData.id ? '编辑扫码验证文字模板' : '添加扫码验证文字模板'}`" @ok="handleSubmit()" @cancel="handleCancel">
        <a-form ref="formRef" layout="horizontal" :model="formData" :rules="formRules" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }">
            <a-form-item label="显示场景" name="scenario">
                <a-radio-group v-model:value="formData.scenario">
                    <a-radio value="1">首次查询</a-radio>
                    <a-radio value="2">多次查询</a-radio>
                </a-radio-group>
            </a-form-item>

            <a-form-item label="模板名称" name="name">
                <a-input v-model:value="formData.name" placeholder="请输入模板名称" maxlength="30" />
            </a-form-item>

            <a-form-item label="防伪内容" name="text">
                <a-textarea showCount v-model:value="formData.text" placeholder="请输入防伪文字内容(总计不超过200字)" maxlength="200" />
            </a-form-item>

            <a-form-item label="" name="" :wrapper-col="{ span: 24 }">
                <a-col offset="4">
                    <a-row>
                        <a-col style="margin: 0 16px 16px 0" v-for="(renderItem, renderKey) in antiFakeContentRenderList" :key="renderKey">
                            <a-button type="primary" @click="handleAddAntiFakeContent(renderItem)">
                                <template #icon>
                                    <PlusOutlined />
                                </template>
                                {{ renderItem.label }}
                                <span style="color: #faad14">{{ '{' + `${renderItem.key}` + '}' }}</span>
                            </a-button>
                        </a-col>
                    </a-row>
                </a-col>
            </a-form-item>
        </a-form>
    </a-modal>

</template>

<script lang="ts">
import Template from "./template";
export default Template;
</script>
