<template>
  <div class="staffPage">
    <Page :columns="columns" :dataSource="dataSource" :loading="loading" :pagination="pagination" :paginationChange="paginationChange" @exportData="exportData" >
      <template #header>
        <div class="operate">
          <a-form layout="inline" :model="search">
            <a-form-item label="">
              <a-select style="width:200px" v-model:value="search.enterpriseId" placeholder="请选择茶企"
                :options="enterpriseOpts" :fieldNames="enterpriseFieldNames"></a-select>
            </a-form-item>
            <a-form-item label="">
              <a-select style="width:200px" v-model:value="search.status" placeholder="请选择状态" :options="statusOpts"></a-select>
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
    key: "roleName",
    dataIndex: "roleName",
    align: "center",
    title: "岗位",
    width:'50%',
  },
  {
    key: "memberCount",
    dataIndex: "memberCount",
    align: "center",
    title: "人数",
    width:'50%',
  },
];

const enterpriseFieldNames = {
  label: 'tenantName',
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
        enterpriseId: '',
        status:'',
      },
      statusOpts: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '入职中',
          value: 1
        },
        {
          label: '已离职',
          value: 2
        },
      ],
      enterpriseOpts: [
        {
          tenantName: '全部',
          id: ''
        },
      ],
      enterpriseFieldNames,
    });
    const search = toRef(state, 'search');
    const opts = {
      queryApi: 'queryStaff',
      search,
      exportApi: '',
    };
    const { dataSource, loading, pagination, handleSearch, paginationChange, exportData } = usePage(opts);
    onMounted(() => {
      queryCertification();
    });

    /**
     * 企业下拉框
     */
    const queryCertification = () => {
      const params = {
        pageNum: 1,
        pageSize: 9999,
      };
      const { queryCertification } = service.report;
      queryCertification(params).then((res: any) => {
        const { code, data } = res;
        if (code === 200) {
          const { enterpriseOpts } = state;
          state.enterpriseOpts = enterpriseOpts.concat(data.rows);
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
    };
  },
});
</script>

<style lang="less" scoped>
.staffPage {}
</style>