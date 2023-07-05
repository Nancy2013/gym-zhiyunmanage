import { Moment } from "moment";
import request from "@/utils/axios";
import { useRouter } from "vue-router";
import { defineComponent, toRefs, reactive, onMounted, ref } from "vue";

const columns = [
  {
    key: "idisCode",
    dataIndex: "idisCode",
    align: "center",
    title: "工业标识",
  },
  {
    key: "checkCode",
    dataIndex: "checkCode",
    align: "center",
    title: "防伪码",
  },
  {
    key: "syncStatus",
    dataIndex: "syncStatus",
    align: "center",
    title: "同步状态",
  },
  {
    key: "boName",
    dataIndex: "boName",
    align: "center",
    title: "关联对象",
  },
  {
    key: "batchNo",
    dataIndex: "batchNo",
    align: "center",
    title: "对象批次",
  },
  {
    key: "templateName",
    dataIndex: "templateName",
    align: "center",
    title: "绑定模板",
  },
  {
    key: "createdTime",
    dataIndex: "createdTime",
    align: "center",
    title: "创建时间",
  },
  {
    key: "action",
    title: "操作",
    align: "center",
    dataIndex: "action",
    width: 200,
  },
]; // 表格数据

const statusOptions = [
  {
    value: 1,
    label: "已创建",
  },
  {
    value: 2,
    label: "已同步",
  },
  {
    value: 3,
    label: "同步失败",
  },
]; // 状态数据

export default defineComponent({
  setup() {
    const router = useRouter();
    const state = reactive({
      columns,
      dataSource: [],
      loading: true,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
      query: {
        idisCode: "",
        boName: "",
        syncStatus: undefined,
        startTime: ref<Moment>(),
        endTime: ref<Moment>(),
        rangeTime: ref<Moment[]>([]),
      },
      statusOptions,
    });

    onMounted(() => codePage());


    /**
     * 标识明细
     * @param
     * @return
     */
    const codePage = async () => {
      state.loading = true;
      let {
        pagination: { current, pageSize },
        query: { idisCode, boName, syncStatus, startTime, endTime },
      } = state;
      let res: any = await request({
        url: import.meta.env.VITE_NODE_URL + "/code/page",
        type: "json",
        method: "post",
        data: {
          pageNum: current,
          pageSize,
          idisCode,
          boName,
          syncStatus,
          startTime,
          endTime,
        },
      });
      if (res.code == 200) {
        state.loading = false;
        state.dataSource = res.rows;
        state.pagination = {
          total: res.total,
          current,
          pageSize,
        };
      } else {
        state.loading = false;
      }
    };


    /**
     * 时间区间处理
     * @param { Moment } value
     * @param { Array } dateString
     * @return
     */
    const rangeDateChange = (value: any, dateString: any) => {
      state.query.startTime = dateString[0];
      state.query.endTime = dateString[1];
      state.query.rangeTime = value;
    };


    /**
     * 分页查询
     * @param { Object } pagination
     * @return
     */
    const paginationChange = (pagination: any) => {
      let { current, pageSize, total } = pagination;
      state.pagination = { current, pageSize, total };
      codePage();
    };


    /**
     * 路由跳转
     * @param { String } idisCode
     * @return
     */
    const showInfo = (idisCode: string) => {
      router.push({
        path: "/identity/identityDetailInfo",
        query: { idisCode },
      });
    };

    /**
     * 列表查询
     * @return
     */
    const queryList = () => {
      state.pagination.current = 1 // 重置页数
      codePage();
    }

    /**
     * 列表重置
     * @return
     */
    const reset = () => {
      state.query = {
        idisCode: "",
        boName: "",
        syncStatus: undefined,
        startTime: undefined,
        endTime: undefined,
        rangeTime: [],
      };
      queryList()
    };

    return {
      ...toRefs(state),
      queryList,
      paginationChange,
      rangeDateChange,
      showInfo,
      reset,
    };
    
  },
});
