import { defineComponent, reactive, toRefs, ref, onMounted, watch } from "vue";
import { convertTree } from "@/utils/function";
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

const platforms = [
  { label: "Sass平台", value: 1 },
  { label: "硒茶平台", value: 2 },
];

const terminals = {
  1: [{ label: "PC端", value: 1 }],
  2: [
    { label: "PC端", value: 1 },
    { label: "小程序", value: 2 },
  ],
};

export default defineComponent({
  setup() {
    const formRef = ref();
    const authorityFormRef = ref();
    const state = reactive({
      selectedMenuKeys: [0],
      searchData: { name: "" },
      formData: {} as any,
      visible: false,
      visibleAuth: false,
      columns,
      rules,
      ruleOptions: [] as any,
      platformOptions: platforms,
      terminalOptions: [] as any,
      pageSize: 20,
      pageNum: 1,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      roleTreeList: [] as any[],
      terminalTypeOptions: [] as Option[],
      allAuthorityList: [] as any[],
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
        url: import.meta.env.VITE_BASE_URL + "/enterprise/role/tree/list",
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
        url: import.meta.env.VITE_BASE_URL + "/enterprise/role/list",
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
        const url = state.formData.id
          ? "/enterprise/role/edit"
          : "/enterprise/role/add";
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
      const { id, name, pid, anotherName } = column;
      state.formData = {
        id,
        name,
        pid,
        anotherName,
      };
      state.visible = true;
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
              url: import.meta.env.VITE_BASE_URL + "/enterprise/role/remove",
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
      state.selectedMenuKeys = [0];
      if (state.globalMessage) {
        state.globalMessage = message.loading("正在获取权限信息...", 0);
      }
      Promise.all([getMenuList(recode.id)])
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
          url:
            import.meta.env.VITE_BASE_URL +
            "/enterprise/role/menuTreeListByRoleId",
          type: "json",
          method: "get",
          params: { roleId: roleId },
        }).then((res) => {
          if (Array.isArray(res.data) && res.data.length) {
            state.authTreeData = convertTree(res.data[0].treeNodes, {
              id: "id",
              pid: "pid",
            });
            state.allAuthorityList = res.data.map((item: any) => {
              let platformType = item.platformType;
              let terminalType = item.terminalType;
              let menuIds =
                item.treeNodes
                  .filter((e: any) => e.checked)
                  .map((v: any) => v.id) || [];
              return { platformType, terminalType, menuIds };
            });
            state.terminalOptions =
              terminals[state.allAuthorityList[0].platformType];
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
     * 处理权限配置提交
     * @param
     * @return
     */
    const handleAuthSubmit = () => {
      request({
        url: import.meta.env.VITE_BASE_URL + "/enterprise/role/setAuthority",
        type: "json",
        method: "post",
        data: {
          menuPlatformReqList: state.allAuthorityList.filter(
            (item: any) => item.menuIds.length != 0
          ),
          roleId: state.roleId,
        },
      }).then((res) => {
        message.success("菜单配置成功");
        state.visibleAuth = false;
      });
    };

    /**
     * 处理权限配置返回
     * @param
     * @return
     */
    const handleAuthCancel = () => {};

    /**
     * 新增权限数据项
     * @param
     * @return
     */
    const addAuthorityList = (count: number) => {
      if (state.allAuthorityList.length < count) {
        state.allAuthorityList.push({
          platformType: null,
          terminalType: null,
          menuIds: [],
        });
      } else {
        message.warning(`最多只能添加${count}条数据!`);
      }
    };

    /**
     * 删除权限数据项
     * @param
     * @return
     */
    const deleteAuthorityList = () => {
      Modal.confirm({
        title: "提示",
        content: "确认要删除该条数据",
        centered: true,
        onOk() {
          if (state.allAuthorityList.length == 1) {
            message.error("当前数据不能删除!");
          } else {
            state.allAuthorityList.splice(state.selectedMenuKeys[0], 1);
            state.selectedMenuKeys[0] = state.allAuthorityList.length - 1;
            state.allAuthorityList.map((item: any, index: number) => {
              if (index == state.selectedMenuKeys[0] && item.platformType)
                reactSelect(item.platformType);
            });
          }
        },
      });
    };

    /**
     * 多级联动数据
     */
    const reactSelect = (key: number, option?: any) => {
      state.terminalOptions = [];
      let obj = { [key]: terminals[key] },
        getTargetIndexArr: any = [];
      // 更改联动值
      option &&
        state.allAuthorityList.map((v: any, index: number) => {
          if (index == state.selectedMenuKeys[0]) v.terminalType = null;
          return v;
        });
      // 获取目标值
      state.allAuthorityList
        .filter(
          (v1: any, i: number) =>
            i != state.selectedMenuKeys[0] &&
            [v1.platformType, v1.terminalType].every((v2: any) => v2 != null)
        )
        .map((v3: any) => `${v3.platformType}${v3.terminalType}`)
        // 获取目标索引
        .forEach((v4: any) => {
          let targetIndex = obj[key]
            .map((v5: any) => v5.value)
            .findIndex((item: any) => `${key}${item}` == v4);
          targetIndex != -1 && getTargetIndexArr.push(targetIndex);
        });
      // 获取联动值
      state.terminalOptions = obj[key].filter((_: any, index: number) =>
        getTargetIndexArr.every((v: any) => v != index)
      );
    };

    // 级联选择监听
    watch(
      () => state.selectedMenuKeys,
      (next: any) => {
        state.allAuthorityList.forEach((item: any, index: number) => {
          if (index == next[0]) {
            item.platformType
              ? reactSelect(item.platformType)
              : (state.terminalOptions = []);
          }
        });
      }
    );

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
      authorityFormRef,
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
      handleCancel,
      handleEdit,
      handleSearch,
      handleFresh,
      handleDelete,
      addAuthorityList,
      deleteAuthorityList,
      reactSelect,
    };
  },
});
