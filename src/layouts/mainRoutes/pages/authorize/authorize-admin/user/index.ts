import { defineComponent, reactive, toRefs, ref, onMounted } from "vue";
import request from "@/utils/axios";
import dayjs from "dayjs";
import { Modal, message, TreeProps } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";
const DEFAULT_PASS = "111111"; // 默认用户密码
import { RenderFormItem } from '@/components/tsx/form'

const renderFormList: RenderFormItem[] = [
  {
    label: '账号',
    type: 'input',
    key: 'account',
    options: [],
    placeholder: '请输入账号'
  },
  {
    label: '姓名',
    type: 'input',
    key: 'name',
    placeholder: '请输入姓名'
  },
  {
    label: '出生日期',
    type: 'datePicker',
    key: 'birthday',
    placeholder: '请选择出生日期'
  },
  {
    label: '密码',
    type: 'input',
    key: 'password',
    password: true,
    placeholder: '请输入密码'
  },
  {
    label: '重复密码',
    type: 'input',
    key: 'repeat',
    password: true,
    placeholder: '请输入重复密码'
  },
  {
    label: '邮箱',
    type: 'input',
    key: 'email',
    placeholder: '请输入邮箱'
  },
  {
    label: '性别',
    type: 'radio',
    key: 'sex',
    placeholder: '请选择性别',
    options: [
      {
        label: '男',
        value: 'man'
      },
      {
        label: '女',
        value: 'woman'
      }
    ]
  },
  {
    label: '电话',
    type: 'input',
    key: 'phone',
    inputType: 'int',
    maxlength: 11,
    placeholder: '请输入电话'
  },
]

const editHideFormKeyList = ["account", "password", "repeat"]

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
  {
    label: '状态',
    key: 'status',
    type: 'select',
    placeholder: '请选择状态',
    options: [{ label: '启用', value: 'ENABLE' }, { label: '停用', value: 'DISABLE' }]
  }
]

