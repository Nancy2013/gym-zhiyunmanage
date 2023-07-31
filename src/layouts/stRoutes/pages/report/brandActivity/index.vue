<template>
  <div class="brandPage">
    <Page :columns="columns" :dataSource="formatData(dataSource)" :loading="loading" :pagination="pagination"
      :paginationChange="paginationChange" @exportData="exportData" :scroll="1000">
      <template #header>
        <div class="operate">
          <a-form layout="inline" :model="search">
            <a-form-item label="">
              <a-select style="width:200px" v-model:value="search.category" placeholder="请选择活动类型"
                :options="categoryOpts" allowClear></a-select>
            </a-form-item>
            <a-form-item label="">
              <a-select style="width:200px" v-model:value="search.way" placeholder="请选择活动方式"
                :options="wayOpts"></a-select>
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
import { dictTypeCode } from '@/utils/dict';
import service from '@/service/stRoutes';
const columns = [
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
    key: "registeringCount",
    dataIndex: "registeringCount",
    align: "center",
    title: "报名中数量",
  },
  {
    key: "processCount",
    dataIndex: "processCount",
    align: "center",
    title: "进行中数量",
  },
  {
    key: "endCount",
    dataIndex: "endCount",
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
        category: null,
        way: '',
      },
      categoryOpts: [] as any,
      wayOpts: [
        {
          label: '全部',
          value: ''
        },
      ],
    });

    /**
     * 查询活动类型 | 活动方式
     */
    const queryDicts = (code: string, key: string) => {
      const params = {
        dictTypeCode: code,
      };
      const { queryDicts } = service.report;
      return queryDicts(params).then((res: any) => {
        const { code, data } = res;
        if (code === 200) {
          data&&data.map((item: any) => {
            state[key].push({
              label: item.name,
              value: item.code,
            })
          })
        }
      }).catch((e: any) => {
        console.error(e);
      });
    }
    // 活动类型
    queryDicts(dictTypeCode.activityCategory, 'categoryOpts');
    // 活动方式
    queryDicts(dictTypeCode.activityWay, 'wayOpts');
    const search = toRef(state, 'search');

    const opts = {
      queryApi: 'queryBrandActivity',
      search,
      exportApi: '',
    };
    const { dataSource, loading, pagination, count, handleSearch, paginationChange, exportData } = usePage(opts);
    onMounted(() => { });

    /**
   * 格式化数据显示
   * @param data 查询数据
   */
    const formatData = (data: any) => {
      data.forEach((item: any) => {
        const { category, way } = item;
        item.category = getLabel('category', category);
        item.way = getLabel('way', way);
      });
      return data;
    };

    /**
     * 获得label
     * @param key 字段
     * @param value 值
     */
    const getLabel = (key: string, value: any) => {
      const current = state[`${key}Opts`].filter((item: any) => item.value === value)[0];
      if (current) {
        return current.label;
      }

      return value;
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
      formatData,
    };
  },
});
</script>

<style lang="less" scoped>.brandPage {}</style>