import { defineComponent, reactive, toRefs, ref, onMounted } from "vue";
import { convertTree } from "@/utils/function";
import request from "@/utils/axios";
import { Modal, message } from "ant-design-vue";
import { platformTypeDict, terminalTypeDict } from "@/utils/dict";
import {
  platformTypeOptions,
  sassTerminalTypeOptions,
  xcTerminalTypeOptions,
} from "@/utils/config";
import { RenderFormItem } from '@/components/form/form'


const searchRenderList: RenderFormItem[] = [
  {
    label: '角色名称',
    key: 'name',
    type: 'input',
    placeholder: '角色名称'
  }
]

const renderFormList: RenderFormItem[] = [
  {
    label: '角色名称',
    type: 'input',
    key: 'name',
    width: '100%',
    placeholder: '请输入角色名称'
  },
  {
    label: '上级名称',
    type: 'treeSelect',
    key: 'pid',
    width: '100%',
    fieldNames: { label: 'name', value: 'id' },
    placeholder: '请选择上级名称'
  },
  {
    label: '别名',
    type: 'input',
    width: '100%',
    key: 'anotherName',
    placeholder: '请输入别名'
  },
  {
    label: '排序',
    type: 'input',
    key: 'sort',
    width: '100%',
    inputType: 'int',
    placeholder: '请输入排序'
  }
]

const columns = [
  {
    dataIndex: "name",
    key: "name",
    title: "角色名称",
  },
  {
    key: "pname",
    title: "上级角色",
    dataIndex: "pname",
  },
  {
    key: "anotherName",
    title: "别名",
    dataIndex: "anotherName",
  },
  {
    key: "action",
    title: "操作",
    width: 200,
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
      searchRenderList,
      renderFormList,
      columns,
      rules,
      ruleOptions: [] as any,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
      loading: true,
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
      }).then((res: any) => {
        state.renderFormList[1].treeData = res.data
      });
    };

    /**
     * 获取角色列表
     * @param
     * @return
     */
    const getTableList = () => {
      state.loading = true
      const {
        pagination: { current, pageSize },
        searchData,
      } = state;
      request({
        url: import.meta.env.VITE_BASE_URL + "/role/list",
        type: "json",
        method: "post",
        data: { current, pageSize, ...searchData },
      }).then((res) => {
        state.loading = false
        state.dataSource = res.rows as any;
        state.pagination.total = res.total
      }).catch(() => {
        state.loading = false
      })
    };

    /**
     * 点击对象分类名称时触发
     * @param
     * @return
     */
    const handleSearch = () => {
      state.pagination.current = 1;
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
          url: import.meta.env.VITE_BASE_URL + "/menu/menuTreeListByRoleId",
          type: "json",
          method: "get",
          params: { roleId: roleId },
        }).then((res) => {
          if (Array.isArray(res.data) && res.data.length) {
            state.authTreeData = convertTree(res.data, { id: 'id', pid: 'pid' });
            state.selectAuthList = res.data.filter((element: any) => element.checked).map((item) => {
              return item.id;
            });
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
      if (state.selectAuthList.length) {
        request({
          url: import.meta.env.VITE_BASE_URL + "/role/setAuthority",
          type: "json",
          method: "post",
          data: { menuPlatformReqList: [{ menuIds: state.selectAuthList }], roleId: state.roleId },
        }).then((res) => {
          message.success("菜单配置成功");
          state.visibleAuth = false;
        });
      } else {
        message.error("未选择任何菜单项");
      }
    };

    /**
     * 处理权限配置返回
     * @param
     * @return
     */
    const handleAuthCancel = () => { };

    /**
     *分页
     *
     * @param {*} pagination
     */
    const paginationChange = (pagination: any) => {
      let { current, pageSize, total } = pagination;
      state.pagination = { current, pageSize, total };
      getTableList();
    };

    /**
     *表格刷新
     *
     */
    const handleFresh = () => {
      state.searchData = {} as any;
      state.pagination.current = 1;
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
      paginationChange,
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
      handleChange,
    };
  },
});
