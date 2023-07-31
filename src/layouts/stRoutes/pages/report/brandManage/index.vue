<template>
  <div class="codePage">
    <Page :columns="columns" :dataSource="formatData(dataSource)" :loading="loading" :pagination="false"
      @exportData="exportData">
      <template #header>
        <div class="operate">
          <a-form layout="inline" :model="search">
            <a-form-item label="">
              <a-select style="width:200px" v-model:value="search.brandId" placeholder="请选择品牌" :options="brandOpts"
                :fieldNames="brandFieldNames" allowClear></a-select>
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
import { getDate } from '@/utils/function';
import { pickerFormat } from '@/utils/common';
import service from '@/service/stRoutes';
const columns = [
  {
    key: "typeName",
    dataIndex: "typeName",
    align: "center",
    title: "统计数据",
  },
];
const brandFieldNames = {
  label: 'brandName',
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
        brandId: null,
      },
      brandOpts: [],
      brandFieldNames,
    });
    const search = toRef(state, 'search');
    const opts = {
      queryApi: 'queryCode',
      search,
      exportApi: '',
    };
    const { dataSource, loading, handleSearch, exportData } = usePage(opts);
    onMounted(() => {
      setColumns();
      queryBrand();
    });

    /**
     * 更新表格头
     */
    const setColumns = () => {
      const date = getDate({});
      const { columns } = state;
      date.forEach((item: any, $index: number) => {
        columns.push({
          key: `data${$index + 1}`,
          dataIndex: `data${$index + 1}`,
          align: "center",
          title: `${item}年`,
        },);
      });
      state.columns = columns;
    };

    /**
     * 品牌下拉框 
     */
    const queryBrand = () => {
      const params = {
        pageNum: 1,
        pageSize: 9999,
      };
      const { queryBrand } = service.report;
      queryBrand(params).then((res: any) => {
        const { code, rows } = res;
        if (code === 200) {
          state.brandOpts = rows;
        }
      }).catch((e: any) => {
        console.error(e);
      });
    }

    const dataSort={
      '品牌企业数':1,
      '已发放码量':2,
      '已使用码量':3,
      '剩余码量':4,
    };
    /**
    * 格式化数据显示
    * @param data 查询数据
    */
    const formatData = (data: any) => {
      data.forEach((item: any) => {
        const {typeName}=item;
        item.index=dataSort[typeName]||0;
      });
      data.sort((a:any,b:any)=>a.index-b.index); // 排序
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
.codePage {}
</style>