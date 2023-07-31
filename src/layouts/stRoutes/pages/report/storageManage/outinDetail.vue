<template>
  <div class="storagePage">
    <Page :columns="columns" :dataSource="formatData(dataSource)" :loading="loading" :pagination="pagination"
       :paginationChange="paginationChange" @exportData="exportData" >
       <template #header>
        <div class="operate">
          <a-form layout="inline" :model="search">
            <a-form-item label="">
              <a-range-picker v-model:value="search.timePicker" picker="month" :valueFormat="pickerFormat.monthFormat"/>
            </a-form-item>
            <a-form-item label="">
              <a-select style="width:200px" v-model:value="search.inOutType" placeholder="请选择订单类型"
                :options="options"></a-select>
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
const columns = [
  {
    key: "orderCode",
    dataIndex: "orderCode",
    align: "center",
    title: "订单号",
  },
  {
    key: "inOutType",
    dataIndex: "inOutType",
    align: "center",
    title: "订单类型",
  },
  {
    key: "partName",
    dataIndex: "partName",
    align: "center",
    title: "物料名称",
  },
  {
    key: "partNum",
    dataIndex: "partNum",
    align: "center",
    title: "数量",
  },
  {
    key: "doneAt",
    dataIndex: "doneAt",
    align: "center",
    title: "时间",
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
        inOutType:null,
      },
      options: [
        {
          label: '出库',
          value: '1'
        },
        {
          label: '入库',
          value: '2'
        },
      ],
    });
    const search = toRef(state, 'search');
    const opts = {
      queryApi: 'storageDetail',
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
      const {options}=state
      data.forEach((item: any) => {
        const {inOutType} = item;
        const current=options.filter((item:any)=>item.value===inOutType)[0];
        if(current){
          item.inOutType=current.label;
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

<style lang="less" scoped>
.storagePage {}
</style>