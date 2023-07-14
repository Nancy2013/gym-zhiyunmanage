<template>
  <div class="identity-strategy-action">
    <a-spin :spinning="loading">
      <config-page title="返回" sub-title="返回到标识策略页">
      <div class="strategy-action-content">
        <a-form ref="formRef" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules"
          @finish="submit">
          <!-- 基础信息 -->
          <div class="action-content-baseInfo">
            <div class="content-label"><span>基础信息</span></div>
            <div class="content-form">
              <a-form-item ref="ruleName" name="ruleName" label="标识策略名称">
                <a-input v-model:value="formState.ruleName" placeholder="请输入标识策略名称" style="width: 300px;" />
              </a-form-item>
              <a-form-item ref="ruleType" name="ruleType" label="生码类型">
                <a-select v-model:value="formState.ruleType" placeholder="请选择生码类型" style="width: 300px"
                  :options="typeOptions" @change="typeChange" :getPopupContainer="getPopupContainer"></a-select>
              </a-form-item>
              <template v-if="judgeType">
                <a-form-item ref="generateNode" name="generateNode" label="生码节点">
                  <a-radio-group v-model:value="formState.generateNode">
                    <a-radio :value="1">对象添加完成时</a-radio>
                    <a-radio :value="2">对象认证通过时</a-radio>
                  </a-radio-group>
                </a-form-item>
                <template v-if="formState.generateNode === 1">
                  <a-form-item ref="categoryId" name="categoryId" label="适用对象分类">
                    <a-cascader style="width: 300px;" v-model:value="formState.categoryId" :options="categoryOptions" :load-data="loadData"
                      placeholder="请选择对象分类" :fieldNames="fieldCategoryNames" @change="handleCategoryChange" :getPopupContainer="getPopupContainer"/>
                  </a-form-item>
                </template>
                <template v-if="formState.generateNode === 2">
                  <a-form-item ref="generateTypeId" name="generateTypeId" label="选择审核模块">
                    <a-select v-model:value="formState.generateTypeId" placeholder="请选择审核模块" style="width: 300px"
                  :options="moduleOptions" :fieldNames="fieldModuleNames" :getPopupContainer="getPopupContainer"></a-select>
                  </a-form-item>
                </template>
              </template>
            </div>
          </div>
          <!-- 标识规则 -->
          <div class="action-content-rule">
            <div class="content-label"><span>标识规则</span></div>
            <div class="content-table">
              <div class="content-table-btn">
                <a-button type="primary" @click="handleAdd">自定属性</a-button>
              </div>
              <div class="content-table-item">
                <a-table bordered :data-source="dataSource" :columns="columns" :pagination="false">
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'itemType'">
                      <a-select style="width: 150px" placeholder="标识分类" :options="itemTypeOptions"
                        v-model:value="record.itemType" @change="formTypeChange(record.sort)"></a-select>
                    </template>
                    <template v-if="column.key === 'keyEn'">
                      <a-input placeholder="英文名称" v-model:value="record.keyEn" />
                    </template>
                    <template v-if="column.key === 'keyCn'">
                      <a-input placeholder="中文名称" v-model:value="record.keyCn" @change="keyCnChange(record.sort)" />
                    </template>
                    <template v-if="column.key === 'itemDigit'">
                      <a-input type="number" placeholder="序号位位数" v-model:value="record.itemDigit"
                        @change="digitChange(record.sort)" />
                    </template>
                    <template v-if="column.key === 'defaultValue'">
                      <template v-if="record.itemType == 3">
                        <a-select style="width: 150px" placeholder="请选择默认格式" :options="dateOptions"
                          v-model:value="record.defaultValue" @change="formdateChange(record.sort)"></a-select>
                      </template>
                      <template v-else>
                        <a-input style="width: 150px" placeholder="默认值" v-model:value="record.defaultValue"
                          :maxlength="record.itemDigit" />
                      </template>
                    </template>
                    <template v-if="column.key === 'description'">
                      <a-input placeholder="备注说明" v-model:value="record.description" />
                    </template>
                    <template v-if="column.key === 'action'">
                      <div class="action">
                        <a-button type="link" danger size="small" @click="handleDelete(record.sort)"> 移除 </a-button>
                      </div>
                    </template>
                  </template>
                </a-table>
              </div>
            </div>
          </div>
          <!-- 操作选项 -->
          <div class="action-content-btns">
            <div class="content-btns">
              <a-button type="default" @click="cancel">取消</a-button>
              <a-button type="primary" html-type="submit">提交</a-button>
            </div>
          </div>
        </a-form>
      </div>
    </config-page>
    </a-spin>
  </div>
</template>
<script lang="ts">
import Index from './index'
export default Index
</script>
<style lang="less" scoped>
@import url('./index.less');
</style>
