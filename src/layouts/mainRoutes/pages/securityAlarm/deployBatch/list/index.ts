import { defineComponent, reactive, toRef, toRefs } from "vue";
import { usePage } from "./../../composables/usePage";
import moment from "moment";

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
    key: "regionName",
    align: "center",
    title: "区域名称",
  },
  {
    dataIndex: "deployNo",
    key: "deployNo",
    align: "center",
    title: "调配单号",
  },
  {
    dataIndex: "deployTime",
    key: "deployTime",
    align: "center",
    title: "调配时间",
  },
  {
    dataIndex: "createUserName",
    key: "createUserName",
    align: "center",
    title: "创建人",
  },
  {
    dataIndex: "createdTime",
    key: "createdTime",
    align: "center",
    title: "创建时间",
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
      data: [] as any,
      search: {
        regionName: "",
        deployNo: "",
        deployType: 20, // 分配类型:10:单码分配 、20:批次分配
      },
      columns,
      moment,
    });

    const search = toRef(state, "search");
    const opts = {
      queryApi: "queryBatch",
      delApi: "delBatch",
      addPath: "/securityAlarm/deployBatch/add",
      search,
    };
    const {
      dataSource,
      loading,
      pagination,
      handleSearch,
      edit,
      add,
      handleDel,
      paginationChange,
      handleFresh,
    } = usePage(opts);
    /**
     *重置
     *
     */
    const reset = () => {
      state.search = {
        regionName: "",
        deployNo: "",
        deployType: 20, 
      };
    };
    return {
      ...toRefs(state),
      dataSource,
      loading,
      handleSearch,
      edit,
      add,
      handleDel,
      pagination,
      paginationChange,
      handleFresh,
      reset,
    };
  },
});
