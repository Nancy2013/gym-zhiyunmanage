<template>
  <div class="storagePage">
    <Page :columns="columns" :dataSource="dataSource" :loading="loading" :pagination="pagination"
       :paginationChange="paginationChange" @exportData="exportData" >
       <template #header>
        <div class="operate">
          <a-form layout="inline" :model="search">
            <a-form-item label="">
              <a-select style="width:200px" v-model:value="search.type" placeholder="请选择订单类型"
                :options="options"></a-select>
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
const columns = [
  {
    key: "@index",
    dataIndex: "@index",
    align: "center",
    title: "订单号",
  },
  {
    key: "@index",
    dataIndex: "@index",
    align: "center",
    title: "订单类型",
  },
  {
    key: "@index",
    dataIndex: "@index",
    align: "center",
    title: "物料名称",
  },
  {
    key: "@index",
    dataIndex: "@index",
    align: "center",
    title: "数量",
  },
  {
    key: "@index",
    dataIndex: "@index",
    align: "center",
    title: "时间",
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
        type:null,
      },
      options: [
        {
          label: '出库',
          value: 0
        },
        {
          label: '入库',
          value: 1
        },
      ],
    });
    const search = toRef(state, 'search');
    const opts = {
      queryApi: 'storageDetail',
      search,
      exportApi:'',
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
    };
  },
});
</script>

<style lang="less" scoped>
.storagePage {}
</style>