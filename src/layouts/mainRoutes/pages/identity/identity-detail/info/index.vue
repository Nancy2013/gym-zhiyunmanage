<template>
    <div class="identity-detail-info">
        <a-row>
            <a-col :span="12">
                <div class="detail-info-tabs">
                    <a-tabs v-model:activeKey="activeKey">
                        <a-tab-pane key="1" tab="基本属性">
                            <div class="detail-info-form">
                                <div class="info-form-item">
                                    <label>工业标识</label>
                                    <a-input style="width:300px" placeholder="工业标识" v-model:value="formState.idisCode" disabled></a-input>
                                </div>
                                <div class="info-form-item">
                                    <label>{{ getLabel }}名称</label>
                                    <a-input style="width:300px" :placeholder="`${getLabel}名称`" v-model:value="formState.boName" disabled></a-input>
                                </div>
                                <div class="info-form-item">
                                    <label>{{ getLabel }}分类</label>
                                    <a-input style="width:300px" :placeholder="`${getLabel}分类`" v-model:value="formState.categoryName" disabled></a-input>
                                </div>
                                <template v-if="formState.dataType === objectAndProductDataTypeDict.product">
                                    <div class="info-form-item">
                                        <label>{{ getLabel }}模版</label>
                                        <a-input style="width:300px" :placeholder="`${getLabel}模版`" v-model:value="formState.templateName" disabled></a-input>
                                    </div>
                                </template>
                            </div>
                        </a-tab-pane>
                        <a-tab-pane key="2" tab="规格/属性">
                            <template v-if="formState.businessObjectAttrBOList">
                                <div class="detail-info-form" v-for="(item, index) in formState.businessObjectAttrBOList" :key="index">
                                    <div class="info-form-item">
                                        <label>{{ item.attrNameCn }}</label>
                                        <a-input style="width:300px" placeholder="容量" v-model:value="item.attrValue" disabled></a-input>
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <Empty description="暂无规格属性" />
                            </template>
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </a-col>
            <a-col :span="12">
                <div class="detail-info-canvas">
                    <div class="info-canvas-card">
                        <canvas id="canvas" width="370" height="612" :key="qrcodeKey"></canvas>
                        <div id="qrcode" class="canvas-card-qrcode" style="display: none;"></div>
                    </div>
                    <div class="info-canvs-btn">
                        <a-button type="primary" @click="downloadCode">下载</a-button>
                    </div>
                </div>
            </a-col>
        </a-row>
    </div>
</template>
<script lang="ts">
import Index from "./index";
export default Index;
</script>
<style lang="less" scoped>
@import url("./index.less");
</style>