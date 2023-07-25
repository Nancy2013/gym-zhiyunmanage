<template>
    <div class="list" style="height: 100%;">
        <FcTable :columns="columns" :dataSource="dataSource" :paginationConfig="pagination" @pageChange="paginationChange" :loading="loading" :searchRenderList="searchRenderList" :searchData="search" @search="handleSearch">

            <template #headerBtnArea>
                <a-button class='left' type="primary" @click="handleSearch">搜索</a-button>
                <a-button @click="reset">重置</a-button>
                <a-button type="primary" @click="jump({ name: 'deployBatchAdd', params: { type: 'add' } })">添加</a-button>
            </template>

            <template #deployTime="{ record }">
                {{ record.deployTime?moment(record.deployTime).format('YYYY-MM-DD hh:mm:ss'):'' }}
            </template>

            <template #action="{ record }">
                <a-space>
                    <a-button type="link" size="small" @click="jump({ name: 'deployBatchAdd', params: { type: 'edit' }, query: { id: record.id } })">配置批次</a-button>
                    <a-button type="link" class='error' size="small" @click="handleDel(record)">删除</a-button>
                </a-space>
            </template>
        </FcTable>
    </div>
</template>
<script lang="ts">
import Index from "./index";

export default Index;
</script>
<style lang="less" scoped>
@import url("./index.less");
</style>
