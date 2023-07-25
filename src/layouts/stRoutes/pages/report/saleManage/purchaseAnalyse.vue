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
import {getArray} from '@/utils/function';
const columns = [
  {
    key: "@index",
    dataIndex: "@index",
    align: "center",
    title: "",
    width:200,
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
      queryApi: 'purchaseAnalyse',
      search,
      exportApi:'',
    };
    const { dataSource, loading, pagination, handleSearch, paginationChange, exportData } = usePage(opts);
    onMounted(() => {
      setColumns();
    });

    /**
     * 更新表格头
     */
     const setColumns = () => {
      const { columns } = state;
      const date=getArray();
      date.forEach((item: any) => {
        columns.push({
          key: `data${item}`,
          dataIndex: `data${item}`,
          align: "center",
          title: `${item}月`,
          width:200,
        },);
      });
      state.columns = columns;
    };
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