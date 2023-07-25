import { ref, reactive, toRef, onMounted, toRefs } from "vue";
import { Modal, message } from "ant-design-vue";
import service from "@/service/stRoutes";
import { useAction } from "@/hooks";
import request from "@/utils/axios";
export const usePage = (opts: any) => {
  const { search, queryApi, exportApi, formatData } = opts;
  const storeAction = useAction("stModule", ["asyncUpdateIsStBreamub"]);
  const state = reactive({
    loading: true,
    dataSource: [],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 2,
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
    const { timePicker} = search.value;
   
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
          const renderData = rows || data&&data.rows; // 兼容后端不同数据结构
          state.dataSource = formatData ? formatData(renderData) : renderData;
          state.pagination = {
            total:total||data&&data.total,
            current,
            pageSize,
          };
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
    let res: any = await request({
      responseType: "blob",
      url: import.meta.env.VITE_NODE_URL + "/code/down/excel",
      method: "get",
      params: { recordId: 150 },
      isDownload: true,
    });
    let dis = decodeURI(res.headers[`content-disposition`]);
    const fileName=dis.split("=")[1].split('"')[1];
    download(res.data,fileName);
  };

  /**
   * 下载文件
   * @param data 数据
   * @param fileName 文件名称
   */
  const download=(data:any,fileName:string)=>{
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.style.display = "none";
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
