<template>
    <div style="height: 100%">
        <FcTable :columns="columns" :dataSource="dataSource" :paginationConfig="pagination" @pageChange="paginationChange" :loading="loading" :searchRenderList="searchRenderList" :searchData="searchData" @search="handleSearch">

            <template #headerBtnArea>
                <a-button type="primary" @click="handleSearch">查询</a-button>
                <a-button type="primary" @click="handleAdd">添加</a-button>
            </template>

            <template #action="{ record }">
                <a-space>
                    <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
                    <a-button type="link" size="small" @click="handleCopy(record)">复制</a-button>
                    <a-button type="link" danger size="small" @click="handleDelete(record)">删除</a-button>
                </a-space>
            </template>
        </FcTable>
    </div>
    <!-- <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <a-form layout="inline" :model="searchData">
            <a-form-item label="">
                <a-input v-model:value="searchData.name" placeholder="模板名称/关联对象" />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" @click="handleSearch">查询</a-button>
            </a-form-item>
        </a-form>
        <div>
            <a-button type="primary" @click="handleAdd">添加</a-button>
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
        receive:handleFresh
      },
    }">
	

        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
                <a-space>
                    <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>

                    <a-button type="link" size="small" @click="handleCopy(record)">复制</a-button>
                    
                    <a-button type="link" danger size="small" @click="handleDelete(record)">删除</a-button>
                </a-space>
            </template>
        </template>
    </config-table> -->


</template>

<script lang="ts">
import { defineComponent } from "vue";
import TemplateList from './templateList'
export default defineComponent({
	setup() {
		return {
			...TemplateList()
        };
    },
});
</script>