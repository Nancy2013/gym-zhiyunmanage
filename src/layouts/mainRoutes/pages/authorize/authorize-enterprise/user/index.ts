import { defineComponent, reactive, toRefs, ref, onMounted } from "vue";
import request from "@/utils/axios";
import dayjs from "dayjs";
import { Modal, message, TreeProps } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";
const DEFAULT_PASS = "111111"; // 默认用户密码
import { RenderFormItem } from '@/components/form/form'

const searchRenderList: RenderFormItem[] = [
  {
    label: '账号/姓名/手机',
    key: 'name',
    type: 'input',
    placeholder: '账号/姓名/手机'
  },
  {
    label: '时间区间',
    key: 'time',
    type: 'datePicker',
    datePickerType: 'rangePicker'
  },
  // {
  //   label: '状态',
  //   key: 'status',
  //   type: 'select',
  //   placeholder: '请选择状态',
  //   options: [{ label: '启用', value: 'ENABLE' }, { label: '停用', value: 'DISABLE' }]
  // }
]

const renderFormList: RenderFormItem[] = [
  {
    label: '账号',
    type: 'input',
    key: 'account',
    width: "100%",
    placeholder: '请输入账号'
  },
  {
    label: '联系人',
    type: 'input',
    key: 'name',
    width: "100%",
    placeholder: '请输入联系人'
  },

  {
    label: '电话',
    type: 'input',
    key: 'phone',
    inputType: 'int',
    width: "100%",
    maxlength: 11,
    placeholder: '请输入电话'
  },
]


const columns = [
  {
    dataIndex: "index",
    key: "index",
    title: "序号",
    width: 80
  },
  {
    dataIndex: "account",
    key: "account",
    title: "账号",

  },
  {
    dataIndex: "name",
    key: "name",
    title: "员工名称",
  },
  {
    dataIndex: "phone",
    key: "phone",
    title: "联系电话",
    width: 160
  },
  {
    dataIndex: "status",
    key: "status",
    title: "状态",
    width: 120
  },
  {
    dataIndex: "createdTime",
    key: "createdTime",
    title: "创建时间",
    width: 140
  },
  {
    dataIndex: "action",
    key: "action",
    title: "操作",
    width: 280
  },
];

/**
 *校验电话
 *
 * @param {Rule} _rule
 * @param {string} value
 * @return {*}
 */
const validateMobile = async (_rule: Rule, value: string) => {
  if (value === "") {
    return Promise.reject("请输入电话");
  }

  let reg = /^1[0-9]\d{9}$/;
  if (!reg.test(value)) {
    return Promise.reject("请输入格式正确电话");
  }

  return Promise.resolve();
};

