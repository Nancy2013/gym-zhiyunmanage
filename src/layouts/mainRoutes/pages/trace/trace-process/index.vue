<template>
    <div class="trace-process">
        <vue-table :columns="columns" :dataSource="dataSource" :paginationConfig="pagination" @pageChange="paginationChange"
            :loading="loading" :searchRenderList="searchRenderList" :searchData="query" @search="queryList">

            <template #headerBtnArea>
                <a-button type="primary" @click="queryList">搜索</a-button>
                <a-button type="primary" @click="reset">重置</a-button>
                <a-button type="primary" @click="showModal('添加流程')">添加</a-button>
            </template>

            <template #action="{ record }">
                <a-space>
                    <a-button type="link" size="small" @click="showModal('修改流程', record)"> 修改 </a-button>
                    <a-button type="link" size="small" @click="showModal('复制流程', record)"> 复制 </a-button>
                    <a-button type="link" danger size="small" @click="deleteConfirm(record.id)"> 删除 </a-button>
                </a-space>
            </template>

        </vue-table>
        <!-- 弹框 -->
        <a-modal v-model:visible="visible" :title="title" :afterClose="destroyInfo" width="800px" @ok="submit">
            <div class="modal-content">
                <a-form ref="formRef" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules">
                    <a-form-item ref="name" name="name" label="流程名称">
                        <tsx-input v-model:value="formState.name" maxLength="20" placeholder="请输入流程名称" />
                    </a-form-item>
                    <a-form-item ref="treeLevel" name="treeLevel" label="流程层级">
                        <a-select v-model:value="formState.treeLevel" placeholder="请选择层级" :options="levelOptions"
                            @change="selectTreeLevel"></a-select>
                    </a-form-item>
                    <a-form-item ref="remark" name="remark" label="流程说明">
                        <a-input v-model:value="formState.remark" placeholder="请输入流程说明" />
                    </a-form-item>
                    <a-form-item ref="stepParams" name="stepParams" label="流程配置">
                        <tsxTree :treeConfigs="{
                            treeModules: {
                                treeData: formState.stepParams,
                                showLine: true,
                                autoExpandParent: true,
                                defaultExpandAll: true,
                                level: formState.treeLevel,
                                nodeName: '新流程'
                            }
                        }">
                        </TsxTree>
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
