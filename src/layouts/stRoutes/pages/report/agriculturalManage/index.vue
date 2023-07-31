<template>
  <div class="agriculturalPage">
    <Page :columns="columns" :dataSource="formatData(dataSource)" :loading="loading" :pagination="pagination"
       :paginationChange="paginationChange" @exportData="exportData" :scroll="1000">
       <template #header>
      </template>
    </Page>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, toRef, onMounted } from "vue";
import Page from './../components/page/index.vue';
import { usePage } from './../composables/usePage';
import service from "@/service/stRoutes";
import { dictTypeCode } from '@/utils/dict';
const columns = [
  {
    key: "type",
    dataIndex: "type",
    align: "center",
    title: "农资类型",
  },
  {
    key: "stockCount",
    dataIndex: "stockCount",
    align: "center",
    title: "农资数量",
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
        type:null,
      },
      typeOpts: [],
    });
    /**
     * 查询农资类型
     */
     const queryDicts=()=>{
      const params={
        dictTypeCode: dictTypeCode.farmType,
      };
      const {queryDicts}=service.report;
      queryDicts(params).then((res:any)=>{
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
      queryApi: 'queryAgricultural',
      search,
      exportApi:'',
    };
    const { dataSource, loading, pagination, handleSearch, paginationChange, exportData } = usePage(opts);
    onMounted(() => {});

    /**
    * 格式化数据显示
    * @param data 查询数据
    */
    const formatData = (data: any) => {
      data.forEach((item: any) => {
        const { typeOpts } = state;
        const { type } = item;
        const current = typeOpts.filter((item: any) => item.value === type)[0] as any;
        if (current) {
          item.type = current.label;
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
      formatData,
    };
  },
});
</script>

<style lang="less" scoped>
.agriculturalPage {}
</style>