<template>
  <div class="brandPage">
    <Page :columns="columns" :dataSource="dataSource" :loading="loading" :pagination="pagination"
      :paginationChange="paginationChange" @exportData="exportData" >
      <template #header>
        <div class="operate">
          <a-form layout="inline" :model="search">
            <a-form-item label="">
              <a-select style="width:200px" v-model:value="search.way" placeholder="请选择状态" :options="options"></a-select>
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
import { activityMode } from '@/utils/dict';
const columns = [
  {
    key: "activityName",
    dataIndex: "activityName",
    align: "center",
    title: "活动名称",
  },
  {
    key: "category",
    dataIndex: "category",
    align: "center",
    title: "活动类型",
  },
  {
    key: "way",
    dataIndex: "way",
    align: "center",
    title: "活动方式",
  },
  {
    key: "@index",
    dataIndex: "@index",
    align: "center",
    title: "报名中数量",
  },
  {
    key: "@index",
    dataIndex: "@index",
    align: "center",
    title: "进行中数量",
  },
  {
    key: "@index",
    dataIndex: "@index",
    align: "center",
    title: "已终止数量",
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
        way: '',
      },
      options: [
        {
          label: '全部',
          value: ''
        },
      ] as any,
    });
    const search = toRef(state, 'search');
    /**
    * 格式化数据显示
    * @param data 查询数据
    */
    const formatData = (data: any) => {
      if (Array.isArray(data)) {
        data.forEach((item) => {
          const { way } = item;
          item.way = activityMode[way] || way;
        });
        return data;
      }
    };
    const opts = {
      queryApi: 'queryBrandActivity',
      search,
      exportApi: '',
      formatData,
    };
    const { dataSource, loading, pagination, count, handleSearch, paginationChange, exportData } = usePage(opts);
    onMounted(() => {
      setOptions();
    });

    /**
     * 活动状态
     */
    const setOptions = () => {
      const { options } = state;
      Object.keys(activityMode).forEach((key: any) => {
        options.push({
          label: activityMode[key],
          value: parseInt(key)
        },);
      })
    }

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
.brandPage {}
</style>