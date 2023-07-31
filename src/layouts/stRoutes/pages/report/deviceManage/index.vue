<template>
  <div class="devicePage">
    <Page :columns="columns" :dataSource="formatData(dataSource)" :loading="loading" :pagination="pagination" :paginationChange="paginationChange" @exportData="exportData" :scroll="1000">
      <template #header>
        <div class="operate">
          <a-form layout="inline" :model="search">
            <a-form-item label="">
              <a-select style="width:200px" v-model:value="search.type" placeholder="请选择设备类型"
                :options="typeOpts"></a-select>
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
    key: "@index",
    dataIndex: "@index",
    align: "center",
    title: "设备类型",
  },
  {
    key: "@index",
    dataIndex: "@index",
    align: "center",
    title: "总数",
  },
  {
    key: "@index",
    dataIndex: "@index",
    align: "center",
    title: "在线数",
  },
  {
    key: "@index",
    dataIndex: "@index",
    align: "center",
    title: "离线数",
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
     * 查询设备类型 TODO
     */
     const queryDicts=()=>{
      const params={
        dictTypeCode: "MENU_PLATFORM_TYPE",
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
      queryApi: 'queryDevice',
      search,
      exportApi: '',
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
.devicePage {}
</style>