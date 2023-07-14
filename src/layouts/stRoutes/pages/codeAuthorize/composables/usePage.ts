import { ref, reactive, toRef, onMounted, toRefs } from "vue";
import service from '@/service/stRoutes'
import { Modal, message } from "ant-design-vue";
import { useAction } from "@/hooks";
import {status} from "./../list/config";
import {sendTime} from '@/utils/function'

/**
 *审核状态
 *
 * @return {*} 
 */
const getStatusOptions=()=>{
  const options=[
    {
      label: "审核状态",
      value: null as any,
    },
  ];

  Object.keys(status).forEach(value=>{
    options.push({
      label:status[value]||value,
      value:parseInt(value),
    });
  })
  
  return options;
}
export const usePage = (opts: any) => {
  const storeAction = useAction('stModule',['asyncUpdateIsStBreamub','asyncUpdateApprovalStatus'])
  const state = reactive({
    loading: true,
    dataSource: [],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
    },
    search:{
      brandName:'',
      status:null,
      time:[],
    },
    statusOptions:getStatusOptions(),
  });

  onMounted(() => {
    const { asyncUpdateIsStBreamub } = storeAction
    asyncUpdateIsStBreamub({isStBreamub: true})
    query();
  });

  /**
   *查询
   *
   */
  const query = () => {
    state.loading = true;
    let {
      pagination: { pageSize, current },
      search:{brandName,status,time,},
    } = state;
    const [beginTime,endTime]=time||[];
    const params = {
      pageNum: current,
      pageSize,
      brandName,
      status,
      beginTime: beginTime?sendTime(beginTime,'startOf'):'',
      endTime: endTime?sendTime(endTime,'endOf'):'',
    };
    const { queryCode } = service.codeAuthorize;
    queryCode(params)
      .then((res: any) => {
        const { code, rows,total=0 } = res;
        if (code === 200) {
          state.dataSource = rows;
          state.loading = false;
          state.pagination = {
            total,
            current,
            pageSize,
          };
        }
      })
      .catch((e: any) => {
        console.error(e);
      });
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

  /**
   *重置搜索条件
   *
   */
  const reset=()=>{
    state.search={
      brandName:'',
      status:null,
      time:[],
    }
  }


  return {
    ...toRefs(state),
    status,
    query,
    handleSearch,
    paginationChange,
    reset,
  };
};
