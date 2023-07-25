<template>
  <div class="teaGardenPage">
    <Page :columns="columns" :dataSource="dataSource" :loading="loading" :pagination="pagination"
      :paginationChange="paginationChange" @exportData="exportData">
      <template #header>
      </template>
    </Page>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, toRef, onMounted } from "vue";
import Page from './../components/page/index.vue';
import { usePage } from './../composables/usePage';
import { teaConfirmStatusDict } from '@/utils/dict';
const columns = [
  {
    key: "index",
    dataIndex: "index",
    align: "center",
    title: "序号",
    width:100,
  },
  {
    key: "enterpriseName",
    dataIndex: "enterpriseName",
    align: "center",
    title: "企业名称",
    width: 200,
  },
  {
    key: "enterpriseName",
    dataIndex: "enterpriseName",
    align: "center",
    title: "企业简称",
    width: 200,
  },
  {
    key: "teaGardenName",
    dataIndex: "teaGardenName",
    align: "center",
    title: "茶园名称",
    width: 200,
  },
  {
    key: "teaGardenArea",
    dataIndex: "teaGardenArea",
    align: "center",
    title: "茶园面积(亩)",
    width: 200,
  },
  {
    key: "teaGardenAddress",
    dataIndex: "teaGardenAddress",
    align: "center",
    title: "茶园地址",
    width: 200,
  },
  {
    key: "selenium",
    dataIndex: "selenium",
    align: "center",
    title: "含硒量(mg/kg)",
  },
  {
    key: "latitudeLongitude",
    dataIndex: "latitudeLongitude",
    align: "center",
    title: "经纬度",
  },
  {
    key: "head",
    dataIndex: "head",
    align: "center",
    title: "负责人",
    width: 200,
  },
  {
    key: "headPhone",
    dataIndex: "headPhone",
    align: "center",
    title: "联系电话"
  },
  {
    key: "applyTime",
    dataIndex: "applyTime",
    align: "center",
    title: "申请时间",
    width: 200,
  },
  {
    key: "authorizedStatus",
    dataIndex: "authorizedStatus",
    align: "center",
    title: "审核状态",
    width: 200,
  },
  {
    key: "updatedTime",
    dataIndex: "updatedTime",
    align: "center",
    title: "确权时间",
    width: 200,
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
        authorizedStatus:teaConfirmStatusDict.complate, // 已确权
      },
    });

    const search = toRef(state, 'search');
    /**
     * 格式化数据显示
     * @param data 查询数据
     */
    const formatData = (data: any) => {
      if (Array.isArray(data)) {
        data.forEach((item) => {
          const { authorizedStatus } = item;
          item.authorizedStatus = teaConfirmStatusDict[`${authorizedStatus}`] || authorizedStatus;
        });
        return data;
      }
    };
    const opts = {
      queryApi: 'queryAuthorized',
      search,
      exportApi: '',
      formatData,
    };
    const { dataSource, loading, pagination,count, handleSearch, paginationChange, exportData } = usePage(opts);
    onMounted(() => { });


    return {
      ...toRefs(state),
      dataSource,
      loading,
      pagination,
      count,
      handleSearch,
      paginationChange,
      exportData,
    };
  },
});
</script>

<style lang="less" scoped>
.teaGardenPage {}
</style>