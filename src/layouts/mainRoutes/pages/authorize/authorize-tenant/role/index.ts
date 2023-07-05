import { defineComponent, reactive, toRefs, ref, onMounted } from "vue";
import request from "@/utils/axios";
import { Modal, message } from "ant-design-vue";
import { platformTypeDict, terminalTypeDict } from "@/utils/dict";
import {
  platformTypeOptions,
  sassTerminalTypeOptions,
  xcTerminalTypeOptions,
} from "@/utils/config";
const columns = [
  {
    dataIndex: "name",
    key: "name",
    align: "center",
    title: "角色名称",
  },
  {
    key: "pname",
    title: "上级角色",
    align: "center",
    dataIndex: "pname",
  },
  {
    key: "anotherName",
    title: "别名",
    align: "center",
    dataIndex: "anotherName",
  },
  // {
  //   key: "platformType",
  //   title: "所属平台",
  //   align: "center",
  //   dataIndex: "platformType",
  // },
  // {
  //   key: "terminalType",
  //   title: "终端类型",
  //   align: "center",
  //   dataIndex: "terminalType",
  // },
  {
    key: "action",
    title: "操作",
    align: "center",
    dataIndex: "action",
  },
];

const rules = {
  name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
  pid: [{ required: true, message: "请选择上级角色名称", trigger: "blur" }],
  platformType: [
    { required: true, message: "请选择所属平台", trigger: "blur" },
  ],
  terminalType: [{ required: true, message: "请选择终端", trigger: "blur" }],
};

