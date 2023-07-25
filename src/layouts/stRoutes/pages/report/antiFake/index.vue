<template>
  <div class="codePage">
    <Page :columns="columns" :dataSource="dataSource" :loading="loading" :pagination="pagination"
       :paginationChange="paginationChange" @exportData="exportData">
      <template #header></template>
    </Page>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, toRef, onMounted } from "vue";
import Page from './../components/page/index.vue';
import { usePage } from './../composables/usePage';
const columns = [
  {
    key: "index",
    dataIndex: "index",
    align: "center",
    title: "序号",
  },
  {
    key: "productName",
    dataIndex: "productName",
    align: "center",
    title: "产品名称",
  },
  {
    key: "fistNum",
    dataIndex: "fistNum",
    align: "center",
    title: "首次查询数",
    sorter:(a:any, b:any) => a.fistNum - b.fistNum,
    defaultSortOrder: 'descend',
  },
  {
    key: "manyNum",
    dataIndex: "manyNum",
    align: "center",
    title: "多次查询数",
    sorter:(a:any, b:any) => a.manyNum - b.manyNum,
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
      search: {},
    });
    const search = toRef(state, 'search');
    const opts = {
      queryApi: 'queryCheckCode',
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
    };
  },
});
</script>

<style lang="less" scoped>
.codePage {}
</style>