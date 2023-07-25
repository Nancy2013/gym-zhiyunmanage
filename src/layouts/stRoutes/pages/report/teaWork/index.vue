<template>
  <div class="teaWorkPage">
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
    key: "brandName",
    dataIndex: "brandName",
    align: "center",
    title: "品牌名称",
  },
  {
    key: "percentage",
    dataIndex: "percentage",
    align: "center",
    title: "出茶率（%）",
  },
  {
    key: "teaWeight",
    dataIndex: "teaWeight",
    align: "center",
    title: "茶青总重量（kg）",
  },
  {
    key: "finshWeight",
    dataIndex: "finshWeight",
    align: "center",
    title: "成茶总重量（kg）",
  },
  {
    key: "productNum",
    dataIndex: "productNum",
    align: "center",
    title: "产品数",
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
      queryApi: 'queryTeaWork',
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
.teaWorkPage {}
</style>