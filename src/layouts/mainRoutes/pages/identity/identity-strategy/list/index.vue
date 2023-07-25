<template>
    <div class="identity-strategy" style="height: 100%">
        <FcTable :columns="columns" :dataSource="dataSource" :paginationConfig="pagination" @pageChange="paginationChange" :loading="loading" :searchRenderList="searchRenderList" :searchData="query" @search="queryList">

            <template #headerBtnArea>
                <a-button type="primary" @click="queryList">搜索</a-button>
                <a-button type="default" @click="reset">重置</a-button>
                <a-button type="primary" @click="showAction('add')">添加</a-button>
            </template>

            <template #ruleType="{ record }">
                <template v-if="record.ruleType == 1"><a-tag color="green">手动生码</a-tag></template>
                <template v-if="record.ruleType == 2"><a-tag color="blue">自动生码</a-tag></template>
            </template>

            <template #action="{ record }">
                <div class="action">
                    <a-button type="link" size="small" @click="showAction('edit', record.id)"> 编辑 </a-button>
                    <a-button type="link" size="small" @click="showAction('copy', record.id)"> 复制 </a-button>
                    <a-button type="link" danger size="small" @click="deleteConfirm(record.id)"> 删除 </a-button>
                </div>
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
<style lang="less">
.full-modal {
    .ant-modal {
        max-width: 100%;
        top: 0;
        padding-bottom: 0;
        margin: 0;
    }

    .ant-modal-content {
        display: flex;
        flex-direction: column;
        height: calc(100vh);
    }

    .ant-modal-body {
        flex: 1;
    }
}
</style>