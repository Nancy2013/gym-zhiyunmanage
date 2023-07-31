<template>
  <div class="staffPage">
    <Page :columns="columns" :dataSource="dataSource" :loading="loading" :pagination="pagination" :paginationChange="paginationChange" @exportData="exportData" :scroll="1000">
      <template #header>
        <div class="operate">
          <a-form layout="inline" :model="search">
            <a-form-item label="">
              <a-select style="width:200px" v-model:value="search.onJobFlag" placeholder="请选择状态" :options="statusOpts"></a-select>
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
const columns = [
  {
    key: "roleName",
    dataIndex: "roleName",
    align: "center",
    title: "岗位",
  },
  {
    key: "memberCount",
    dataIndex: "memberCount",
    align: "center",
    title: "人数",
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
        onJobFlag:'',
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
    });
    const search = toRef(state, 'search');
    const opts = {
      queryApi: 'queryStaff',
      search,
      exportApi: '',
    };
    const { dataSource, loading, pagination, handleSearch, paginationChange, exportData } = usePage(opts);
    onMounted(() => {});

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