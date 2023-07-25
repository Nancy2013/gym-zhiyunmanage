<template>
  <div class="add">
    <!-- <div class="header">
      <a-page-header title="返回" sub-title="" @back="back" />
    </div> -->
    <div class="content">
      <div class="left-table">
        <div class="operate">
          <a-form layout="inline">
            <a-form-item label="">
              <a-select v-model:value="search.productId" show-search placeholder="请选择产品" style="width: 200px"
                :options="productOptions" :filter-option="productFilterOption" @change="handleChange"
                :fieldNames="productFieldNames" allowClear></a-select>
            </a-form-item>
            <a-form-item>
              <a-select v-model:value="search.batchId" show-search placeholder="请选择批次" style="width: 200px"
                :options="batchOptions" :filter-option="batchFilterOption" @change="handleChange"
                :fieldNames="batchFieldNames" allowClear></a-select>
            </a-form-item>
          </a-form>
        </div>
        <div class="table">
          <a-table :dataSource="filterData" :columns="columns" :pagination='leftPagination' bordered
            @change="(pagination:any)=>paginationChange(pagination,'left')" :loading="lfLoading">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'action'">
                <a-space>
                  <a-button type="link" size="small" @click="handleAdd(record)"> 新增 </a-button>
                </a-space>
              </template>
            </template>
          </a-table>
        </div>
      </div>
      <div class="right-table">
        <div class="operate">
          <a-form layout="inline" ref="formRef" :model="formData" >
            <a-form-item label="" name="regin">
              <a-select v-model:value="formData.regionId" placeholder="请选择区域" style="width: 200px" :options="regionOptions"
                :fieldNames="regionFieldNames"></a-select>
            </a-form-item>
          </a-form>
          <div>
            <a-button type="primary" @click="submit">提交</a-button>
          </div>
        </div>
        <div class="table">
          <a-table :dataSource="batchData" :columns="columns" bordered :loading="rtLoading" :pagination="rightPagination" @change="(pagination:any)=>paginationChange(pagination,'right')">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'action'">
                <a-space>
                  <a-button type="link" size="small" @click="handleDel(record)"> 删除 </a-button>
                </a-space>
              </template>
            </template>
          </a-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Index from './index'

export default Index;
</script>
<style lang="less" scoped>@import url("./index.less");</style>
