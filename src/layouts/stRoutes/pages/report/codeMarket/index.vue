<template>
  <div class="marketPage">
    <Page :columns="columns" :dataSource="formatData(dataSource)" :loading="loading" :pagination="pagination"
       :paginationChange="paginationChange" @exportData="exportData" :scroll="1000">
       <template #header>
        <div class="operate">
          <a-form layout="inline" :model="search">
            <a-form-item label="">
              <a-select style="width:200px" v-model:value="search.type" placeholder="请选择活动类型"
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
import Page from './../components/page/index.vue';
import { usePage } from './../composables/usePage';
import service from "@/service/stRoutes";
import { dictTypeCode } from '@/utils/dict';
const columns = [
  {
    key: "name",
    dataIndex: "name",
    align: "center",
    title: "活动名称",
  },
  {
    key: "type",
    dataIndex: "type",
    align: "center",
    title: "活动类型",
  },
  {
    key: "lookCount",
    dataIndex: "lookCount",
    align: "center",
    title: "浏览人次",
  },
  {
    key: "drawCount",
    dataIndex: "drawCount",
    align: "center",
    title: "抽奖人次",
  },
  {
    key: "winCount",
    dataIndex: "winCount",
    align: "center",
    title: "中奖人次",
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
      typeOpts: [] as any,
    });

    /**
     * 查询活动类型
     */
     const queryDicts=()=>{
      const params={
        dictTypeCode: dictTypeCode.codeActivityCategory,
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
      queryApi: 'queryCodeMarket',
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
        const current = typeOpts.filter((item: any) => item.value === type)[0];
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
.marketPage {}
</style>