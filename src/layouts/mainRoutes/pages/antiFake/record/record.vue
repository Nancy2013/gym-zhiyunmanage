<template>
    <div style="height: 100%;">
        <FcTable :columns="columns" :dataSource="dataSource" :paginationConfig="pagination" @pageChange="paginationChange" :loading="loading" :searchRenderList="searchRenderList" :searchData="query" @search="handleSearch" :hideTable="tabIndex === 1">
            <template #headerBtnArea>
                <a-button type="primary" @click="handleSearch"> 查询 </a-button>
            </template>

            <template #headerLeft>
                <a-radio-group v-model:value="tabIndex" button-style="solid" @change="handleChangeTab">
                    <a-radio-button :value="0">防伪记录查询</a-radio-button>
                    <a-radio-button :value="1">防伪查询热力图</a-radio-button>
                </a-radio-group>
            </template>

            <template #syncStatus="{ record }">
                <template v-if="record.syncStatus == 1"><a-tag color="orange">已创建</a-tag></template>
                <template v-if="record.syncStatus == 2"><a-tag color="green">已同步</a-tag></template>
                <template v-if="record.syncStatus == 3"><a-tag color="red">同步失败</a-tag></template>
            </template>

            <template #content>
                <div class="antiFake-record-content">
                    <div :class="`${tabIndex == 1 ? 'antiFake-record-show' : 'antiFake-record-hide'}`" style="width: 100%; height: 600px; margin-top: 16px;" id="container"></div>
                </div>
            </template>
        </FcTable>

    </div>
</template>

<script lang="ts">
import Record from "./record";
export default Record;
</script>

<style scoped>
.antiFake-record-content {
    position: relative;
}

.antiFake-record-show {
    position: relative;
    opacity: 1;
}

.antiFake-record-hide {
    position: absolute;
    opacity: 0;
    top: 0;
}
</style>