const columns = [
  {
    dataIndex: "account",
    key: "account",
    title: "账号",
  },
  {
    dataIndex: "name",
    key: "name",
    title: "姓名",
  },
  {
    dataIndex: "phone",
    key: "phone",
    title: "手机号",
  },
  {
    dataIndex: "status",
    key: "status",
    title: "状态",
  },
  {
    dataIndex: "createdTime",
    key: "createdTime",
    title: "创建时间",
  },
  {
    dataIndex: "action",
    key: "action",
    title: "操作",
    fixed: 'right',
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
      searchData: { name: "", time: [], status: undefined },
      searchRenderList,
      renderFormList,
      formData: {
        id: null,
        account: "",
        name: "",
        birthday: "",
        password: "",
        repeat: "",
        email: "",
        sex: "",
        phone: "",
      },
      loading: false,
      visible: false,
      visibleRole: false,
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

    /**
     *校验密码
     *
     * @param {Rule} _rule
     * @param {string} value
     * @return {*}
     */
    const validatePassword = async (_rule: Rule, value: string) => {
      if (value === "") {
        return Promise.reject("请输入密码");
      } else {
        if (state.formData.repeat) {
          formRef.value.validate(["repeat"]);
        }
        if (value.length < 6 || value.length > 12) {
          return Promise.reject("密码长度为6~12个字符");
        }
      }
      return Promise.resolve();
    };

    /**
     *校验重复密码
     *
     * @param {Rule} _rule
     * @param {string} value
     * @return {*}
     */
    const validateRepeat = async (_rule: Rule, value: string) => {
      if (value === "") {
        return Promise.reject("请输入重复密码");
      }

      if (value !== state.formData.password) {
        return Promise.reject("两次密码输入不一致");
      }

      return Promise.resolve();
    };

    // 设置弹窗表单规则
    const rules = reactive({
      account: [{ required: true, message: "请输入账号", trigger: "blur" }],
      name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
      password: [
        { required: true, trigger: "change", validator: validatePassword },
      ],
      repeat: [
        { required: true, trigger: "change", validator: validateRepeat },
      ],
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
      const { name, status } = searchData;
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
        status
      };
      state.loading = true;
      request({
        url: import.meta.env.VITE_BASE_URL + "/user/list",
        type: "json",
        method: "post",
        data: params,
      })
        .then((res) => {
          if (res) {
            state.dataSource =
              res.rows &&
              res.rows.map((item: any) => {
                const { createdTime, birthday } = item;
                return {
                  ...item,
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
      for (let i = 0; i < state.renderFormList.length; i++) {
        const renderFormItem = state.renderFormList[i]
        if (editHideFormKeyList.indexOf(renderFormItem.key) > -1) {
          renderFormItem.isHide = false
        }
      }
      state.currrentData = { id: null };
      state.visible = true;
    };

    /**
     *编辑弹窗
     *
     * @param {*} column
     */
    const handleEdit = (column: any) => {
      state.currrentData = column;
      const { id, name, birthday = "", email, sex, phone } = column;
      state.formData.id = id;
      state.formData.name = name;
      state.formData.birthday = birthday;
      state.formData.email = email;
      state.formData.sex = sex;
      state.formData.phone = phone;
      for (let i = 0; i < state.renderFormList.length; i++) {
        const renderFormItem = state.renderFormList[i]
        if (editHideFormKeyList.indexOf(renderFormItem.key) > -1) {
          renderFormItem.isHide = true
        }
      }
      state.visible = true;
    };

    /**
     *更新用户状态
     *
     */
    const handleUpdate = (column: any) => {
      const status = column.status === "ENABLE" ? "DISABLE" : "ENABLE"; // 正常：ENABLE   冻结：DELETED
      const statusText = column.status === "ENABLE" ? "停用" : "启用";
      Modal.confirm({
        title: "提示",
        content: `确定要${statusText}吗？`,
        centered: true,
        onOk() {
          request({
            url: import.meta.env.VITE_BASE_URL + `/user/modify/status`,
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
      const params = {
        userId,
      };
      request({
        url: import.meta.env.VITE_BASE_URL + `/user/getUseRole`,
        type: "json",
        method: "get",
        params,
      })
        .then((res) => {
          const { data } = res as any;
          if (data && data.length > 0) {
            const checked = data.map((v: any) => v.id) || [];
            state.checkedKeys = { checked } as any;
          }
        })
        .catch((e) => {
          console.error(e);
        });
    };

    /**
     *查询角色列表
     *
     */
    const getRoleList = () => {
      const params = {};
      request({
        url: import.meta.env.VITE_BASE_URL + "/role/treelist",
        type: "json",
        method: "get",
        params,
      })
        .then((res) => {
          if (res) {
            const { data } = res;
            if (data) {
              state.roleSource = formatArray(data);
              state.roleSource = data as any;
            }
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
      getRoleList();
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
        url: import.meta.env.VITE_BASE_URL + `/user/addRoles`,
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
        const { id } = state.currrentData;
        const operate = id ? "edit" : "add";
        const { birthday } = params;
        params.birthday = birthday ? dayjs(birthday).format("YYYY-MM-DD") : "";
        request({
          url: import.meta.env.VITE_BASE_URL + `/user/${operate}`,
          type: "json",
          method: "post",
          data: { ...params, id },
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
            url: import.meta.env.VITE_BASE_URL + `/user/remove`,
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
     *重置密码
     *
     * @param {*} column
     */
    const handleReset = (column: any) => {
      Modal.confirm({
        title: "提示",
        content: `是否重置密码为${DEFAULT_PASS}？`,
        centered: true,
        onOk() {
          // const params = {
          //   id: column.id,
          //   password: DEFAULT_PASS,
          // };
          request({
            url: import.meta.env.VITE_BASE_URL + `/user/reset/password/${column.id}`,
            type: "json",
            method: "post",
            // data: params,
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
      handleReset,
    };
  },
});
