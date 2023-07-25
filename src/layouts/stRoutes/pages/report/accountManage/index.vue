<template>
  <div class="accountPage">
    <Page :columns="columns" :dataSource="dataSource" :loading="loading" :pagination="pagination" :paginationChange="paginationChange" @exportData="exportData" >
      <template #header>
        <div class="operate">
          <a-form layout="inline" :model="search">
            <a-form-item label="">
              <a-select style="width:200px" v-model:value="search.enterpriseId" placeholder="请选择企业"
                :options="enterpriseOpts" :fieldNames="enterpriseFieldNames"></a-select>
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
import {certificationStatus} from '@/utils/dict';
const columns = [
  {
    key: "enterpriseName",
    dataIndex: "enterpriseName",
    align: "center",
    title: "企业名称",
  },
  {
    key: "pcSuccessCount",
    dataIndex: "pcSuccessCount",
    align: "center",
    title: "PC端登录数",
    colSpan: 2,
  },
  {
    key: "pcFailedCount",
    dataIndex: "pcFailedCount",
    align: "center",
    title: "失败次数",
    colSpan: 0,
  },
  {
    key: "appSuccessCount",
    dataIndex: "appSuccessCount",
    align: "center",
    title: "小程序端登录数",
    colSpan: 2,
  },
  {
    key: "appFailedCount",
    dataIndex: "appFailedCount",
    align: "center",
    title: "失败次数",
    colSpan: 0,
  },
  {
    key: "h5SuccessCount",
    dataIndex: "h5SuccessCount",
    align: "center",
    title: "H5端登录数",
    colSpan: 2,
  },
  {
    key: "h5FailedCount",
    dataIndex: "h5FailedCount",
    align: "center",
    title: "失败次数",
    colSpan: 0,
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
        timePicker: [],
      },
      enterpriseOpts: [
        {
          tenantName: '全部',
          id: ''
        },
      ],
      enterpriseFieldNames,
    });
    const search = toRef(state, 'search');

    /**
     * 格式化数据显示
     * @param data 查询数据
     */
    const formatData = (data: any) => {
      const keys=[`pcSuccessCount`,`pcFailedCount`,`appSuccessCount`,`appFailedCount`,`h5SuccessCount`,`h5FailedCount`]; // 次数显示
      if (Array.isArray(data)) {
        data.forEach((item) => {
           keys.forEach((key:string)=>{
            const text=key.includes('Success')?'成功次数':'失败次数';
            item[key]=`${text}${item[key]}`;
           });
         });
        return data;
      }
    };
    const opts = {
      queryApi: 'queryAccount',
      search,
      exportApi: '',
      formatData,
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
        approveStatus: certificationStatus.complate, // 已认证
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
.accountPage {}
</style>