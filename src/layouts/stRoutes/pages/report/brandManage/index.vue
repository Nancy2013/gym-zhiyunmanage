<template>
  <div class="codePage">
    <Page :columns="columns" :dataSource="dataSource" :loading="loading" :pagination="pagination"
      :paginationChange="paginationChange" @exportData="exportData">
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
import {pickerFormat} from '@/utils/common';
import service from '@/service/stRoutes';
const columns = [
  {
    key: "brandName",
    dataIndex: "brandName",
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
        brandId:null,
      },
      brandOpts:[],
      brandFieldNames,
    });
    const search = toRef(state, 'search');
    const opts = {
      queryApi: 'queryCode',
      search,
      exportApi: '',
    };
    const { dataSource, loading, pagination, handleSearch, paginationChange, exportData } = usePage(opts);
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
          key: `month${$index + 1}`,
          dataIndex: `month${$index + 1}`,
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
        status: 1, // 已启用
      };
      const { queryBrand } = service.report;
      queryBrand(params).then((res: any) => {
        const { code, data } = res;
        if (code === 200) {
          state.brandOpts = data.rows;
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
.codePage {}
</style>