export default defineComponent({
  setup() {
    const formRef = ref();
    const fieldNames: TreeProps["fieldNames"] = {
      title: "name",
      key: "id",
    };
    const state = reactive({
      title: "",
      searchData: { name: "", time: [] },
      formData: {
        id: null,
        account: "",
        name: "",
        phone: "",
      },
      searchRenderList,
      loading: false,
      visible: false,
      visibleRole: false,
      renderFormList,
      columns,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      dataSource: [],
      roleSource: [],
      currrentData: { id: null },
      expandedKeys: [],
      selectedKeys: [],
      checkedKeys: { checked: [] } as any,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
    });

    // 设置弹窗表单规则
    const rules = reactive({
      account: [{ required: true, message: "请输入账号", trigger: "blur" }],
      name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
      phone: [{ required: true, validator: validateMobile, trigger: "change" }],
    });

    onMounted(() => {
      getTableList();
    });

    /**
     *查询列表
     *
     */
    const getTableList = () => {
      const {
        pagination: { current, pageSize },
        searchData,
      } = state;
      const { name } = searchData;
      const time = searchData.time ? searchData.time : [];
      const [beginTime, endTime] = time;
      const params = {
        pageSize,
        pageNum: current,
        name,
        beginTime: beginTime
          ? dayjs(beginTime).startOf("day").format("YYYY-MM-DD HH:mm:ss")
          : "",
        endTime: endTime
          ? dayjs(endTime).endOf("day").format("YYYY-MM-DD HH:mm:ss")
          : "",
      };
      state.loading = true;
      request({
        url: import.meta.env.VITE_BASE_URL + "/enterprise/user/list",
        type: "json",
        method: "post",
        data: params,
      })
        .then((res) => {
          if (res) {
            state.dataSource =
              res.rows &&
              res.rows.map((item: any, index: number) => {
                const { createdTime, birthday } = item;
                return {
                  ...item,
                  index: index + 1,
                  createdTime: dayjs(createdTime).format("YYYY-MM-DD HH:mm:ss"),
                  birthday: birthday ? dayjs(item.birthday) : "",
                };
              });
            state.pagination = {
              total: res.total,
              current,
              pageSize,
            };
            state.loading = false;
          }
        })
        .catch((e) => {
          state.loading = false;
          console.error(e);
        });
    };

    /**
     *重置分页
     *
     */
    const initPagination = () => {
      state.pagination = {
        total: 0,
        current: 1,
        pageSize: 10,
      };
    };

    /**
     *
     *查询按钮
     */
    const handleSearch = () => {
      initPagination();
      getTableList();
    };

    /**
     *点击添加
     *
     */
    const handleAdd = () => {
      state.currrentData = { id: null };
      state.title = "添加";
      state.visible = true;
    };

    /**
     *编辑弹窗
     *
     * @param {*} column
     */
    const handleEdit = (column: any) => {
      state.currrentData = column;
      const { id, name, phone, account } = column;
      state.title = "编辑";
      state.formData.id = id;
      state.formData.account = account;
      state.formData.name = name;
      state.formData.phone = phone;
      state.visible = true;
    };

    /**
     *更新用户状态
     *
     */
    const handleUpdate = (column: any) => {
      const status = column.status === "ENABLE" ? "DISABLE" : "ENABLE"; // 正常：ENABLE   冻结：DELETED
      const statusText = column.status === "ENABLE" ? "停用" : "启用"; // 正常：ENABLE   冻结：DELETED
      Modal.confirm({
        title: "提示",
        content: `确认要${statusText}吗？`,
        centered: true,
        onOk() {
          request({
            url: import.meta.env.VITE_BASE_URL + `/enterprise/user/modify/status`,
            type: "json",
            method: "post",
            params: { id: column.id, status },
          })
            .then((res: any) => {
              message.success("操作成功");
              getTableList();
            })
            .catch((e) => {
              console.error(e);
            });
        },
      });
    };

    /**
     *获取用户配置的角色
     *
     */
    const getUseRole = (userId: any) => {
      request({
        url:
          import.meta.env.VITE_BASE_URL +
          `/enterprise/role/roleTreeList/${userId}`,
        type: "json",
        method: "get",
      })
        .then((res) => {
          const { data } = res as any;
          if (data && data.length > 0) {
            state.roleSource = formatArray(data);
            state.roleSource = data as any;
            const checked =
              data.filter((e: any) => e.checked).map((v: any) => v.id) || [];
            state.checkedKeys = { checked } as any;
          }
        })
        .catch((e) => {
          console.error(e);
        });
    };

    const formatArray = (arr: any) => {
      if (arr) {
        arr.forEach((v: any) => {
          v.title = v.name;
          v.key = v.id;
          const { children } = v;
          if (children && children.length > 0) {
            formatArray(children);
          }
        });
        return arr;
      }
    };

    /**
     *分配角色弹窗
     *
     * @param {*} column
     */
    const bindRole = (column: any) => {
      getUseRole(column.id);
      state.currrentData = column;
      state.visibleRole = true;
    };
    /**
     *取消角色分配
     *
     */
    const handleCancelRole = () => {
      state.visibleRole = false;
      state.expandedKeys = [];
      state.checkedKeys = { checked: [] };
      state.selectedKeys = [];
    };

    /**
     *提交角色分配
     *
     */
    const handleSubmitRole = () => {
      const { id } = state.currrentData;
      const { checked } = state.checkedKeys as any;
      if (checked.length === 0) {
        message.warning("需要至少选择一种角色");
        return;
      }
      const params = {
        userId: id,
        roleIdList: checked,
      };
      request({
        url: import.meta.env.VITE_BASE_URL + `/enterprise/user/addRoles`,
        type: "json",
        method: "post",
        data: params,
      })
        .then((res: any) => {
          message.success("操作成功");
          handleCancelRole();
        })
        .catch((e) => {
          console.error(e);
        });
    };

    /**
     *取消新增|编辑弹窗
     *
     */
    const handleCancel = () => {
      state.visible = false;
      state.formData = {} as any;
      formRef.value.resetFields();
    };

    /**
     * 新增|编辑弹框点击确定事件
     * @param
     * @return
     */
    const handleSubmit = () => {
      formRef.value.validate().then((params: any) => {
        const { id, account } = state.currrentData as any;
        const operate = id ? "edit" : "add";
        console.log("account", account);
        request({
          url: import.meta.env.VITE_BASE_URL + `/enterprise/user/${operate}`,
          type: "json",
          method: "post",
          data: account ? { ...params, id, account } : { ...params, id },
        })
          .then((res) => {
            message.success("操作成功");
            handleCancel();
            getTableList();
          })
          .catch((e) => {
            console.error();
          });
      });
    };

    /**
     *删除用户
     *
     * @param {*} column
     */
    const handleDel = (column: any) => {
      Modal.confirm({
        title: "提示",
        content: "确认要删除该条数据？",
        centered: true,
        onOk() {
          const params = {
            userId: column.id,
          };
          request({
            url: import.meta.env.VITE_BASE_URL + `/enterprise/user/remove`,
            type: "json",
            method: "get",
            params,
          })
            .then((res) => {
              message.success("操作成功");
              getTableList();
            })
            .catch((e) => {
              console.error();
            });
        },
      });
    };

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
      initPagination();
      getTableList();
    };

    return {
      ...toRefs(state),
      rules,
      formRef,
      handleSearch,
      handleEdit,
      bindRole,
      handleAdd,
      handleCancel,
      handleSubmit,
      handleUpdate,
      handleDel,
      handleCancelRole,
      handleSubmitRole,
      fieldNames,
      paginationChange,
      handleFresh,
    };
  },
});
