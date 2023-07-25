<template>
  <a-spin :spinning="loading">
    <div class="add">
      <!-- <div class="header">
        <a-page-header title="返回" sub-title="" @back="back" />
      </div> -->
      <div class="content">
        <div class="sider">
          <div class="sider-title">区域分配</div>
          <div class="sider-tree">
            <Tree v-model:selectedKeys="selectedKeys" v-model:checkedKeys="checkedKeys" checkable :tree-data="data"
              @check="handleCheck" />
          </div>
        </div>
        <div class="form">
          <a-form ref="formRef" layout="inline" :model="formData" :rules="rules">
            <a-form-item label="区域名称" name="regionName">
              <a-input v-model:value="formData.regionName" placeholder="请输入区域名称" />
            </a-form-item>
          </a-form>
          <div class="table">
            <a-table :dataSource="tableData" :columns="columns" :pagination='pagination' bordered @change="paginationChange"/>
          </div>
          <div class="form-footer">
            <a-button type="primary" @click="submit">提交</a-button>
          </div>
        </div>
      </div>
    </div>
  </a-spin>
</template>
<script lang="ts">
import Index from './index'

export default Index;
</script>
<style lang="less" scoped>
@import url("./index.less");
</style>
