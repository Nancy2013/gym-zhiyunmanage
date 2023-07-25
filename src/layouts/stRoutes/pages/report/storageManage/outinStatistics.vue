<template>
  <div class="storagePage">
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
              <a-select style="width:200px" v-model:value="search.materialId" placeholder="请选择物料分类"
                :options="materialOpts" :fieldNames="materialFieldNames"></a-select>
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
import { pickerFormat } from '@/utils/common';
import {getArray} from '@/utils/function';
const columns = [
  {
    key: "@index",
    dataIndex: "@index",
    align: "center",
    title: "成品",
    width:200,
  },
];
const materialFieldNames = {
  label: 'tenantName',
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
        timePicker: '',
        materialId:null,
      },
      materialOpts: [],
      materialFieldNames,
    });
    const search = toRef(state, 'search');
    const opts = {
      queryApi: 'storageStatistics',
      search,
      exportApi:'',
    };
    const { dataSource, loading, pagination, handleSearch, paginationChange, exportData } = usePage(opts);
    onMounted(() => {
      setColumns();
      queryMaterialClass();
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

     /**
     * 物料分类下拉框
     */
     const queryMaterialClass = () => {
      const params = {
        pageNum: 1,
        pageSize: 9999,
      };
      const { queryMaterialClass } = service.report;
      queryMaterialClass(params).then((res: any) => {
        const { code, data } = res;
        if (code === 200) {
          state.materialOpts = data.rows;
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
.storagePage {}
</style>