<template>
  <div class="orderPage">
    <Page :columns="columns" :dataSource="dataSource" :loading="loading" :pagination="pagination"
      :paginationChange="paginationChange" @exportData="exportData" >
      <template #header>
        <div class="operate">
          <a-form layout="inline" :model="search">
            <a-form-item label="">
              <a-range-picker v-model:value="search.timePicker" picker="month"  :valueFormat="pickerFormat.monthFormat"/>
            </a-form-item>
            <a-form-item label="">
              <a-button type="primary" @click="handleSearch">查询</a-button>
            </a-form-item>
          </a-form>
        </div>
      </template>
    </Page>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, toRef, onMounted } from "vue";
import Page from '../components/page/index.vue';
import { usePage } from '../composables/usePage';
import { pickerFormat } from '@/utils/common';
const columns = [
  {
    key: "productName",
    dataIndex: "productName",
    align: "center",
    title: "产品名称",
  },
  {
    key: "brandName",
    dataIndex: "brandName",
    align: "center",
    title: "品牌名称",
  },
  {
    key: "productNo",
    dataIndex: "productNo",
    align: "center",
    title: "产品编码",
  },
  {
    key: "productSaleVolume",
    dataIndex: "productSaleVolume",
    align: "center",
    title: "产品销量",
    sorter:(a:any, b:any) => a.productSaleVolume - b.productSaleVolume,
    defaultSortOrder: 'descend',
  },
  {
    key: "totalSales",
    dataIndex: "totalSales",
    align: "center",
    title: "总销售额(万元)",
    sorter:(a:any, b:any) => a.totalSales - b.totalSales,
  },
];

export default defineComponent({
  props: {},
  components: {
    Page,
  },
  setup() {
    const state = reactive({
      columns,
      search: {
        timePicker: [],
      },
    });
    const search = toRef(state, 'search');
    const opts = {
      queryApi: 'saleRank',
      search,
      exportApi: '',
    };
    const { dataSource, loading, pagination, handleSearch, paginationChange, exportData } = usePage(opts);
    onMounted(() => {});

    return {
      ...toRefs(state),
      dataSource,
      loading,
      pagination,
      handleSearch,
      paginationChange,
      exportData,
      pickerFormat,
    };
  },
});
</script>

<style lang="less" scoped>
.orderPage {}
</style>