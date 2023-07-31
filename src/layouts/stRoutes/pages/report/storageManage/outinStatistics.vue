<template>
  <div class="storagePage">
    <Page :columns="columns" :dataSource="formatData(dataSource)" :loading="loading" :pagination="false"
       :paginationChange="paginationChange" @exportData="exportData" >
       <template #header>
        <div class="operate">
          <a-form layout="inline" :model="search">
            <a-form-item label="">
              <a-date-picker v-model:value="search.timePicker" picker="year" :valueFormat="pickerFormat.yearFormat"
                style="width:200px" />
            </a-form-item>
            <a-form-item label="">
              <a-select style="width:200px" v-model:value="search.categoryId" placeholder="请选择物料分类"
                :options="materialOpts" allowClear></a-select>
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
const DEFAULT_TITLE='成品';
const columns = [
  {
    key: "inOutTypeText",
    dataIndex: "inOutTypeText",
    align: "center",
    title: DEFAULT_TITLE,
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
        timePicker: null,
        categoryId:null,
      },
      materialOpts: [],
      typeMap:{
        '1':'出库数',
        '2':'入库数',
      },
    });

    /**
     * 动态更新表头
     * @param value 当前物料
     */
     const setTableTitle=()=>{
      const {columns,materialOpts,search:{categoryId}}=state;
      const current=materialOpts.filter((item:any)=>item.value===categoryId)[0] as any;
      if(current){
        columns[0].title=current.label;
      }else{
        columns[0].title=DEFAULT_TITLE;
      }
    };

    const search = toRef(state, 'search');
    const opts = {
      queryApi: 'storageStatistics',
      search,
      exportApi:'',
      callback:setTableTitle,
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
     * 查询物料分类
     */
     const queryMaterialClass = () => {
      const params = {
        pageNum: 1,
        pageSize: 9999,
      };
      const { queryMaterialClass } = service.report;
      return queryMaterialClass(params).then((res: any) => {
        const { code, rows } = res;
        if (code === 200) {
          state.materialOpts = rows.map((item: any) => ({
            label: item.tenantName,
            value: item.id,
          }))
        }
      }).catch((e: any) => {
        console.error(e);
      });
    }

    /**
    * 格式化数据显示
    * @param data 查询数据
    */
    const formatData = (data: any) => {
      const {typeMap}=state;
      data.forEach((item: any) => {
        const {inOutType } = item;
        item.inOutTypeText=typeMap[inOutType]||inOutType;
      });
      data.sort((a:any,b:any)=>parseInt(b.inOutType)-parseInt(a.inOutType));
      return data;
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
      formatData,
    };
  },
});
</script>

<style lang="less" scoped>
.storagePage {}
</style>