import { useAction } from "@/hooks";
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
import request from "@/utils/axios";
import { Modal, message } from "ant-design-vue";
import { RenderFormItem } from "@/components/tsx/form";

const searchRenderList: RenderFormItem[] = [
  {
    label: "查询条件",
    key: "condition",
    type: "input",
    width: "330px",
    placeholder: "产品名称/流程名称/流程说明",
  },
];

// 表格数据
const columns = [
  {
    key: "processName",
    dataIndex: "processName",
    align: "center",
    title: "流程名称",
    width: 150,
  },
  {
    key: "remark",
    dataIndex: "remark",
    align: "center",
    title: "流程说明",
    width: 150,
  },
  {
    key: "productName",
    dataIndex: "productName",
    align: "center",
    title: "产品名称",
    width: 150,
  },
  {
    key: "productCount",
    dataIndex: "productCount",
    align: "center",
    title: "产品数",
    width: 150,
  },
  {
    key: "updater",
    dataIndex: "updater",
    align: "center",
    title: "更新人",
    width: 150,
  },
  {
    key: "updatedTime",
    dataIndex: "updatedTime",
    align: "center",
    title: "更新时间",
    width: 150,
  },
  {
    key: "creator",
    dataIndex: "creator",
    align: "center",
    title: "创建人",
    width: 150,
  },
  {
    key: "createdTime",
    dataIndex: "createdTime",
    align: "center",
    title: "创建时间",
    width: 150,
  },
  {
    key: "action",
    title: "操作",
    align: "center",
    dataIndex: "action",
    fixed: "right",
    width: 200,
  },
];

export default defineComponent({
  setup() {
    const router = useRouter();
    const state = reactive({
      searchRenderList,
      columns,
      dataSource: [],
      loading: true,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
      query: {
        condition: "",
      },
    });

    onMounted(() => {
      getTraceDataList();
    });

    const showAction = (dataId?: number) => {
      router.push({
        path: "/trace/traceDataAction",
        query: dataId ? { dataId } : {},
      });
    };

    /**
     * 确认删除
     * @param { Number } id
     * @return
     */
    const deleteConfirm = (id: number) => {
      Modal.confirm({
        title: "删除后将不可恢复，请谨慎操作",
        content: "请确定是否删除",
        onOk() {
          deleteTraceData(id);
        },
      });
    };

    /**
     * 查询溯源数据列表
     * @param
     * @return
     */
    const getTraceDataList = async () => {
      state.loading = true;
      let {
        pagination: { current, pageSize },
        query: { condition },
      } = state;
      let res = await request({
        url: import.meta.env.VITE_NODE_URL + "/trace/data/page",
        type: "json",
        method: "post",
        data: {
          pageNum: current,
          pageSize,
          condition,
        },
      });
      if (res.code == 200) {
        state.loading = false;
        state.pagination = {
          total: res.total,
          current,
          pageSize,
        };
        state.dataSource = res.rows;
      }
    };

    /**
     * 删除溯源数据
     * @param { Number } id
     */
    const deleteTraceData = async (id: number) => {
      let res = await request({
        url: import.meta.env.VITE_NODE_URL + `/trace/data/del/${id}`,
        type: "json",
        method: "get",
      });
      if (res.code == 200) {
        message.success("溯源数据删除成功!");
        getTraceDataList();
      } else {
        message.error("溯源数据删除失败!");
      }
    };

    /**
     * 分页查询
     * @param { Object } pagination
     */
    const paginationChange = (pagination: any) => {
      let { current, pageSize, total } = pagination;
      state.pagination = { current, pageSize, total };
      getTraceDataList();
    };

    /**
     * 列表查询
     */
    const queryList = () => {
      state.pagination.current = 1;
      getTraceDataList();
    };

    return {
      ...toRefs(state),
      showAction,
      deleteConfirm,
      paginationChange,
      queryList,
    };
  },
});
