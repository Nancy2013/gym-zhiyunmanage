<template>
    <div class="trace-data-action">
        <tsx-page title="返回" sub-title="返回到数据管理页">
            <div class="trace-data-steps">
                <a-steps :current="current">
                    <a-step v-for="item in steps" :key="item.title" :title="item.title" />
                </a-steps>
            </div>
            <a-row :gutter="16" v-if="current == 0">
                <a-col :span="16">
                    <div class="trace-data-basic">
                        <div class="trace-data-title">基础配置</div>
                        <div class="trace-data-form">
                            <a-form ref="formBasicRef" :model="basicFormState" :rules="basicRules">
                                <a-form-item ref="processId" name="processId" label="选择流程">
                                    <a-select v-model:value="basicFormState.processId" placeholder="请选择流程"
                                        :options="traceProcessSelListVOS" style="width: 300px"></a-select>
                                </a-form-item>
                                <a-form-item ref="productId" name="productId" label="选择产品">
                                    <p>为保证以下产品批次可溯源，请确保产品标识码已完成产品批次赋值</p>
                                    <div class="form-item-margin">
                                        <a-select v-model:value="basicFormState.productId" placeholder="请选择产品"
                                            :options="businessObjectVOS" style="width: 200px"
                                            @change="selectProducts"></a-select>
                                    </div>
                                    <div class="form-item-margin">
                                        <a-select v-model:value="basicFormState.batchId" placeholder="请选择产品批次"
                                            :options="batchBOList" style="width: 200px"></a-select>
                                    </div>
                                </a-form-item>
                                <a-form-item ref="templateId" name="templateId" label="选择模板">
                                    <div class="trace-data-templates">
                                        <div class="templates-item" v-for="(item, index) in traceConfigTemplateVOS"
                                            :key="index" @click="switchTemplates(index)">
                                            <div :class="['templates-item-img', item.active ? 'template-active' : null]">
                                                <img :src="item.content" />
                                            </div>
                                            <div class="templates-item-text"><span>{{ item.name }}</span></div>
                                        </div>
                                    </div>
                                </a-form-item>
                            </a-form>
                        </div>
                    </div>
                </a-col>
                <a-col :span="8">
                    <div class="trace-data-preview">
                        <div class="trace-data-title">模板效果</div>
                        <div class="trace-data-form">
                            <a-row :gutter="16">
                                <a-form ref="formPreviewRef" :label-col="labelCol" :wrapper-col="wrapperCol">
                                    <div class="form-preview-mobile">
                                        <div class="h5-mobile">
                                            <img :src="templateImg" />
                                        </div>
                                    </div>
                                </a-form>
                            </a-row>
                        </div>
                    </div>
                </a-col>
            </a-row>
            <a-row v-if="current == 1">
                <a-col :span="24">
                    <div class="trace-data-rules">
                        <div class="trace-data-title">数据规则</div>
                        <div class="trace-data-form">
                            <a-row :gutter="16">
                                <a-col :span="8">
                                    <div class="data-rules-title">流程</div>
                                    <a-form ref="formProcessRef">
                                        <a-directory-tree multiple defaultExpandAll :tree-data="treeData"
                                            :fieldNames="{ title: 'name', key: 'id' }" @select="dropTreeNode" />
                                    </a-form>
                                </a-col>
                                <a-col :span="16">
                                    <a-form class="form-rules-ref" ref="formRulesRef" :model="rulesFormState"
                                        :rules="rulesRules" :label-col="labelCol" :wrapper-col="wrapperCol">
                                        <a-form-item ref="dataType" name="dataType" label="数据来源" v-if="isLeaf">
                                            <a-radio-group v-model:value="rulesFormState.dataType">
                                                <a-radio :value="1">人工配置</a-radio>
                                                <a-radio :value="2">系统采集</a-radio>
                                            </a-radio-group>
                                        </a-form-item>
                                        <Empty :image="simpleImage" v-else />
                                        <!-- 人工配置 -->
                                        <template v-if="rulesFormState.dataType == 1">
                                            <div class="data-rules-type">
                                                <p>第一步:&nbsp;&nbsp;配置数据类型</p>
                                                <a-row :gutter="16">
                                                    <a-col :span="12">
                                                        <div class="rules-type-selects">
                                                            <p>组件选择</p>
                                                            <div class="type-selects-item"
                                                                v-for="(item, index) in componentSelects" :key="index">
                                                                <div class="selects-item-border">{{ item.placeholder }}
                                                                </div>
                                                                <div class="selects-item-btn">
                                                                    <a-button type="primary" ghost
                                                                      :disabled="isSelectTemplate"  @click="useComponentFunc(item.type, item.placeholder)">使用</a-button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </a-col>
                                                    <a-col :span="12">
                                                        <div class="rules-type-action">
                                                            <p>已选择&nbsp;<span>最多10项</span></p>
                                                            <div class="type-action-item"
                                                                v-for="(item, index) in componentActions" :key="index">
                                                                <template v-if="item.isEdit">
                                                                    <a-input class="action-item-title" type="text"
                                                                        placeholder="标题" v-model:value="item.title" />
                                                                    <a-button type="text" primary
                                                                        @click="saveComponentFunc(index)">
                                                                        <CheckOutlined />
                                                                    </a-button>
                                                                </template>
                                                                <template v-else>
                                                                    <a-tooltip placement="top">
                                                                        <template #title><span>{{ item.title
                                                                        }}</span></template>
                                                                        <span class="action-item-title">{{
                                                                            item.title ? item.title : '标题' }}</span>
                                                                    </a-tooltip>
                                                                    <a-button v-if="!item.disabled" type="text" primary
                                                                        @click="editComponentFunc(index)">
                                                                        <EditOutlined />
                                                                    </a-button>
                                                                </template>
                                                                <div class="action-item-border">{{ item.placeholder }}
                                                                </div>
                                                                <a-button v-if="!item.disabled" type="text" danger
                                                                    @click="deleteComponentFunc(index)">
                                                                    <DeleteOutlined />
                                                                </a-button>
                                                            </div>
                                                        </div>
                                                    </a-col>
                                                </a-row>
                                                <div class="rules-type-btns">
                                                    <a-space>
                                                        <!-- <a-button type="primary" ghost>应用到全部节点</a-button> -->
                                                        <a-button type="primary" :disabled="isSelectTemplate" @click="showModal">选择默认模板</a-button>
                                                    </a-space>
                                                </div>
                                            </div>
                                            <div class="data-rules-config">
                                                <p>第二步:&nbsp;&nbsp;配置数据</p>
                                                <a-row :gutter="16">
                                                    <a-col :span="12">
                                                        <div class="rules-config-data">
                                                            <p>数据配置</p>
                                                            <a-form-item v-for="(item, index) in componentActions"
                                                                :label="item.title" :key="index">
                                                                <vue-form :formType="item.type" v-model:value="item.value"
                                                                    :placeholder="item.placeholder" />
                                                            </a-form-item>
                                                        </div>
                                                    </a-col>
                                                    <a-col :span="12">
                                                        <div class="rules-config-authority">
                                                            <p>权限配置</p>
                                                            <a-form-item ref="roleVisibleFlag" name="roleVisibleFlag"
                                                                label="权限范围">
                                                                <a-switch checked-children="可见" un-checked-children="不可见"
                                                                    v-model:checked="rulesFormState.roleVisibleFlag"
                                                                    :checkedValue="1" :unCheckedValue="2" />
                                                                <p>仅下方选择角色可见</p>
                                                            </a-form-item>
                                                            <a-form-item ref="roleIdList" name="roleIdList" label="选择角色">
                                                                <a-select v-model:value="rulesFormState.roleIdList"
                                                                    :options="roleDtoList" style="width: 180px"
                                                                    placeholder="请选择角色" mode="multiple"></a-select>
                                                                <p>支持多选</p>
                                                            </a-form-item>
                                                            <!-- <div class="config-authority-btns">
                                                                <a-space>
                                                                    <a-button type="primary" ghost>应用到全部节点</a-button>
                                                                </a-space>
                                                            </div> -->
                                                        </div>
                                                    </a-col>
                                                </a-row>
                                            </div>
                                        </template>
                                        <!-- 系统采集 -->
                                        <template v-if="rulesFormState.dataType == 2">
                                            <div class="data-rules-select">
                                                <p>数据选择</p>
                                                <a-form-item ref="code" name="code" label="选择功能">
                                                    <a-select v-model:value="rulesFormState.code"
                                                        :options="TraceConfigDataChooseSelListBO" style="width: 200px"
                                                        placeholder="请选择功能" @change="traceListSelect"></a-select>
                                                    <span>根据产品批次关联茶园数据</span>
                                                </a-form-item>
                                                <a-form-item label="数据规则">
                                                    <a-select v-if="ruleList.length" v-model:value="rulesFormState.ruleKeys" :options="ruleList"
                                                       style="width: 200px; margin: 0 0 10px;" placeholder="请选择功能" mode="multiple"
                                                    ></a-select>
                                                    <div class="rules-select-tables">
                                                        <a-table bordered :data-source="dataSource" :columns="columns"
                                                            :pagination="false"
                                                            :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
                                                            rowKey="fieldCode">
                                                            <template #bodyCell="{ column, record }">
                                                                <template v-if="column.key === 'fieldShowName'">
                                                                    <tsx-input placeholder="展示名称"
                                                                        v-model:value="record.fieldShowName"
                                                                        maxLength="30" />
                                                                </template>
                                                            </template>
                                                        </a-table>
                                                    </div>
                                                </a-form-item>
                                            </div>
                                            <div class="data-rules-authority">
                                                <p>权限配置</p>
                                                <a-form-item ref="roleVisibleFlag" name="roleVisibleFlag" label="权限范围">
                                                    <a-switch checked-children="可见" un-checked-children="不可见"
                                                        v-model:checked="rulesFormState.roleVisibleFlag" :checkedValue="1"
                                                        :unCheckedValue="2" />
                                                    <span>仅下方选择角色可见</span>
                                                </a-form-item>
                                                <a-form-item ref="roleIdList" name="roleIdList" label="选择角色">
                                                    <a-select v-model:value="rulesFormState.roleIdList"
                                                        :options="roleDtoList" style="width: 200px" placeholder="请选择角色"
                                                        mode="multiple"></a-select>
                                                    <span>支持多选</span>
                                                </a-form-item>
                                                <!-- <div class="rules-authority-btns">
                                                    <a-button type="primary" ghost>应用到全部节点</a-button>
                                                </div> -->
                                            </div>
                                        </template>
                                    </a-form>
                                </a-col>
                            </a-row>
                        </div>
                    </div>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="24">
                    <!-- 操作选项 -->
                    <div class="action-content-btns">
                        <div class="content-btns">
                            <a-button v-if="current > 0" @click="prev">上一步</a-button>
                            <a-button v-if="current < steps.length - 1" @click="next">下一步</a-button>
                            <a-button v-if="current == steps.length - 1 && isLeaf" type="primary" html-type="submit"
                                @click="submit">提交</a-button>
                            <a-button @click="goBack">返回列表</a-button>
                        </div>
                    </div>
                </a-col>
            </a-row>
        </tsx-page>
        <!-- 默认模板 -->
        <a-modal v-model:visible="visible" title="选择默认模板" @ok="confirmTemplate">
            <div class="default-template-tip">
                <p>选择默认模板后，原先设置的节点原先设置的节点数据规则将被覆盖且不可撤回，请确认是否采用下方默认模板</p>
            </div>
            <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                <a-form-item v-for="(item, index) in defaultTemplates" :label="item.title" :key="index">
                    <vue-form :formType="item.type" v-model:value="item.value" :placeholder="item.placeholder" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>
<script lang="ts">
import Index from './index'
export default Index;
</script>
<style lang="less" scoped>
@import url('./index.less');
</style>
<style lang="less" scoped>
// h5预览页面
.form-preview-mobile {
    background: url(/src/assets/image/mobile.png);
    background-size: cover;
    background-repeat: no-repeat;
    height: 470px;
    width: 240px;
    position: relative;

    .h5-mobile {
        position: absolute;
        width: calc(100% - 50px);
        height: 85%;
        top: 40px;
        margin: 0 23px 0 27px;
        overflow: auto;
        cursor: pointer;

        >img {
            width: 100%;
        }
    }
}
</style>
