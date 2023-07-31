<template>
    <div class="identity-generate" style="height: 100%">
        <vue-table :columns="type ? segColumns : codeColumns" :dataSource="dataSource" :paginationConfig="pagination" @pageChange="paginationChange" :loading="loading" :searchRenderList="type ? sectionSearchRenderList : batchSearchRenderList" :searchData="query" @search="queryList">

            <template #headerBtnArea>
                <a-button type="primary" @click="queryList">搜索</a-button>
                <a-button type="default" @click="reset">重置</a-button>
                <a-button type="primary" @click="showModal('add')">添加</a-button>
            </template>

            <template #headerLeft>
                <div class="action-left-radios">
                    <a-radio-group button-style="solid" v-model:value="type">
                        <a-radio-button :value="0">批量赋值</a-radio-button>
                        <a-radio-button :value="1">分段赋值</a-radio-button>
                    </a-radio-group>
                </div>
            </template>

            <template #index="{ record }">
                <span>{{ `${record.indexStart} ~ ${record.indexEnd}` }}</span>
            </template>

            <template #status="{ record }">
                <template v-if="record.status == 1"><a-tag color="orange">生码中</a-tag></template>
                <template v-if="record.status == 2"><a-tag color="cyan">已生码</a-tag></template>
                <template v-if="record.status == 3"><a-tag color="blue">同步中</a-tag></template>
                <template v-if="record.status == 4"><a-tag color="green">已同步</a-tag></template>
                <template v-if="record.status == 5"><a-tag color="pink">同步失败</a-tag></template>
                <template v-if="record.status == 6"><a-tag color="red">生码失败</a-tag></template>
            </template>

            <template #hasCheckCode="{ record }">
                <template v-if="record.hasCheckCode == 0"><a-tag color="#f50">无</a-tag></template>
                <template v-if="record.hasCheckCode == 1"><a-tag color="#87d068">有</a-tag></template>
            </template>

            <template #action="{ record }">
                <div class="action">
                    <a-button type="link" size="small" @click="showDetailModal(record)"> 详情 </a-button>
                    <a-divider type="vertical" />
                    <a-button type="link" size="small" @click="showModal('download', record)" :disabled="record.status == 6 ? true : false"> 下载 </a-button>
                    <a-divider type="vertical" />
                    <a-button type="link" size="small" @click="showModal('assign', record)" :disabled="record.status == 6 ? true : false"> 赋值 </a-button>
                    <template v-if="type == 0 && record.boId">
                        <a-divider type="vertical" />
                        <a-button type="link" size="small" @click="showModal('bind', record)" :disabled="record.status == 6 ? true : false"> 模板绑定
                        </a-button>
                    </template>
                </div>
            </template>
        </vue-table>
        <!-- 弹框 -->
        <a-modal v-model:visible="visible" :title="title" :afterClose="destroyInfo" :footer="Object.is(title, '下载') ? null : undefined" :width="title == '赋值' && type ? `1000px` : undefined" @ok="submit" :maskClosable="false">
            <div class="modal-content">
                <!-- 添加标识信息 -->
                <template v-if="title == '添加标识信息'">
                    <div class="modal-content-add">
                        <a-form ref="formRef" :model="addFormState" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="addRules">
                            <a-form-item ref="otherCount" name="otherCount" label="剩余码量">
                                <span>{{ addFormState.otherCount }}</span>
                            </a-form-item>
                            <a-form-item label="标识赋值方式">
                                <a-radio-group v-model:value="type">
                                    <a-radio :value="0">
                                        <span>批量赋值</span>
                                        <p class="content-add-radio">批量生码后，只支持批量赋值一个产品</p>
                                    </a-radio>
                                    <a-radio :value="1">
                                        <span>分段赋值</span>
                                        <p class="content-add-radio">批量生码后，支持分码段赋值多个产品</p>
                                    </a-radio>
                                </a-radio-group>
                            </a-form-item>
                            <a-form-item ref="count" name="count" label="生码数量">
                                <a-input v-model:value.number="addFormState.count" type="number" placeholder="请输入生码数量 (码量)" @change="handleCountChange" />
                            </a-form-item>
                            <a-form-item ref="ruleId" name="ruleId" label="标识策略">
                                <a-select v-model:value="addFormState.ruleId" placeholder="请选择标识策略" :options="rules"></a-select>
                            </a-form-item>
                            <a-form-item ref="hasCheckCode" name="hasCheckCode" label="防伪码">
                                <a-switch v-model:checked="addFormState.hasCheckCode" checked-children="是" un-checked-children="否" />
                            </a-form-item>
                            <a-form-item ref="remark" name="remark" label="备注">
                                <a-input v-model:value="addFormState.remark" placeholder="请输入备注" />
                            </a-form-item>
                        </a-form>
                    </div>
                </template>
                <!-- 赋值 -->
                <template v-if="title == '赋值'">
                    <div class="modal-content-assign">
                        <a-form ref="formRef" :model="assignFormState" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="assignRules">
                            <template v-if="type">
                                <a-form-item ref="index" name="index" label="流水号范围">
                                    <a-input :value="assignFormState.index" placeholder="请输入生码数量 (码量)" disabled />
                                </a-form-item>
                                <a-form-item ref="index" name="index" label="选择号段">
                                    <a-form-item ref="indexStart" name="indexStart" style="display: inline-block;margin: 0;">
                                        <a-input style="width: 100px;" v-model:value="assignFormState.indexStart" placeholder="开始号段" />
                                    </a-form-item>
                                    <span>&nbsp;-&nbsp;</span>
                                    <a-form-item ref="indexStart" name="indexEnd" style="display: inline-block;margin: 0;">
                                        <a-input style="width: 100px;margin-right: 10px;" v-model:value="assignFormState.indexEnd" placeholder="结束号段" />
                                    </a-form-item>
                                    <a-button type="primary" @click="selectAllCode">全选</a-button>
                                </a-form-item>
                            </template>
                            <template v-else>
                                <a-form-item ref="otherCount" name="otherCount" label="剩余码量">
                                    <span>{{ addFormState.otherCount }}</span>
                                </a-form-item>
                                <a-form-item ref="count" name="count" label="生码数量">
                                    <a-input :value="assignFormState.count" placeholder="请输入生码数量 (码量)" disabled />
                                </a-form-item>
                                <a-form-item ref="hasCheckCode" name="hasCheckCode" label="防伪码">
                                    <a-switch :checked="assignFormState.hasCheckCode ? true : false" checked-children="是" un-checked-children="否" disabled />
                                </a-form-item>
                            </template>
                            <a-form-item ref="boId" name="boId" label="绑定产品">
                                <a-select v-model:value="assignFormState.boId" placeholder="请选择产品" :options="objects" @change="selectChange('objects', 'assignFormState', true)"></a-select>
                            </a-form-item>
                            <a-form-item ref="templateId" name="templateId" label="绑定产品模板">
                                <a-select v-model:value="assignFormState.templateId" placeholder="请选择产品模板" :options="templates" @change="selectChange('templates', 'assignFormState')"></a-select>
                            </a-form-item>
                            <a-form-item ref="batchId" name="batchId" label="产品批次">
                                <a-select v-model:value="assignFormState.batchId" placeholder="请选择产品批次" :options="batchs" @change="selectChange('batchs', 'assignFormState')"></a-select>
                            </a-form-item>
                            <a-form-item ref="remark" name="remark" label="备注">
                                <a-input v-model:value="assignFormState.remark" placeholder="请输入备注" />
                            </a-form-item>
                            <template v-if="type">
                                <a-form-item label="已赋值流水号段">
                                    <a-table :columns="segModalColumns" :bordered="true" :pagination="false" :dataSource="segModalDataSource">
                                        <template #bodyCell="{ column, record }">
                                            <template v-if="column.key == 'index'">
                                                <span>{{ `${record.indexStart} ~ ${record.indexEnd}` }}</span>
                                            </template>
                                        </template>
                                    </a-table>
                                </a-form-item>
                            </template>
                        </a-form>
                    </div>
                </template>
                <!-- 模板绑定 -->
                <template v-if="title == '模板绑定'">
                    <div class="modal-content-bind">
                        <a-form ref="formRef" :model="bindFormState" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="bindRules">
                            <a-form-item ref="boId" name="boId" label="绑定产品">
                                <a-select v-model:value="bindFormState.boId" placeholder="请选择产品" :options="objects" @change="selectChange('objects', 'bindFormState', true)" disabled></a-select>
                            </a-form-item>
                            <a-form-item ref="templateId" name="templateId" label="绑定产品模板">
                                <a-select v-model:value="bindFormState.templateId" placeholder="请选择产品模板" :options="templates" @change="selectChange('templates', 'bindFormState')"></a-select>
                            </a-form-item>
                        </a-form>
                    </div>
                </template>
                <!-- 下载 -->
                <template v-if="title == '下载'">
                    <div class="modal-content-download">
                        <a-button class="download-btn" type="default" @click="downloadTemplate('excel', downloadFormState.recordId)">导出标识Excel</a-button>
                        <a-button class="download-btn" type="default" @click="downloadTemplate('zip', downloadFormState.recordId, 'txt')">导出防伪码链接TXT</a-button>
                        <a-button class="download-btn" type="default" @click="downloadTemplate('zip', downloadFormState.recordId, 'idis')">工业标识二维码</a-button>
                        <a-button class="download-btn" type="default" @click="downloadTemplate('zip', downloadFormState.recordId, 'checklink')">防伪码链接二维码</a-button>
                        <a-button class="download-btn" type="default" @click="downloadTemplate('zip', downloadFormState.recordId, 'link')">无防伪码链接二维码</a-button>
                    </div>
                </template>
            </div>
        </a-modal>

        <!-- 详情弹窗 -->
        <a-modal v-model:visible="detailVisible" :title="title" :afterClose="destroyInfo" :footer="null" :width="type ? `1000px` : undefined" :maskClosable="false">
            <div class="modal-content-detail">
                <a-form ref="formRef" :model="detailFormState" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="detailRules">
                    <a-form-item name="index" label="流水号">
                        <span>{{ detailFormState.index }}</span>
                    </a-form-item>
                    <a-form-item v-if='!type' name="status" label="状态">
                        <span>{{ getStatus(detailFormState.status) }}</span>
                    </a-form-item>
                    <a-form-item name="count" label="生码数量">
                        <span>{{ detailFormState.count }}</span>
                    </a-form-item>
                    <a-form-item ref="hasCheckCode" name="hasCheckCode" label="防伪码">
                        <a-switch :checked="detailFormState.hasCheckCode ? true : false" checked-children="是" un-checked-children="否" disabled />
                    </a-form-item>
                    <template v-if="!type && detailFormState.boId">
                        <a-form-item name="boName" label="绑定产品">
                            <span>{{ detailFormState.boName }}</span>
                        </a-form-item>
                        <a-form-item name="templateName" label="绑定产品模板">
                            <span>{{ detailFormState.templateName }}</span>
                        </a-form-item>
                        <a-form-item name="batchNo" label="产品批次">
                            <span>{{ detailFormState.batchNo }}</span>
                        </a-form-item>
                        <a-form-item name="remark" label="备注">
                            <span>{{ detailFormState.remark }}</span>
                        </a-form-item>
                    </template>
                    <template v-if="type">
                        <a-form-item name="remark" label="备注">
                            <span>{{ detailFormState.remark }}</span>
                        </a-form-item>
                        <a-form-item label="已赋值流水号段">
                            <a-table :columns="segModalColumns" :bordered="true" :pagination="false" :dataSource="segModalDataSource">
                                <template #bodyCell="{ column, record }">
                                    <template v-if="column.key == 'index'">
                                        <span>{{ `${record.indexStart} ~ ${record.indexEnd}` }}</span>
                                    </template>
                                </template>
                            </a-table>
                        </a-form-item>
                    </template>
                </a-form>
            </div>
        </a-modal>
    </div>
</template>
<script lang="ts">
import Index from "./index";
export default Index;
</script>
<style lang="less" scoped>
@import url("./index.less");
</style>