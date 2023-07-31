<template>
  <div class="contentPage">
    <Page :columns="columns" :dataSource="formatData(dataSource)" :loading="loading" :pagination="pagination"
      :paginationChange="paginationChange" @exportData="exportData" >
      <template #header>
        <div class="operate">
          <a-form layout="inline" :model="search">
            <a-form-item label="">
              <a-date-picker v-model:value="search.timePicker" picker="year" :valueFormat="pickerFormat.yearFormat"
                style="width:200px" />
            </a-form-item>
            <a-form-item label="">
              <a-select style="width:200px" v-model:value="search.msgCategory" placeholder="请选择内容类型"
                :options="typeOpts" allowClear></a-select>
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
import service from '@/service/stRoutes';
import { dictTypeCode } from '@/utils/dict';
const columns = [
  {
    key: "msgCategory",
    dataIndex: "msgCategory",
    align: "center",
    title: "内容类型",
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
        msgCategory:null,
      },
      typeOpts: [] as any,
    });

    /**
     * 查询内容类型
     */
     const queryDicts=()=>{
      const params={
        dictTypeCode: dictTypeCode.contentCategory,
      };
      const {queryDicts}=service.report;
      return queryDicts(params).then((res:any)=>{
        const {code,data}=res;
        if(code===200){
          state.typeOpts=data.map((item:any)=>({
            label:item.name,
            value:item.code,
          }))
        }
      }).catch((e:any)=>{
        console.error(e);
      });
    }
    queryDicts();

    const search = toRef(state, 'search');
    const opts = {
      queryApi: 'queryContent',
      search,
      exportApi: '',
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

    /**
    * 格式化数据显示
    * @param data 查询数据
    */
    const formatData = (data: any) => {
      data.forEach((item: any) => {
        const { typeOpts, } = state;
        const { msgCategory } = item;
        const current = typeOpts.filter((item: any) => item.value === msgCategory)[0];
        if (current) {
          item.msgCategory = current.label;
        }
      });
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

<style lang="less" scoped>.contentPage {}</style>