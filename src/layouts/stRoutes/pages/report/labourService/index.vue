<template>
  <div class="labourPage">
    <Page :columns="columns" :dataSource="dataSource" :loading="loading" :pagination="pagination" :paginationChange="paginationChange" @exportData="exportData" >
      <template #header>
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
    key: "roleName",
    dataIndex: "roleName",
    align: "center",
    title: "岗位名称",
  },
  {
    key: "needCount",
    dataIndex: "needCount",
    align: "center",
    title: "需求人数",
  },
  {
    key: "applyCount",
    dataIndex: "applyCount",
    align: "center",
    title: "应聘人数",
  },
  {
    key: "approveCount",
    dataIndex: "approveCount",
    align: "center",
    title: "通过人数",
  },
  {
    key: "approveRate",
    dataIndex: "approveRate",
    align: "center",
    title: "通过率",
  },
  {
    key: "refuseCount",
    dataIndex: "refuseCount",
    align: "center",
    title: "未通过人数",
  },
  {
    key: "refuseRate",
    dataIndex: "refuseRate",
    align: "center",
    title: "未通过率",
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
      queryApi: 'queryLabour',
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
.labourPage {}
</style>