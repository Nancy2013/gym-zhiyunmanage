<template>
  <div class="certificationPage">
    <Page :columns="columns" :dataSource="dataSource" :loading="loading" :pagination="pagination"
      :paginationChange="paginationChange" @exportData="exportData">
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
            <a-form-item label="">
              <a-upload :file-list="fileList" :before-upload="beforeUpload">
                <a-button>
                  <upload-outlined></upload-outlined>
                  导入
                </a-button>
              </a-upload>
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
import { pickerFormat } from '@/utils/common';
import importToJson from '@/utils/importToJson'
const columns = [
  {
    key: "index",
    dataIndex: "index",
    align: "center",
    title: "序号",
    width: 100,
  },
  {
    key: "tenantName",
    dataIndex: "tenantName",
    align: "center",
    title: "企业名称",
    width: 200,
  },
  {
    key: "shortName",
    dataIndex: "shortName",
    align: "center",
    title: "企业简称",
    width: 200,
  },
  {
    key: "plantArea",
    dataIndex: "plantArea",
    align: "center",
    title: "种植面积(亩)",
    width: 200,
  },
  {
    key: "annualOutput",
    dataIndex: "annualOutput",
    align: "center",
    title: "年产量(kg)",
    width: 200,
  },
  {
    key: "totalAmount",
    dataIndex: "totalAmount",
    align: "center",
    title: "总金额（万元）",
    width: 200,
  },
  {
    key: "salesVolume",
    dataIndex: "salesVolume",
    align: "center",
    title: "销售额（万元）",
    width: 200,
  },
  {
    key: "distributionAmount",
    dataIndex: "distributionAmount",
    align: "center",
    title: "分销额（万元）",
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
        timePicker: null,
        // approveStatus:certificationStatus.complate, // 已认证
      },
      fileList: [] as any,
    });

    const search = toRef(state, 'search');
    const opts = {
      queryApi: 'queryCertification',
      search,
      exportApi: '',
    };
    const { dataSource, loading, pagination, count, handleSearch, paginationChange, exportData } = usePage(opts);
    onMounted(() => { });

    const beforeUpload= (file:any) => {
      console.log('------beforeUpload-----',file);
      state.fileList = [...(state.fileList||[]),file];
      importToJson(file).then((res:any)=>{
        console.log('------importToJson-----',res);
        
      });
      return false;
    };
    return {
      ...toRefs(state),
      dataSource,
      loading,
      pagination,
      count,
      handleSearch,
      paginationChange,
      exportData,
      pickerFormat,
      beforeUpload,
    };
  },
});
</script>

<style lang="less" scoped>
.certificationPage {}
</style>