export default defineComponent({
  setup() {
    const formRef = ref();
    const state = reactive({
      searchData: { name: "" },
      formData: {} as any,
      visible: false,
      visibleAuth: false,
      columns,
      rules,
      ruleOptions: [] as any,
      pageSize: 20,
      pageNum: 1,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      roleTreeList: [] as any[],
      terminalTypeOptions: [] as Option[],
      selectAuthList: [] as any[],
      authTreeData: [] as any[],
      dataSource: [],
      roleId: "",
      globalMessage: null as any,
    });

    onMounted(() => {
      getRoleTreeList();
      getTableList();
    });

    /**
     * 获取角色树形数据列表
     * @param
     * @return
     */
    const getRoleTreeList = () => {
      request({
        url: import.meta.env.VITE_BASE_URL + "/role/treelist",
        type: "json",
        method: "get",
        data: {},
      }).then((res) => {
        state.roleTreeList = res.data as any;
      });
    };

    /**
     * 获取角色列表
     * @param
     * @return
     */
    const getTableList = () => {
      request({
        url: import.meta.env.VITE_BASE_URL + "/role/list",
        type: "json",
        method: "post",
        data: { ...state.searchData },
      }).then((res) => {
        state.dataSource = res.rows as any;
      });
    };

    /**
     * 点击对象分类名称时触发
     * @param
     * @return
     */
    const handleSearch = () => {
      state.pageNum = 1;
      getTableList();
    };

    /**
     * 新增/编辑弹框点击确定事件
     * @param
     * @return
     */
    const handleSubmit = () => {
      formRef.value.validate().then((params: any) => {
        const url = state.formData.id ? "/role/edit" : "/role/add";
        request({
          url: import.meta.env.VITE_BASE_URL + url,
          type: "json",
          method: "post",
          data: state.formData.id
            ? { ...params, id: state.formData.id }
            : { ...params },
        }).then((res) => {
          message.success(state.formData.id ? "编辑角色成功" : "创建角色成功");
          state.visible = false;
          handleCancel();
          getRoleTreeList();
          getTableList();
        });
      });
    };

    /**
     * 新增/编辑弹框点击取消事件
     * @param
     * @return
     */
    const handleCancel = () => {
      state.formData = {} as any;
      formRef.value.resetFields();
    };

    /**
     * 点击列表编辑按钮时触发
     * @param
     * @return
     */
    const handleEdit = (column: any) => {
      const { id, name, pid, anotherName, sort, platformType, terminalType } =
        column;
      state.formData = {
        id,
        name,
        pid,
        anotherName,
        sort,
        platformType,
        terminalType,
      };
      handleChange({ target: { value: platformType } }, "platformType", true);
      state.visible = true;
    };

    /**
     * 处理新增表单改变事件
     * @param
     * @return
     */
    const handleChange = (event: any, type: string, isEdit?: boolean) => {
      switch (type) {
        case "platformType":
          if (event.target.value === platformTypeDict.saas) {
            state.terminalTypeOptions = sassTerminalTypeOptions;
          } else if (event.target.value === platformTypeDict.xicha) {
            state.terminalTypeOptions = xcTerminalTypeOptions;
          }
          if (!isEdit) {
            state.formData.terminalType = null;
          }

          break;
      }
    };

    /**
     * 点击列表删除按钮时触发
     * @param
     * @return
     */
    const handleDelete = (column: any) => {
      Modal.confirm({
        title: "提示",
        content: "确认要删除该条数据",
        centered: true,
        onOk() {
          return new Promise((resolve, reject) => {
            request({
              url: import.meta.env.VITE_BASE_URL + "/role/remove",
              type: "json",
              method: "get",
              params: { roleId: column.id },
            })
              .then(() => {
                resolve(true);
                message.success("删除成功");
                state.visible = false;
                getTableList();
              })
              .catch(() => {
                reject();
              });
          });
        },
      });
    };

    /**
     * 处理点击权限配置
     * @param
     * @return
     */
    const handleSetAuthority = (recode: any) => {
      if (state.globalMessage) {
        state.globalMessage = message.loading("正在获取权限信息...", 0);
      }
      Promise.all([getMenuList(recode.id), getUserSelectMenu(recode.id)])
        .then(() => {
          state.visibleAuth = true;
          state.roleId = recode.id;
          if (
            state.globalMessage &&
            typeof state.globalMessage === "function"
          ) {
            state.globalMessage();
            state.globalMessage = null;
          }
        })
        .catch(() => {
          if (
            state.globalMessage &&
            typeof state.globalMessage === "function"
          ) {
            state.globalMessage();
            state.globalMessage = null;
          }
        });
    };

    /**
     * 获取菜单列表
     * @param
     * @return
     */
    const getMenuList = (roleId: any) => {
      return new Promise((resolve, reject) => {
        request({
          url: import.meta.env.VITE_BASE_URL + "/menu/treelistByRoleId",
          type: "json",
          method: "get",
          params: { roleId: roleId },
        }).then((res) => {
          if (Array.isArray(res.data) && res.data.length) {
            state.authTreeData = res.data as any;
            resolve(true);
          } else {
            state.authTreeData = [];
            message.error("菜单数据为空");
            reject();
          }
        });
      });
    };

    /**
     * 获取用户已选择的菜单
     * @param
     * @return
     */
    const getUserSelectMenu = (roleId: any) => {
      return new Promise((resolve, reject) => {
        request({
          url: import.meta.env.VITE_BASE_URL + "/menu/menulistByRoleId",
          type: "json",
          method: "get",
          params: { roleId: roleId },
        }).then((res) => {
          if (Array.isArray(res.data) && res.data.length) {
            state.selectAuthList = res.data.map((item) => {
              return item.menuId;
            });
          } else {
            state.selectAuthList = [];
          }
          resolve(true);
        });
      });
    };

    /**
     * 处理权限配置提交
     * @param
     * @return
     */
    const handleAuthSubmit = () => {
      if (state.selectAuthList.length) {
        request({
          url: import.meta.env.VITE_BASE_URL + "/role/setAuthority",
          type: "json",
          method: "post",
          data: { menuPlatformReqList: [{menuIds: state.selectAuthList}], roleId: state.roleId },
        }).then((res) => {
          message.success("菜单配置成功");
          state.visibleAuth = false;
        });
      } else {
        message.error("未选择任何菜单项");
      }
      console.log(state.selectAuthList);
    };

    /**
     * 处理权限配置返回
     * @param
     * @return
     */
    const handleAuthCancel = () => {};

    /**
     *表格刷新
     *
     */
     const handleFresh = () => {
      state.searchData = {} as any;
      state.pageNum = 1;
      getTableList();
    };

    return {
      ...toRefs(state),
      formRef,
      platformTypeDict,
      terminalTypeDict,
      platformTypeOptions,
      sassTerminalTypeOptions,
      xcTerminalTypeOptions,
      handleSetAuthority,
      handleAuthSubmit,
      handleAuthCancel,
      handleSubmit,
      getMenuList,
      getUserSelectMenu,
      handleCancel,
      handleEdit,
      handleSearch,
      handleFresh,
      handleDelete,
      handleChange,
    };
  },
});
