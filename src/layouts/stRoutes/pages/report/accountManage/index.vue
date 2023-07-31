<template>
  <div class="accountPage">
    <Page :columns="columns" :dataSource="formatData(dataSource)" :loading="loading" :pagination="pagination"
      :paginationChange="paginationChange" @exportData="exportData" :scroll="1000">
      <template #header>
        <div class="operate">
          <a-form layout="inline" :model="search">
            <a-form-item label="">
              <a-select style="width:200px" v-model:value="search.terminalType" placeholder="请选择端类型"
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
import Page from '../components/page/index.vue';
import { usePage } from '../composables/usePage';
import { terminalType } from '@/utils/dict';
const columns = [
  {
    key: "userId",
    dataIndex: "userId",
    align: "center",
    title: "用户id",
  },
  {
    key: "phoneNumber",
    dataIndex: "phoneNumber",
    align: "center",
    title: "用户手机号",
  },
  {
    key: "loginTerminalType",
    dataIndex: "loginTerminalType",
    align: "center",
    title: "端类型",
  },
  {
    key: "loginTime",
    dataIndex: "loginTime",
    align: "center",
    title: "登录时间",
  },
  {
    key: "successFail",
    dataIndex: "successFail",
    align: "center",
    title: "登录状态",
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
        terminalType: null,
      },
      typeOpts: [] as any,
      statusMap:{
        '1':'成功',
        '2':'失败',
      },
    });

    const search = toRef(state, 'search');
    const opts = {
      queryApi: 'queryAccount',
      search,
      exportApi: '',
    };
    const { dataSource, loading, pagination, handleSearch, paginationChange, exportData } = usePage(opts);

    onMounted(() => { 
      setOptions();
    });

    /**
     * 终端类型
     */
     const setOptions = () => {
      const { typeOpts } = state;
      Object.keys(terminalType).forEach((key: any) => {
        typeOpts.push({
          label: terminalType[key],
          value: parseInt(key)
        },);
      })
    }

    /**
    * 格式化数据显示
    * @param data 查询数据
    */
    const formatData = (data: any) => {
      const {statusMap}=state
      data.forEach((item: any) => {
        const {successFail,loginTerminalType } = item;
        item.loginTerminalType=terminalType[loginTerminalType]||loginTerminalType;
        item.successFail=statusMap[successFail]||successFail;
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
.accountPage {}
</style>