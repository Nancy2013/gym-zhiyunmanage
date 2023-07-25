<template>
    <div style="height: 100%;">
        <FcTable :columns="columns" :dataSource="dataSource" :paginationConfig="pagination" @pageChange="paginationChange" :loading="loading" :searchRenderList="searchRenderList" :searchData="searchData" @search="handleSearch">

            <template #headerBtnArea>
                <a-button type="primary" @click="handleSearch">查询</a-button>
                <a-button type="primary" @click="handleAdd">添加</a-button>
                <a-button type="primary" @click="handleDownload">下载Excel模板</a-button>
                <a-button type="primary" @click="handleImport">批量导入</a-button>
            </template>

            <template #action="{ record }">
                <a-space>
                    <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
                    <a-button type="link" danger size="small" @click="handleDelete(record)">删除</a-button>
                </a-space>
            </template>

            <template #sourceFlag="{record}">
                <a-space>
                    {{ sourceFlagDict[record.sourceFlag] }}
                </a-space>
            </template>

            <template #syncStatus="{record}">
                <a-tag v-if="record.syncStatus" :color="syncStatusColor[record.syncStatus]">{{ syncStatusDict[record.syncStatus] }}</a-tag>
            </template>
        </FcTable>
    </div>
    <!-- <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <a-form layout="inline" :model="searchData">
            <a-form-item label="">
                <a-input v-model:value="searchData.name" @pressEnter="handleSearch" placeholder="产品编号/产品名称" />
            </a-form-item>
            <a-form-item label="">
                <Cascader style="width: 194px;" :options="objectClassOptions" :load-data="loadData" v-model:value="searchData.categoryId" placeholder="选择产品分类" change-on-select allowClear></Cascader>
            </a-form-item>
            <a-form-item>
                <a-button type="primary" @click="handleSearch">查询</a-button>
            </a-form-item>
        </a-form>
        <div>
            <a-button type="primary" @click="handleAdd">添加</a-button>
            <a-button type="primary" @click="handleDownload" style="margin: 0 8px">下载Excel模板</a-button>
            <a-button type="primary" @click="handleImport">批量导入</a-button>
        </div>
    </div>
    <config-table :configColumns="{
      tableModules: {
        columns,
        dataSource,
        rowKey: 'id',
        bordered: true,
        loading: false,
        pagination,
        onChange: paginationChange
      },
      actionModules: {
        isAdd: false,
        isSearch: false,
        isAction: true,
        receive:handleFresh,
      },
    }">

        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
                <a-space>
                    <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
                    <a-button type="link" danger size="small" @click="handleDelete(record)">删除</a-button>
                </a-space>
            </template>

            <template v-if="column.key === 'sourceFlag'">
                <a-space>
                    {{ sourceFlagDict[record.sourceFlag] }}
                </a-space>
            </template>

            <template v-if="column.key === 'syncStatus'">
                <a-tag v-if="record.syncStatus" :color="syncStatusColor[record.syncStatus]">{{ syncStatusDict[record.syncStatus] }}</a-tag>
            </template>
        </template>
    </config-table> -->

    <input id="download" type="file" class="file" @change="handleUpload" style="display: none" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Cascader } from "ant-design-vue";
import Main from "./productList";
export default defineComponent({
    components: {
        Cascader,
    },
    setup() {
        return {
            ...Main(),
        };
    },
});
</script>