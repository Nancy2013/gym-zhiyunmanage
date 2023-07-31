<template>
  <div class="alarmPage">
    <Page :columns="columns" :dataSource="dataSource" :loading="loading" :pagination="pagination" :paginationChange="paginationChange" @exportData="exportData" :scroll="1000">
      <template #header>
        <div class="operate">
          <a-form layout="inline" :model="search">
            <a-form-item label="">
              <a-range-picker v-model:value="search.timePicker" picker="month" :valueFormat="pickerFormat.monthFormat"/>
            </a-form-item>
            <a-form-item label="">
              <a-cascader v-model:value="search.city" :options="cityOpts" :fieldNames="cityFieldNames" placeholder="请选择城市" style="width:200px"/>
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
import { defineComponent, reactive, toRefs, toRef, onMounted,computed } from "vue";
import Page from '../components/page/index.vue';
import { usePage } from '../composables/usePage';
import service from '@/service/stRoutes';
import { pickerFormat } from '@/utils/common';
const columns = [
  {
    key: "index",
    dataIndex: "index",
    align: "center",
    title: "序号",
  },
  {
    key: "province",
    dataIndex: "province",
    align: "center",
    title: "城市",
  },
  {
    key: "codeNum",
    dataIndex: "codeNum",
    align: "center",
    title: "窜货数",
    defaultSortOrder: 'descend',
    sorter:(a:any, b:any) => a.codeNum - b.codeNum,
  },
];

const cityFieldNames = {
  label: 'name',
  value: 'name',
  children:'cities',
};
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
        city: null,
      },
      cityOpts: [],
      cityFieldNames,
    });
    // 搜索条件
    const formatSearch=computed(()=>{
      const {search}=state;
      const {city}=search;
      if(city){
        return {
          ...search,
          city:[...city].pop(),
        }
      }
      return {...search};
    });
    const opts = {
      queryApi: 'queryAlarm',
      search:formatSearch,
      exportApi: '',
    };
    const { dataSource, loading, pagination, handleSearch, paginationChange, exportData } = usePage(opts);
    onMounted(() => {
      queryCity();
    });

    /**
     * 城市下拉框
     */
    const queryCity = () => {
      const params = {
        pageNum: 1,
        pageSize: 9999,
        approveStatus: 2, // 已认证
      };
      const { queryCity } = service.report;
      queryCity(params).then((res: any) => {
        const { code, data } = res;
        if (code === 200) {
          state.cityOpts = data;
        }
      }).catch((e: any) => {
        console.error(e);
      });
    }

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
.alarmPage {}
</style>