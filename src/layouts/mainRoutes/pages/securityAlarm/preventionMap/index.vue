<template>
  <div class="prevention" style="height: 100%;">
    <vue-table :loading="loading" hideTable :searchRenderList="searchRenderList" :searchData="search" @search="handleSearch">

      <template #headerBtnArea>
        <a-button class='left' type="primary" @click="handleSearch">搜索</a-button>
          <a-button type="primary" @click="reset">重置</a-button>
      </template>

      <template #content>
        <Mapview :data="data"></Mapview>
      </template>
    </vue-table>
    <!-- <div class="operate">
      <a-form layout="inline">
        <a-form-item label="">
          <a-select v-model:value="search.productId" show-search placeholder="请选择产品" style="width: 200px"
                :options="productOptions" :filter-option="productFilterOption"
                :fieldNames="productFieldNames" allowClear></a-select>
        </a-form-item>
        <a-form-item label="">
          <a-select v-model:value="search.batchId" show-search placeholder="请选择批次" style="width: 200px"
                :options="batchOptions" :filter-option="batchFilterOption"
                :fieldNames="batchFieldNames" allowClear></a-select>
        </a-form-item>
        <a-form-item label="">
          <a-range-picker v-model:value="search.time" />
        </a-form-item>
        <a-form-item>
          <a-button class='left' type="primary" @click="handleSearch">搜索</a-button>
          <a-button type="primary" @click="reset">重置</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="map">
      <a-spin :spinning="loading">
        <Mapview :data="data"></Mapview>
        </a-spin>
      
    </div> -->
  </div>
</template>
<script lang="ts">
import Index from './index'

export default Index;
</script>
<style lang="less" scoped>
@import url("./index.less");
</style>
