<template>
    <div class="trace-data-action">
        <config-page title="返回" sub-title="返回到数据管理页">
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
                                        <div class="templates-item" v-for="(item, index) in new Array(3).fill(1)"
                                            :key="index"></div>
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
                                        <div class="h5-mobile"></div>
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
                                        <a-directory-tree multiple defaultExpandAll :tree-data="treeData" />
                                    </a-form>
                                </a-col>
                                <a-col :span="16">
                                    <a-form class="form-rules-ref" ref="formRulesRef" :model="rulesFormState"
                                        :rules="rulesRules" :label-col="labelCol" :wrapper-col="wrapperCol">
                                        <a-form-item ref="sourceName" name="sourceName" label="数据来源">
                                            <a-radio-group v-model:value="rulesFormState.sourceName">
                                                <a-radio :value="1">人工配置</a-radio>
                                                <a-radio :value="2">系统采集</a-radio>
                                            </a-radio-group>
                                        </a-form-item>
                                        <!-- 人工配置 -->
                                        <template v-if="rulesFormState.sourceName == 1">
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
                                                                        @click="useComponentFunc(item.type, item.placeholder)">使用</a-button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </a-col>
                                                    <a-col :span="12">
                                                        <div class="rules-type-action">
                                                            <p>已选择&nbsp;<span>最多10项</span></p>
                                                            <div class="type-action-item"
                                                                v-for="(item, index) in componentActions" :key="index">
                                                                <!-- <a-space> -->
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
                                                                        <template #title><span>{{ item.title ? item.title :
                                                                            '标题' }}</span></template>
                                                                        <span class="action-item-title">{{
                                                                            item.title ? item.title : '标题' }}</span>
                                                                    </a-tooltip>
                                                                    <a-button type="text" primary
                                                                        @click="editComponentFunc(index)">
                                                                        <EditOutlined />
                                                                    </a-button>
                                                                </template>
                                                                <config-form :formType="item.type"
                                                                    v-model:value="item.value"
                                                                    :placeholder="item.placeholder" />
                                                                <a-button type="text" danger
                                                                    @click="deleteComponentFunc(index)">
                                                                    <DeleteOutlined />
                                                                </a-button>
                                                                <!-- </a-space> -->
                                                            </div>
                                                        </div>
                                                    </a-col>
                                                </a-row>
                                                <div class="rules-type-btns">
                                                    <a-space>
                                                        <a-button type="primary" ghost>应用到全部节点</a-button>
                                                        <a-button type="primary">选择默认模板</a-button>
                                                    </a-space>
                                                </div>
                                            </div>
                                            <div class="data-rules-config">
                                                <p>第二步:&nbsp;&nbsp;配置数据</p>
                                                <a-row :gutter="16">
                                                    <a-col :span="12">
                                                        <div class="rules-config-data">
                                                            <p>数据配置</p>
                                                            <a-form-item label="操作者">
                                                                <a-input type="input" style="width: 180px" />
                                                            </a-form-item>
                                                            <a-form-item label="操作时间">
                                                                <a-date-picker style="width: 180px;" />
                                                            </a-form-item>
                                                            <a-form-item label="操作图片">
                                                                <a-button type="primary">上传</a-button>
                                                            </a-form-item>
                                                            <a-form-item label="备注">
                                                                <a-input type="input" style="width: 180px" />
                                                            </a-form-item>
                                                        </div>
                                                    </a-col>
                                                    <a-col :span="12">
                                                        <div class="rules-config-authority">
                                                            <p>权限配置</p>
                                                            <a-form-item ref="authorityRange" name="authorityRange"
                                                                label="权限范围">
                                                                <a-switch checked-children="可见" un-checked-children="不可见"
                                                                    v-model:checked="rulesFormState.authorityRange" />
                                                                <p>仅下方选择角色可见</p>
                                                            </a-form-item>
                                                            <a-form-item ref="selectRole" name="selectRole" label="选择角色">
                                                                <a-select v-model:value="rulesFormState.selectRole"
                                                                    :options="[]" style="width: 180px"
                                                                    placeholder="请选择角色"></a-select>
                                                                <p>支持多选</p>
                                                            </a-form-item>
                                                            <div class="config-authority-btns">
                                                                <a-space>
                                                                    <a-button type="primary" ghost>应用到全部节点</a-button>
                                                                </a-space>
                                                            </div>
                                                        </div>
                                                    </a-col>
                                                </a-row>
                                            </div>
                                        </template>
                                        <!-- 系统采集 -->
                                        <template v-if="rulesFormState.sourceName == 2">
                                            <div class="data-rules-select">
                                                <p>数据选择</p>
                                                <a-form-item ref="selectType" name="selectType" label="选择功能">
                                                    <a-select v-model:value="rulesFormState.selectType" :options="[]"
                                                        style="width: 200px" placeholder="请选择功能"></a-select>
                                                    <span>根据产品批次关联茶园数据</span>
                                                </a-form-item>
                                                <a-form-item ref="dataRules" name="dataRules" label="数据规则">
                                                    <div class="rules-select-tables">
                                                        <div class="rules-select-btns">
                                                            <a-button type="primary" @click="handleAdd">添加规则</a-button>
                                                        </div>
                                                        <a-table bordered :data-source="dataSource" :columns="columns"
                                                            :pagination="false">
                                                            <template #bodyCell="{ column, record }">
                                                                <template v-if="column.key === 'lbzd'">
                                                                    <a-select placeholder="列表字段" :options="[]"></a-select>
                                                                </template>
                                                                <template v-if="column.key === 'zszd'">
                                                                    <a-input placeholder="展示名称" />
                                                                </template>
                                                                <template v-if="column.key === 'action'">
                                                                    <div class="action">
                                                                        <a-button type="link" danger size="small"
                                                                            @click="handleDelete(record.sort)"> 移除
                                                                        </a-button>
                                                                    </div>
                                                                </template>
                                                            </template>
                                                        </a-table>
                                                    </div>
                                                </a-form-item>
                                            </div>
                                            <div class="data-rules-authority">
                                                <p>权限配置</p>
                                                <a-form-item ref="authorityRange" name="authorityRange" label="权限范围">
                                                    <a-switch checked-children="可见" un-checked-children="不可见"
                                                        v-model:checked="rulesFormState.authorityRange" />
                                                    <span>仅下方选择角色可见</span>
                                                </a-form-item>
                                                <a-form-item ref="selectRole" name="selectRole" label="选择角色">
                                                    <a-select v-model:value="rulesFormState.selectRole" :options="[]"
                                                        style="width: 200px" placeholder="请选择角色"></a-select>
                                                    <span>支持多选</span>
                                                </a-form-item>
                                                <div class="rules-authority-btns">
                                                    <a-button type="primary" ghost>应用到全部节点</a-button>
                                                </div>
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
                            <a-button v-if="current == steps.length - 1" type="primary" html-type="submit"
                                @click="submit">提交</a-button>
                        </div>
                    </div>
                </a-col>
            </a-row>
        </config-page>
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
    }
}
</style>
