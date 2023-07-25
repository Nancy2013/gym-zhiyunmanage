<template>
  <div class="salePage">
    <Page :columns="columns" :dataSource="dataSource" :loading="loading" :pagination="pagination"
       :paginationChange="paginationChange" @exportData="exportData" >
       <template #header>
        <div class="operate">
          <a-form layout="inline" :model="search">
            <a-form-item label="">
              <a-date-picker v-model:value="search.timePicker" picker="year" :valueFormat="pickerFormat.yearFormat"
                style="width:200px" />
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
    key: "@index",
    dataIndex: "@index",
    align: "center",
    title: "分销商名称",
  },
  {
    key: "@index",
    dataIndex: "@index",
    align: "center",
    title: "采购金额(万元)",
  },
  {
    key: "@index",
    dataIndex: "@index",
    align: "center",
    title: "采购重量(kg)",
  },
  {
    key: "@index",
    dataIndex: "@index",
    align: "center",
    title: "分销金额(万元)",
  },
  {
    key: "@index",
    dataIndex: "@index",
    align: "center",
    title: "分销重量(kg)",
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
        timePicker: '',
      },
    });
    const search = toRef(state, 'search');
    const opts = {
      queryApi: 'rankAnalyse',
      search,
      exportApi:'',
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
      pickerFormat,
    };
  },
});
</script>

<style lang="less" scoped>
.salePage {}
</style>