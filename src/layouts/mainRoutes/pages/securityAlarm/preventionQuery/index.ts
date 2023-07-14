import { defineComponent, reactive, toRefs, onMounted } from "vue";
import service from "@/service/mainRoutes";
import { message } from "ant-design-vue";
const columns = [
  {
    dataIndex: "index",
    key: "index",
    align: "center",
    title: "序号",
    width: 70,
  },
  {
    dataIndex: "regionName",
    key: "regionNameregionName",
    align: "center",
    title: "区域地址",
  },
  {
    dataIndex: "productName",
    key: "productName",
    align: "center",
    title: "产品名称",
  },
  {
    dataIndex: "batchNo",
    key: "batchNo",
    align: "center",
    title: "产品批次",
  },
  {
    dataIndex: "createdTime",
    key: "createdTime",
    align: "center",
    title: "窜货时间",
  },
  {
    dataIndex: "handleStatus",
    key: "handleStatus",
    align: "center",
    title: "处理状态",
  },
  {
    dataIndex: "handlePerson",
    key: "handlePerson",
    align: "center",
    title: "处理人",
  },
  {
    dataIndex: "action",
    key: "action",
    align: "center",
    title: "操作",
  },
];
export default defineComponent({
  props: {},
  components: {},
  setup() {
    const state = reactive({
      search: {
        regionName: "",
        productName: "",
        handleStatus: null,
      },
      options: [
        {
          value: 0,
          label: "未处理",
        },
        {
          value: 1,
          label: "已处理",
        },
      ],
      columns,
      dataSource: [] as any,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
      loading: true,
      visible:false,
      current:{} as any,
    });

    onMounted(() => {
      query();
    });

    /**
     *查询
     *
     */
    const query = () => {
      let {
        pagination: { pageSize, current },
        search,
      } = state;
      const params = {
        pageNum: current,
        pageSize,
        ...search,
      };
      const { queryRecord } = service.securityAlarmReq;
      queryRecord(params)
        .then((res: any) => {
          const {code,rows,total=0}=res;
          if(code===200){
            state.dataSource=rows;
            state.pagination = {
              total,
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
     *搜索
     *
     */
    const handleSearch = () => {
      initPagination();
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
     *重置
     *
     */
    const reset = () => {
      state.search = {
        regionName: "",
        productName: "",
        handleStatus: null,
      };
    };

    /**
     *处理
     *
     */
    const handle = (item: any) => {
      state.visible=true;
      state.current=item;
      state.current.handleRemark='';
    };

    /**
     *处理确认
     *
     */
    const handleOk=()=>{
      const {id,handleRemark}=state.current;
      if(!handleRemark){
        message.error("请输入处理结果！");
        return;
      }
      const params={
        id,
        handleRemark,
      }
      const { handleRecord } = service.securityAlarmReq;      
      handleRecord(params).then((res:any)=>{
        const {code}=res;
        if(code===200){
          state.visible=false;
          message.success("处理成功！");
          query();
        }
      }).catch((e:any)=>{
        console.error(e);
      })
    }

    /**
     *初始化分页组件
     *
     */
    const initPagination = () => {
      state.pagination.current = 1;
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
      reset,
      handleSearch,
      handle,
      paginationChange,
      handleFresh,
      handleOk,
    };
  },
});
