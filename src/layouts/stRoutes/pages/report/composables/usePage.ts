import { ref, reactive, toRef, onMounted, toRefs } from "vue";
import { Modal, message } from "ant-design-vue";
import service from "@/service/stRoutes";
import { useAction } from "@/hooks";
import request from "@/utils/axios";
import { useRoute, } from "vue-router";
import exportToExcel from "@/utils/exportToExcel";
export const usePage = (opts: any) => {
  const route = useRoute();
  const { search, queryApi, exportApi,callback } = opts;
  const storeAction = useAction("stModule", ["asyncUpdateIsStBreamub"]);
  const state = reactive({
    loading: true,
    dataSource: [],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
    },
    count: {},
  });

  onMounted(() => {
    const { asyncUpdateIsStBreamub } = storeAction;
    asyncUpdateIsStBreamub({ isStBreamub: true });
    init();
  });

  /**
   * 初始化
   */
  const init = () => {
    query();
  };

  /**
   *查询
   *
   */
  const query = () => {
    let {
      pagination: { pageSize, current },
    } = state;
    const params = {
      pageNum: current,
      pageSize,
      ...search.value,
    };
    delete params.timePicker;
    const { timePicker,} = search.value;
    if(Array.isArray(timePicker)){
      const [beginTime, endTime] = timePicker || [];
      if (beginTime) {
        params.beginTime = beginTime;
        params.endTime = endTime;
      }
    }else{
      params.beginTime = timePicker;
    }
    
    const { report } = service;
    report[queryApi](params)
      .then((res: any) => {
        const { code, rows, total = 0, data } = res;
        if (code === 200) {
          const renderData = rows || data; // 兼容后端不同数据结构
          state.dataSource = renderData;
          state.pagination = {
            total:total||data&&data.total,
            current,
            pageSize,
          };
          callback&&callback();
        }
        state.loading = false;
      })
      .catch((e: any) => {
        console.error(e);
        state.loading = false;
      });
  };

  /**
   * 导出
   */
  const exportData = async () => {
    const header={
      'tenantName':'企业名称',
      'shortName':'企业简称',
      'plantArea':'种植面积(亩)',
      'annualOutput':'年产量(kg)'
    };
    const filename=route.meta.title;
    const opts={
      data:JSON.parse(JSON.stringify(state.dataSource)),
      filename,
      header,
    };
    exportToExcel(opts);
  };

  /**
   *初始化分页组件
   *
   */
  const initPagination = () => {
    state.pagination.current = 1;
  };

  /**
   *搜索
   *
   */
  const handleSearch = () => {
    initPagination();
    query();
  };

  /**
   *分页
   *
   * @param {*} pagination 分页组件
   */
  const paginationChange = (pagination: any) => {
    let { total, current, pageSize } = pagination;
    state.pagination = { total, current, pageSize };
    query();
  };

  return {
    ...toRefs(state),
    query,
    handleSearch,
    paginationChange,
    exportData,
  };
};
