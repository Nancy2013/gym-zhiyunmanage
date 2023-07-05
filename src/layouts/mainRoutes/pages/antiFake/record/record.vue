<template>
    <div>
        <a-form layout="inline" :model="query">
            <a-form-item label="">
                <a-input v-model:value="query.idisCode" placeholder="工业标识" @pressEnter="handleSearch" />
            </a-form-item>
            <a-form-item label="">
                <a-range-picker style="width: 240px;" v-model:value="query.dates" />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" @click="handleSearch">查询</a-button>
            </a-form-item>
        </a-form>
    </div>
    <div style="margin-top: 16px">
        <a-radio-group v-model:value="tabIndex" button-style="solid" @change="handleChangeTab">
            <a-radio-button :value="0">防伪记录查询</a-radio-button>
            <a-radio-button :value="1">防伪查询热力图</a-radio-button>
        </a-radio-group>
    </div>
    <div class="antiFake-record-content">
        <div :class="`${tabIndex == 0 ? 'antiFake-record-show' : 'antiFake-record-hide'}`">
            <config-table :configColumns="{
                    tableModules: {
                        columns,
                        dataSource,
                        rowKey: 'id',
                        bordered: true,
                        loading,
                        pagination,
                        rowSelection:{},
                        onChange: paginationChange
                    },
                    actionModules: {
                        isAdd: false,
                        isSearch: false,
                        isAction: true,
                        receive: reset
                    },
                    paginationModules: {
                       
                    }
                }">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key == 'syncStatus'">
                        <template v-if="record.syncStatus == 1"><a-tag color="orange">已创建</a-tag></template>
                        <template v-if="record.syncStatus == 2"><a-tag color="green">已同步</a-tag></template>
                        <template v-if="record.syncStatus == 3"><a-tag color="red">同步失败</a-tag></template>
                    </template>
                    <template v-if="column.key === 'action'">
                        <div class="action">
                            <a-button type="link" size="small"> 详情 </a-button>
                        </div>
                    </template>
                </template>
            </config-table>
        </div>
        <div :class="`${tabIndex == 1 ? 'antiFake-record-show' : 'antiFake-record-hide'}`" style="width: 100%; height: 600px; margin-top: 16px;" id="container"></div>
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
