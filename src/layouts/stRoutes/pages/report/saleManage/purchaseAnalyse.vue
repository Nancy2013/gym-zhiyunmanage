<template>
  <div class="salePage">
    <Page :columns="columns" :dataSource="formatData(dataSource)" :loading="loading" :pagination="false"
       @exportData="exportData" >
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
    key: "title",
    dataIndex: "title",
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
        timePicker: null,
      },
    });
    const search = toRef(state, 'search');
    const opts = {
      queryApi: 'purchaseAnalyse',
      search,
      exportApi:'',
    };
    const { dataSource, loading, handleSearch,exportData } = usePage(opts);
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
          key: `amount${item}`,
          dataIndex: `amount${item}`,
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
      data.forEach((item: any,$index:number) => {
        if($index===0){
          item.title='金额(万元)'
        }
      });
      return data;
    };
    return {
      ...toRefs(state),
      dataSource,
      loading,
      handleSearch,
      exportData,
      pickerFormat,
      formatData,
    };
  },
});
</script>

<style lang="less" scoped>
.salePage {}
</style>