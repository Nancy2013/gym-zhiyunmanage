<template>
    <div class="identity-detail">
        <FcTable :columns="columns" :dataSource="dataSource" :paginationConfig="pagination" @pageChange="paginationChange" :loading="loading" :searchRenderList="searchRenderList" :searchData="query" @search="queryList">

            <template #headerBtnArea>
                <a-button type="primary" @click="queryList">搜索</a-button>
                <a-button type="default" @click="reset">重置</a-button>
            </template>

            <template #businessObjectCategoryName="{ record }">
                {{record.dataType?"产品 > ":'' }}{{record.businessObjectCategoryName}}
            </template>

            <template #syncStatus="{ record }">
                <template v-if="record.syncStatus == 1"><a-tag color="orange">已创建</a-tag></template>
                <template v-if="record.syncStatus == 2"><a-tag color="green">已同步</a-tag></template>
                <template v-if="record.syncStatus == 3"><a-tag color="red">同步失败</a-tag></template>
            </template>

            <template #action="{ record }">
                <div class="action">
                    <a-button type="link" size="small" @click="showInfo(record.idisCode)"> 详情 </a-button>
                </div>
            </template>
        </FcTable>
    </div>
</template>
<script lang="ts">
import Index from './index';
export default Index
</script>
<style lang="less" scoped>
@import url('./index.less');
</style>