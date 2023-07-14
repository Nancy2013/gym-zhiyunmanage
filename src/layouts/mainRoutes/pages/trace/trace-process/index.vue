<template>
    <div class="trace-process">
        <!-- 表格 -->
        <div class="trace-process-tables">
            <div class="process-tables-search">
                <div class="search-left">
                    <div class="search-left-inline">
                        <a-input style="width: 200px;" placeholder="流程名称" />
                    </div>
                    <div class="search-left-inline">
                        <a-button type="primary">搜索</a-button>
                    </div>
                </div>
                <div class="search-right">
                    <div class="seach-right-inline">
                        <a-button type="primary" @click="showModal('添加流程')">添加</a-button>
                    </div>
                </div>
            </div>
            <config-table 
              :configColumns="{
                 tableModules: {
                    columns,
                    dataSource,
                    rowKey: 'id',
                    loading: false,
                    bordered: true,
                    rowSelection: {}
                 },
                 actionModules: {
                    isAdd: false,
                    isSearch: false,
                    isAction: true
                 },
                 paginationModules: {

                 }
              }"
            >
            <template #bodyCell="{ column }">
                    <template v-if="column.key === 'action'">
                        <div class="action">
                            <a-button type="link" size="small" @click="showModal('修改流程')"> 修改 </a-button>
                            <a-divider type="vertical" />
                            <a-button type="link" size="small"> 复制 </a-button>
                            <a-divider type="vertical" />
                            <a-button type="link" danger size="small"> 删除 </a-button>
                        </div>
                    </template>
                </template>
            </config-table>
        </div>
        <!-- 弹框 -->
        <a-modal
           v-model:visible="visible"
           :title="title"
           width="800px"
        >
           <div class="modal-content">
              <a-form
                 ref="formRef"
                 :model="formState"
                 :label-col="labelCol"
                 :wrapper-col="wrapperCol"
                 :rules="rules"
              >
                <a-form-item ref="lcmc" name="lcmc" label="流程名称">
                    <a-input v-model:value="formState.lcmc" placeholder="请输入流程名称" />
                </a-form-item>
                <a-form-item ref="object" name="object" label="对象">
                    <a-select v-model:value="formState.object" placeholder="请选择对象"></a-select>
                </a-form-item>
                <a-form-item ref="bzmc" name="bzmc" label="步骤编辑">
                    <config-tree 
                      :treeConfigs="{
                         treeModules: {
                            treeData,
                            showLine: true,
                            autoExpandParent: true,
                            defaultExpandAll: true,
                            level: 2,
                            nodeName: '新步骤'
                         }
                       }">
                    </config-tree>
                </a-form-item>
              </a-form>
           </div>
        </a-modal>
    </div>
</template>
<script lang="ts">
import Index from './index'
export default Index
</script>
<style lang="less" scoped>
  @import url('./index.less');
</style>
