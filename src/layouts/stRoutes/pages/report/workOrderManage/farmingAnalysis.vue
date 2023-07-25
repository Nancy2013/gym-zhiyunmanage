<template>
  <div class="farmingPage">
    <Page :columns="columns" :dataSource="dataSource" :loading="loading" :pagination="pagination" :paginationChange="paginationChange" @exportData="exportData" >
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
import {workTypeDict} from '@/utils/dict';
import { pickerFormat } from '@/utils/common';
const columns = [
  {
    key: "workType",
    dataIndex: "workType",
    align: "center",
    title: "农事类型",
  },
  {
    key: "allCount",
    dataIndex: "allCount",
    align: "center",
    title: "工单数",
  },
  {
    key: "@index",
    dataIndex: "@index",
    align: "center",
    title: "未开始",
  },
  {
    key: "@index",
    dataIndex: "@index",
    align: "center",
    title: "进行中",
  },
  {
    key: "@index",
    dataIndex: "@index",
    align: "center",
    title: "已完成",
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

    /**
     * 格式化数据显示
     * @param data 查询数据
     */
    const formatData = (data: any) => {
      if (Array.isArray(data)) {
        data.forEach((item) => {
          const {workType}=item;
          item.workType=workTypeDict[workType]||workType;
         });
        return data;
      }
    };
    const opts = {
      queryApi: 'queryFarmingAnalysis',
      search,
      exportApi: '',
      formatData,
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
.farmingPage {}
</style>