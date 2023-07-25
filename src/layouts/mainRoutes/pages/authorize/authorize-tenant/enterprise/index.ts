import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import { convertTree } from "@/utils/function";
import request from "@/utils/axios";
import { Modal, message } from "ant-design-vue";

import { RenderFormItem } from '@/components/form/form'

const searchRenderList: RenderFormItem[] = [
  {
    label: '角色名称',
    key: 'enterpriseType',
    type: 'select',
    placeholder: '选择角色名称',
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
    key: "enterpriseTypeName",
    dataIndex: "enterpriseTypeName",
    title: "企业类型",
    width: 120
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
    title: "企业名称",
    width: 120
  },
  {
    key: "contact",
    dataIndex: "contact",
    title: "联系人",
    width: 110
  },
  {
    key: "contactPhone",
    dataIndex: "contactPhone",
    title: "联系电话",
    width: 140
  },
  {
    key: "status",
    dataIndex: "status",
    title: "状态",
    width: 100
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
    align: "center",
    title: "操作",
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
      dataSource: [],
      options: [],
      searchRenderList,
      isSubmit: true,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
      query: {
        tenantName: "", // 企业名称
        enterpriseType: undefined, // 企业类型
        status: undefined, // 企业状态
      },
      menuTree: [], // 菜单权限
      formState: {
        id: "",
        tenantName: "",
        contact: "",
        contactPhone: "",
        enterpriseType: undefined,
        selectMenuList: []
      },
      rules: {
        tenantName: [
          { required: true, message: "请输入租户企业名称", trigger: "blur" },
        ],
        contact: [
          { required: true, message: "请输入企业联系人", trigger: "blur" },
        ],
        contactPhone: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
        ],
        selectMenuList: [
          { required: true, message: "请选择功能权限", trigger: "change" },
        ],
        enterpriseType: [
          { required: true, message: "请选择企业类型", trigger: "change" },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
      },
    });

    onMounted(() => {
      getEnterpriseList();
      listDictsByCode();
      getEnterpriseMenuTree();
    });

    /**
     * 查询企业列表
     * @param
     * @return
     */
    const getEnterpriseList = async () => {
      state.loading = true;
      let {
        pagination: { current, pageSize },
        query: { enterpriseType, tenantName, status },
      } = state;
      let res = await request({
        url: import.meta.env.VITE_BASE_URL + "/enterprise/list",
        type: "json",
        method: "post",
        data: {
          pageNum: current,
          pageSize,
          tenantName,
          enterpriseType,
          status
        },
      });
      if (res.code == 200) {
        state.loading = false;
        state.pagination = {
          total: res.total,
          current,
          pageSize
        }
        state.dataSource = res.rows.map((item: any, index: number) => Object.assign({}, item, { index: index + 1 }));
      } else {
        state.loading = false;
      }
    };

    /**
     * 新增企业
     * @param
     * @return
     */
    const addEnterpriseInfo = async (data: any) => {
      let res = await request({
        url: import.meta.env.VITE_BASE_URL + "/enterprise/add",
        type: "json",
        method: "post",
        data,
      });
      if (res.code == 200) {
        getEnterpriseList();
        message.success("添加数据成功");
        state.visible = false;
      } else {
        message.error("添加数据失败");
      }
    };

    /**
     * 编辑用户
     * @param
     * @return
     */
    const editEnterpriseInfo = async (data: any) => {
      let res = await request({
        url: import.meta.env.VITE_BASE_URL + "/enterprise/update",
        type: "json",
        method: "post",
        data,
      });
      if (res.code == 200) {
        getEnterpriseList();
        message.success("修改数据成功");
        state.visible = false;
      } else {
        message.error("修改数据失败");
      }
    };

    /**
     * 启用停用企业
     * @param
     */
    const modifyEnterpriseStatus = (
      enterpriseId: number,
      status: string
    ) => {
      let text = status == "DISABLE" ? "停用" : "启用";
      Modal.confirm({
        title: "提示",
        content: `确认要${text}吗？`,
        centered: true,
        async onOk() {
          let res = await request({
            url: import.meta.env.VITE_BASE_URL + "/enterprise/modify/status",
            type: "json",
            method: "post",
            params: {
              enterpriseId,
              status,
            },
          });
          if (res.code == 200) {
            message.success(`企业${text}成功!`);
            getEnterpriseList();
          }
        },
      });
      
    };

    /**
     * 获取企业类型下拉列表
     * @return
     */
    const listDictsByCode = async() => {
      let res: any = await request({
        url: import.meta.env.VITE_BASE_URL + "/dict/listDictsByCode",
        type: "json",
        method: "get",
        params: {
          dictTypeCode: 'ENTERPRISE_TYPE'
        }
      })
      if(res.code == 200) {
        let result = res.data as any;
        const options = res.data.map((item: any) => {
          return {
            label: item.name,
            value: item.code
          }
        })
        state.options = options
        state.searchRenderList[0].options = options
      }
    }

    /**
     * 企业类型详情
     * @param
     * @return
     */
    const detailEnterpriseViewInfo = async (enterpriseId: number) => {
       state.formState.selectMenuList = [];
       let res = await request({
         url: import.meta.env.VITE_BASE_URL + `/enterprise/view/${enterpriseId}`,
         type: "json",
         method: "get",
         params: { enterpriseId }
       });
       if(res.code == 200) {
          let { menuList }: any = res.data;
          state.formState.selectMenuList = menuList.filter((element: any) => element.checked).map((item: any) => item.id);
       }
    }

    /**
     * 获取企业树形菜单
     * @return
     */
    const getEnterpriseMenuTree = async () => {
        let res = await request({
          url: import.meta.env.VITE_BASE_URL + "/enterprise/menu/tree",
          type: "json",
          method: "get"
        })
        if(res.code == 200) {
          state.menuTree = convertTree(res.data, { id: 'id', pid: 'pid' })
        }
    }

    /**
     * 分页查询
     * @param { Object } pagination
     */
    const paginationChange = (pagination: any) => {
      let { current, pageSize, total } = pagination;
      state.pagination = { current, pageSize, total };
      getEnterpriseList();
    };

    /**
     * 列表查询
     * @return
     */
    const queryList = () => {
      state.pagination.current = 1;
      getEnterpriseList();
    };

    /**
     * 列表重置
     * @return
     */
    const reset = () => {
      state.query = {
        tenantName: "",
        enterpriseType: undefined,
        status: undefined
      }
      getEnterpriseList();
    };

    /**
     * 新增
     * @return
     */
    const add = () => {
      state.title = "新增";
      state.visible = true;
      state.isSubmit = true;
      state.formState.selectMenuList = [];
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
        contactPhone: record.contactPhone,
        enterpriseType: record.enterpriseType,
        selectMenuList: []
      } as any;
      detailEnterpriseViewInfo(record.id);
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
        contactPhone: record.contactPhone,
        enterpriseType: record.enterpriseType,
        selectMenuList: []
      } as any;
      detailEnterpriseViewInfo(record.id);
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
            addEnterpriseInfo({
              tenantName: params.tenantName,
              contact: params.contact,
              enterpriseType: params.enterpriseType,
              contactPhone: params.contactPhone,
              menuIdList: params.selectMenuList
            })
            break;
          case "编辑":
            editEnterpriseInfo({
               id: state.formState.id,
               tenantName: params.tenantName,
               contact: params.contact,
               enterpriseType: params.enterpriseType,
               contactPhone: params.contactPhone,
               menuIdList: params.selectMenuList
            })
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
      modifyEnterpriseStatus,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
  },
});
