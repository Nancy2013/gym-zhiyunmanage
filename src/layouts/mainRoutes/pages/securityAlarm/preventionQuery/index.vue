<template>
  <div class="list">
    <div class="operate">
      <a-form layout="inline">
        <a-form-item label="">
          <a-input v-model:value="search.regionName" placeholder="区域地址" />
        </a-form-item>
        <a-form-item label="">
          <a-input v-model:value="search.productName" placeholder="产品名称" />
        </a-form-item>
        <a-form-item label="">
          <a-select ref="select" v-model:value="search.handleStatus" placeholder="请选择处理状态" style="width: 200px" :options="options"
            allowClear></a-select>
        </a-form-item>
        <a-form-item>
          <a-button class='left' type="primary" @click="handleSearch">搜索</a-button>
          <a-button type="primary" @click="reset">重置</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="content">
      <config-table :configColumns="{
        tableModules: {
          columns,
          dataSource,
          rowKey: 'id',
          bordered: true,
          loading,
          pagination,
          onChange: paginationChange,
        },
        actionModules: {
          isAdd: false,
          isSearch: false,
          isAction: true,
          receive: handleFresh
        },
      }">
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'index'">
            {{ index + 1 }}
          </template>
          <template v-if="column.key === 'handleStatus'">
            {{ record.handleStatus===1?'已处理':'未处理' }}
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a-tooltip placement="bottom" v-if='record.handleStatus===1' >
                <template #title>
                  <span>{{ record.handleRemark }}</span>
                </template>
                <a-button type="link" size="small"> 查看 </a-button>
              </a-tooltip>
              <a-button v-else type="link" size="small" @click="handle(record)"> 处理 </a-button>
            </a-space>
          </template>
        </template>
      </config-table>
    </div>
  </div>
  <a-modal v-model:visible="visible" title="处理结果" @ok="handleOk" :maskClosable="false">
    <div class="modal-content">
      <textarea style="width: 100%" placeholder="请输入处理结果(必填)" v-model="current.handleRemark" rows="2"
                            class="textarea"></textarea>
    </div>
  </a-modal>
</template>
<script lang="ts">
import Index from './index'

export default Index;
</script>
<style lang="less" scoped>
@import url("./index.less");
</style>
