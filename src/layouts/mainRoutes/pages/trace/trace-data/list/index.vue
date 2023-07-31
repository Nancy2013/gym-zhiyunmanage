<template>
    <div class="trace-data-list">
        <vue-table :columns="columns" :dataSource="dataSource" :paginationConfig="pagination" @pageChange="paginationChange"
            :loading="loading" :searchRenderList="searchRenderList" :searchData="query" @search="queryList">

            <template #headerBtnArea>
                <a-button type="primary" @click="queryList">搜索</a-button>
                <a-button type="primary" @click="showAction()">添加</a-button>
            </template>

            <template #action="{ record }">
                <a-space>
                    <a-button type="link" size="small" @click="showAction(record.id)"> 编辑 </a-button>
                    <a-button type="link" danger size="small" @click="deleteConfirm(record.id)"> 删除 </a-button>
                </a-space>
            </template>

        </vue-table>
    </div>
</template>
<script lang="ts">
import Index from './index'
export default Index
</script>
