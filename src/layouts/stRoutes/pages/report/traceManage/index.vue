<template>
  <div class="codePage">
    <Page :columns="columns" :dataSource="dataSource" :loading="loading" :pagination="pagination"
      :paginationChange="paginationChange" @exportData="exportData">
      <template #header>
      </template>
    </Page>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, toRef, onMounted } from "vue";
import Page from './../components/page/index.vue';
import { usePage } from './../composables/usePage';
import { getDate } from '@/utils/function';
const columns = [
  {
    key: "idisCode",
    dataIndex: "idisCode",
    align: "center",
    title: "工业标识",
  },
  {
    key: "productName",
    dataIndex: "productName",
    align: "center",
    title: "产品名称",
  },
  {
    key: "accessAddress",
    dataIndex: "accessAddress",
    align: "center",
    title: "扫码地址",
  },
  {
    key: "accessIp",
    dataIndex: "accessIp",
    align: "center",
    title: "IP地址",
  },
  {
    key: "createTime",
    dataIndex: "createTime",
    align: "center",
    title: "扫码时间",
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
      queryApi: 'queryTrace',
      search,
      exportApi: '',
    };
    const { dataSource, loading, pagination, handleSearch, paginationChange, exportData } = usePage(opts);
    onMounted(() => { });

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