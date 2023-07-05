import { ref, reactive, toRef, onMounted, toRefs } from "vue";
import service from '@/service/mainRoutes'
import { useRouter } from "vue-router";
import { Modal, message } from "ant-design-vue";
export const usePage = (opts: any) => {
  const { search, queryApi, addPath, delApi } = opts;
  
  const router = useRouter();
  const state = reactive({
    loading: true,
    dataSource: [],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
    },
  });

  onMounted(() => {
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
    } = state;
    const params = {
      pageNum: current,
      pageSize,
      ...search.value,
    };
    const { securityAlarmReq } = service;
    securityAlarmReq[queryApi](params)
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
   *刷新
   *
   */
  const handleFresh = () => {
    handleSearch();
  };

  /**
   *添加
   *
   */
  const add = () => {
    router.push({ path: addPath });
  };

  /**
   *详情
   *
   */
  const edit = (item: any) => {
    router.push({ path: addPath, query: { id: item.id } });
  };

  /**
   *删除
   *
   * @param {*} item
   */
  const handleDel = (item: any) => {
    Modal.confirm({
      title: "提示",
      content: "确认要删除该条数据？",
      centered: true,
      onOk() {
        const { securityAlarmReq } = service;
        const params = {
          id:item.id,
        };        
        securityAlarmReq[delApi](params)
          .then((res: any) => {
            const {code}=res;
            if(code===200){
              message.success("操作成功");
              query();
            }
          })
          .catch((e: any) => console.error(e));
      },
    });
  };

  return {
    ...toRefs(state),
    query,
    handleSearch,
    add,
    edit,
    paginationChange,
    handleFresh,
    handleDel,
  };
};
