import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import { convertTree } from "@/utils/function";
import request from "@/utils/axios";
import { Modal, message } from "ant-design-vue";
import { RenderFormItem } from '@/components/form/form'

const searchRenderList: RenderFormItem[] = [
  {
    label: '租户类型',
    key: 'tenantMealId',
    type: 'select',
    placeholder: '请选择租户类型',
    options: []
  },
  {
    label: '企业名称',
    key: 'tenantName',
    type: 'input',
    placeholder: '企业名称'
  },
  {
    label: '状态',
    key: 'status',
    type: 'select',
    placeholder: '请选择状态',
    options: [
      {
        label: "启用",
        value: "ENABLE",
      },
      {
        label: "停用",
        value: "DISABLE",
      },
    ]
  },
]
const columns = [
  {
    key: "index",
    dataIndex: "index",
    title: "序号",
    width: 80
  },
  {
    key: "account",
    dataIndex: "account",
    title: "账号",
    width: 160,
  },
  {
    key: "tenantName",
    dataIndex: "tenantName",
    title: "租户名称",
    width: 120
  },
  {
    key: "tenantMealName",
    dataIndex: "tenantMealName",
    title: "租户类型",
    width: 120
  },
  {
    key: "contact",
    dataIndex: "contact",
    title: "联系人",
    width: 110
  },
  {
    key: "phoneNumber",
    dataIndex: "phoneNumber",
    title: "联系电话",
    width: 140
  },
  {
    key: "status",
    dataIndex: "status",
    title: "状态",
    width: 100,
  },
  {
    key: "createdTime",
    dataIndex: "createdTime",
    title: "创建时间",
    width: 140
  },
  {
    key: "action",
    dataIndex: "action",
    title: "操作",
    fixed: 'right',
    width: 200,
  },
];
export default defineComponent({
  setup() {
    const formRef = ref();
    const state = reactive({
      title: "",
      loading: true,
      visible: false,
      columns,
      options: [],
      dataSource: [],
      searchRenderList,
      isSubmit: true,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
      query: {
        tenantName: "", // 企业名称
        tenantMealId: undefined, // 租户类型
        status: undefined, // 企业状态
      },
      menuTree: [], // 菜单权限
      formState: {
        id: "",
        tenantName: "",
        contact: "",
        phoneNumber: "",
        tenantMealId: undefined,
        setMealId: undefined,
      },
      rules: {
        tenantName: [
          { required: true, message: "请输入租户企业名称", trigger: "blur" },
        ],
        contact: [
          { required: true, message: "请输入企业联系人", trigger: "blur" },
        ],
        phoneNumber: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
        ],
        setMealId: [
          { required: true, message: "请选择租户类型", trigger: "change" },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
      },
    });

    onMounted(() => {
      getTenantList();
      listTenantMealChoose();
    });

    /**
     * 查询租户列表
     * @param
     * @return
     */
    const getTenantList = async () => {
      state.loading = true;
      let {
        pagination: { current, pageSize },
        query: { tenantMealId, tenantName, status },
      } = state;
      let res = await request({
        url: import.meta.env.VITE_BASE_URL + "/tenant/list",
        type: "json",
        method: "post",
        data: {
          pageNum: current,
          pageSize,
          tenantName,
          tenantMealId,
          status,
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
     * 添加租户
     * @param
     * @return
     */
    const addTenantInfo = async (data: any) => {
      let res = await request({
        url: import.meta.env.VITE_BASE_URL + "/tenant/add",
        type: "json",
        method: "post",
        data,
      });
      if (res.code == 200) {
        getTenantList();
        message.success("添加数据成功");
        state.visible = false;
      } else {
        message.error("添加数据失败");
      }
    };

    /**
     * 编辑租户
     * @param
     * @return
     */
    const editTenantInfo = async (data: any) => {
      let res = await request({
        url: import.meta.env.VITE_BASE_URL + "/tenant/update",
        type: "json",
        method: "post",
        data,
      });
      if (res.code == 200) {
        getTenantList();
        message.success("修改数据成功");
        state.visible = false;
      } else {
        message.error("修改数据失败");
      }
    };

    /**
     * 启用停用租户
     * @param
     */
    const modifyTenantStatus = (id: number, status: string) => {
      let text = status == "DISABLE" ? "停用" : "启用";
      Modal.confirm({
        title: "提示",
        content: `确定要${text}吗？`,
        centered: true,
        async onOk() {
          let res = await request({
            url: import.meta.env.VITE_BASE_URL + "/tenant/modify/status",
            type: "json",
            method: "post",
            params: {
              id,
              status,
            },
          });
          if (res.code == 200) {
            message.success(`租户${text}成功!`);
            getTenantList();
          }
        },
      });

    };

    /**
     * 租户类型下拉列表
     * @return
     */
    const listTenantMealChoose = async () => {
      let res: any = await request({
        url: import.meta.env.VITE_BASE_URL + "/tenant/meal/choose/list",
        type: "json",
        method: "get",
        params: {},
      });
      if (res.code == 200) {
        const options = res.data.map((item: any) => {
          return {
            label: item.name,
            value: item.id,
          };
        })
        state.searchRenderList[0].options = options
        state.options = options
      }
    };

    /**
     * 分页查询
     * @param { Object } pagination
     */
    const paginationChange = (pagination: any) => {
      let { current, pageSize, total } = pagination;
      state.pagination = { current, pageSize, total };
      getTenantList();
    };

    /**
     * 列表查询
     * @return
     */
    const queryList = () => {
      state.pagination.current = 1;
      getTenantList();
    };

    /**
     * 列表重置
     * @return
     */
    const reset = () => {
      state.query = {
        tenantName: "",
        tenantMealId: undefined,
        status: undefined,
      };
      getTenantList();
    };

    /**
     * 新增
     * @return
     */
    const add = () => {
      state.title = "新增";
      state.visible = true;
      state.isSubmit = true;
    };

    /**
     * 编辑
     * @return
     */
    const edit = (record: any) => {
      state.title = "编辑";
      state.visible = true;
      state.isSubmit = true;
      state.formState = {
        id: record.id,
        tenantName: record.tenantName,
        contact: record.contact,
        phoneNumber: record.phoneNumber,
        setMealId: `${record.setMealId}`,
        status: record.status,
      } as any;
    };

    /**
     * 查看
     * @return
     */
    const see = (record: any) => {
      state.title = "查看";
      state.visible = true;
      state.isSubmit = false;
      state.formState = {
        id: record.id,
        tenantName: record.tenantName,
        contact: record.contact,
        phoneNumber: record.phoneNumber,
        setMealId: `${record.setMealId}`,
        status: record.status,
      } as any;
    };

    /**
     * 清空数据
     * @return
     */
    const destroyInfo = () => {
      formRef.value.resetFields();
      state.formState = {} as any;
    };

    /**
     * 提交
     * @return
     */
    const submit = () => {
      formRef.value.validate().then((params: any) => {
        switch (state.title) {
          case "新增":
            addTenantInfo({
              tenantName: params.tenantName,
              contact: params.contact,
              phoneNumber: params.phoneNumber,
              setMealId: params.setMealId
            });
            break;
          case "编辑":
            editTenantInfo({
              id: state.formState.id,
              tenantName: params.tenantName,
              contact: params.contact,
              phoneNumber: params.phoneNumber,
              setMealId: params.setMealId
            });
            break;
        }
      });
    };

    return {
      formRef,
      ...toRefs(state),
      paginationChange,
      queryList,
      reset,
      see,
      add,
      edit,
      submit,
      destroyInfo,
      modifyTenantStatus,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
  },
});
