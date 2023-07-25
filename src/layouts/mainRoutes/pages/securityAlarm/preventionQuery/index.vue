<template>
    <div class="list" style="height: 100%">
        <FcTable :columns="columns" :dataSource="dataSource" :paginationConfig="pagination" @pageChange="paginationChange" :loading="loading" :searchRenderList="searchRenderList" :searchData="search" @search="handleSearch">

            <template #headerBtnArea>
                <a-button class='left' type="primary" @click="handleSearch">搜索</a-button>
                <a-button type="primary" @click="reset">重置</a-button>
            </template>

            <template #handleStatus="{ record }">
                {{ record.handleStatus===1?'已处理':'未处理' }}
            </template>

            <template #action="{ record }">
                <a-space>
                    <a-tooltip placement="bottom" v-if='record.handleStatus===1'>
                        <template #title>
                            <span>{{ record.handleRemark }}</span>
                        </template>
                        <a-button type="link" size="small"> 查看 </a-button>
                    </a-tooltip>
                    <a-button v-else type="link" size="small" @click="handle(record)"> 处理 </a-button>
                </a-space>
            </template>
        </FcTable>
    </div>
    <a-modal v-model:visible="visible" title="处理结果" @ok="handleOk" :maskClosable="false">
        <div class="modal-content">
            <textarea style="width: 100%" placeholder="请输入处理结果(必填)" v-model="current.handleRemark" rows="2" class="textarea"></textarea>
        </div>
    </a-modal>
</template>
<script lang="ts">
import Index from "./index";

export default Index;
</script>
<style lang="less" scoped>
@import url("./index.less");
</style>
