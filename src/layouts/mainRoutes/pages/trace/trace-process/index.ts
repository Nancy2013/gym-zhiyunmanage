import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import configTree from "@/components/configTree";
import request from "@/utils/axios";
import { Modal, message } from "ant-design-vue";
import { convertLevel, convertTree, isRepeat } from "@/utils/function";
// 表格数据
const columns = [
  {
    key: "index",
    dataIndex: "index",
    align: "center",
    title: "序号",
  },
  {
    key: "name",
    dataIndex: "name",
    align: "center",
    title: "流程名称",
  },
  {
    key: "treeLevel",
    dataIndex: "treeLevel",
    align: "center",
    title: "流程层级",
  },
  {
    key: "remark",
    dataIndex: "remark",
    align: "center",
    title: "流程说明",
  },
  {
    key: "updater",
    dataIndex: "updater",
    align: "center",
    title: "更新人",
  },
  {
    key: "updatedTime",
    dataIndex: "updatedTime",
    align: "center",
    title: "更新时间",
  },
  {
    key: "creator",
    dataIndex: "creator",
    align: "center",
    title: "创建人",
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
    fixed: "right",
  },
];

const topTree = [
  {
    id: 0,
    title: "流程",
    parent: -1,
    key: "0",
  },
];

export default defineComponent({
  components: {
    configTree,
  },
  setup() {
    const formRef = ref();
    const state = reactive({
      title: "",
      columns,
      dataSource: [],
      visible: false,
      loading: true,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
      query: {
        condition: "",
      },
      levelOptions: [
        { label: 1, value: 1 },
        { label: 2, value: 2 },
        { label: 3, value: 3 },
      ],
      formState: {
        id: 0,
        name: "",
        treeLevel: undefined,
        remark: "",
        stepParams: topTree,
      },
      rules: {
        name: [{ required: true, message: "请输入流程名称", trigger: "blur" }],
        treeLevel: [
          { required: true, message: "请选择层级", trigger: "change" },
        ],
        stepParams: [
          { required: true, message: "请选择流程配置", trigger: "change" },
        ],
      },
    });

    onMounted(() => {
      getTraceProcessList();
    });

    // 打开不同弹框
    const showModal = (title: string, record?: any) => {
      state.title = title;
      state.visible = true;
      const updateProcess = () => {
        state.formState.id = record.id;
        state.formState.name = record.name;
        state.formState.treeLevel = record.treeLevel;
        state.formState.remark = record.remark;
        getTraceProcessInfo(record.id);
      };
      switch (title) {
        case "添加流程":
          break;
        case "修改流程":
          updateProcess();
          break;
        case "复制流程":
          updateProcess();
          break;
      }
    };

    /**
     * 查询流程详情
     * @param
     * @return
     */
    const getTraceProcessInfo = async (id: number) => {
      let res = await request({
        url: import.meta.env.VITE_NODE_URL + "/trace/process/info",
        type: "json",
        method: "post",
        params: { id },
      });
      if (res.code == 200) {
        let result = res.data as any;
        let getStepTrees = convertTree(
          convertLevel(result.stepTrees).map((item: any) => ({
            id: item.id,
            parentId: item.parentId,
            title: item.name,
            key: item.name,
            stepLevel: item.stepLevel,
            parent: item.stepLevel - 1,
          })),
          { id: "id", pid: "parentId" }
        );
        state.formState.stepParams = [
          Object.assign({}, topTree[0], { children: getStepTrees }),
        ];
      }
    };

    /**
     * 查询流程数据列表
     * @param
     * @return
     */
    const getTraceProcessList = async () => {
      state.loading = true;
      let {
        pagination: { current, pageSize },
        query: { condition },
      } = state;
      let res = await request({
        url: import.meta.env.VITE_NODE_URL + "/trace/process/page",
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
        state.dataSource = res.rows.map((item: any, index: number) =>
          Object.assign({}, item, { index: index + 1 })
        );
      } else {
        state.loading = false;
      }
    };

    /**
     * 删除数据
     * @param { Number }
     * @return
     */
    const deleteConfirm = (id: number) => {
      Modal.confirm({
        title: "删除后将不可恢复，请谨慎操作",
        content: "请确定是否删除?",
        onOk() {
          delTraceProcess(id);
        },
      });
    };

    /**
     * 添加流程节点
     * @param
     * @return
     */
    const addTraceProcess = async (data: any) => {
      let res = await request({
        url: import.meta.env.VITE_NODE_URL + "/trace/process/add",
        type: "json",
        method: "post",
        data,
      });
      if (res.code == 200) {
        getTraceProcessList();
        message.success("流程节点添加成功");
        state.visible = false;
      } else {
        message.error("流程节点添加失败");
      }
    };

    /**
     * 修改流程节点
     * @param
     * @return
     */
    const editTraceProcess = async (data: any) => {
      let res = await request({
        url: import.meta.env.VITE_NODE_URL + "/trace/process/update",
        type: "json",
        method: "post",
        data,
      });
      if (res.code == 200) {
        getTraceProcessList();
        message.success("流程节点修改成功");
        state.visible = false;
      } else {
        message.error("流程节点修改失败");
      }
    };

    /**
     * 删除流程节点
     * @param
     * @return
     */
    const delTraceProcess = async (id: number) => {
      let res = await request({
        url: import.meta.env.VITE_NODE_URL + `/trace/process/del`,
        type: "json",
        method: "get",
        params: {
          id,
        },
      });
      if (res.code == 200) {
        getTraceProcessList();
        message.success("流程节点删除成功");
      } else {
        message.error("流程节点删除失败");
      }
    };

    /**
     * 选择流程层级
     * @param
     * @return
     */
    const selectTreeLevel = () => {
      let levelNum = state.formState.treeLevel;
      let getFilterSteps = convertLevel(state.formState.stepParams).filter(
        (v: any) => v.parent < Number(levelNum)
      );
      let convertArr = getFilterSteps.map((item: any) => {
        const judge = (v: any) => {
          if (item.id) {
            return v.id == item.parentId;
          } else {
            return v.key == item.key.substring(0, item.key.lastIndexOf("-"));
          }
        };
        return Object.assign({}, item, {
          parentKey: getFilterSteps.find((v: any) => judge(v))?.key,
        });
      });
      state.formState.stepParams = convertTree(convertArr, {
        id: "key",
        pid: "parentKey",
      });
    };

    /**
     * 分页查询
     * @param { Object } pagination
     */
    const paginationChange = (pagination: any) => {
      let { current, pageSize, total } = pagination;
      state.pagination = { current, pageSize, total };
      getTraceProcessList();
    };

    /**
     * 列表查询
     */
    const queryList = () => {
      state.pagination.current = 1;
      getTraceProcessList();
    };

    /**
     * 列表重置
     * @return
     */
    const reset = () => {
      state.query = {
        condition: "",
      };
      queryList();
    };

    /**
     * 清空数据
     * @return
     */
    const destroyInfo = () => {
      formRef.value.resetFields();
      state.formState = {} as any;
      state.formState.stepParams = [
        Object.assign({}, topTree[0], { children: undefined }),
      ];
    };

    /**
     * 提交
     * @return
     */
    const submit = () => {
      formRef.value.validate().then((params: any) => {
        let { name, remark, stepParams, treeLevel } = params;
        let getStepList = convertLevel(stepParams);
        if (isRepeat(getStepList.map((v: any) => v.title))) {
          message.error("流程节点字段值不能重复!");
        } else {
          switch (state.title) {
            case "添加流程":
              addTraceProcess({
                name,
                treeLevel,
                remark,
                stepParams: getStepList.map((item: any) => ({
                  parentName: getStepList.find(
                    (v: any) =>
                      v.key == item.key.substring(0, item.key.lastIndexOf("-"))
                  )?.title,
                  name: item.title,
                  stepLevel: item.parent + 1,
                  orderNum: 0,
                })),
              });
              break;
            case "修改流程":
              editTraceProcess({
                id: state.formState.id,
                name,
                treeLevel,
                remark,
                stepParams: getStepList.map((item: any) => {
                  return {
                    id: item.id ? item.id : undefined,
                    parentName: getStepList.find((v: any) =>
                      item.id
                        ? v.id == item.parentId
                        : v.key ==
                          item.key.substring(0, item.key.lastIndexOf("-"))
                    )?.title,
                    name: item.title,
                    parentId: item.parentId ? item.parentId : undefined,
                    stepLevel: item.stepLevel
                      ? item.stepLevel
                      : item.parent + 1,
                    orderNum: 0,
                  };
                }),
              });
              break;
            case "复制流程":
              addTraceProcess({
                name,
                treeLevel,
                remark,
                stepParams: getStepList.map((item: any) => {
                  return {
                    parentName: getStepList.find((v: any) =>
                      item.id
                        ? v.id == item.parentId
                        : v.key ==
                          item.key.substring(0, item.key.lastIndexOf("-"))
                    )?.title,
                    name: item.title,
                    stepLevel: item.stepLevel
                      ? item.stepLevel
                      : item.parent + 1,
                    orderNum: 0,
                  };
                }),
              });
              break;
          }
        }
      });
    };

    return {
      ...toRefs(state),
      formRef,
      showModal,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      deleteConfirm,
      queryList,
      reset,
      paginationChange,
      submit,
      destroyInfo,
      selectTreeLevel,
    };
  },
});
