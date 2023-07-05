<template>
  <div class="list">
      <div class="operate">
        <a-form layout="inline">
            <a-form-item label="">
                    <a-input v-model:value="search.regionName" placeholder="区域名称" />
                </a-form-item>
                <a-form-item label="">
                    <a-input v-model:value="search.deployNo" placeholder="调配单号" @pressEnter="handleSearch"/>
                </a-form-item>
                <a-form-item>
                    <a-button class='left'  type="primary" @click="handleSearch">搜索</a-button>
                    <a-button type="primary" @click="reset">重置</a-button>
                </a-form-item>
            </a-form>
            <div>
                <a-button type="primary" @click="add">添加</a-button>
            </div>
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
                onChange: paginationChange
            },
            actionModules: {
                isAdd: false,
                isSearch: false,
                isAction: true,
                receive:handleFresh
            },
        }">
            <template #bodyCell="{ column, record,index }">
                <template v-if="column.key === 'index'">
                    {{ index+1 }}
                </template>
                <template v-if="column.key === 'deployTime'">
                    {{ record.deployTime?moment(record.deployTime).format('YYYY-MM-DD hh:mm:ss'):'' }}
                </template>
                <template v-if="column.key === 'action'">
                    <a-space>
                        <a-button type="link" size="small" @click="edit(record)"> 配置批次 </a-button>
                        <a-divider type="vertical" />
                        <a-button type="link" class='error' size="small" @click="handleDel(record)"> 删除 </a-button>
                    </a-space>
                </template>
            </template>
        </config-table>
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
