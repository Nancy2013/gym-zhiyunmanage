<template>
  <div class="farmingPage">
    <Page :columns="columns" :dataSource="dataSource" :loading="loading" :pagination="pagination" :paginationChange="paginationChange" @exportData="exportData" >
      <template #header>
        <div class="operate">
          <a-form layout="inline" :model="search">
            <a-form-item label="">
              <a-select style="width:200px" v-model:value="search.cityId" placeholder="请选择城市"
                :options="cityOpts" :fieldNames="cityFieldNames"></a-select>
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
import service from '@/service/stRoutes';
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
  value: 'id',
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
        cityId: '',
      },
      cityOpts: [],
      cityFieldNames,
    });
    const search = toRef(state, 'search');

    const opts = {
      queryApi: 'queryAlarm',
      search,
      exportApi: '',
    };
    const { dataSource, loading, pagination, handleSearch, paginationChange, exportData } = usePage(opts);
    onMounted(() => {
      queryCity();
    });

    /**
     * 企业下拉框
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
          state.cityOpts = data.rows;
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
    };
  },
});
</script>

<style lang="less" scoped>
.farmingPage {}
</style>