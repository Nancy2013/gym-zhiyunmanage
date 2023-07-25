<template>
  <div class="page">
    <div class="header">
      <slot name="header"></slot>
      <div class="export">
        <a-button type="primary" @click="exportData">导出</a-button>
      </div>
    </div>
    <div class="content">
      <div class="table">
        <config-table :key='columns' :configColumns="{
          tableModules: {
            loading,
            columns,
            dataSource,
            rowKey: 'id',
            scroll: { x: 1500 },
            bordered: true,
            pagination,
            onChange: paginationChange
          },
          actionModules: {
            isAdd: false,
            isSearch: false,
            isAction: false,
          }
        }">
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key == 'index'">
                        {{ index + 1 }}
           </template>
        </template>
        </config-table>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Index from './index'

export default Index;
</script>
<style lang="less" scoped>
@import url("./index.less");
</style>
