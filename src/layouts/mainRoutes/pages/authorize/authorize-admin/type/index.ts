import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import { convertTree } from "@/utils/function";
import request from "@/utils/axios";
import { Modal, message } from "ant-design-vue";
import { Moment } from "moment";

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
    title: "类型名称",
  },
  {
    key: "creatorName",
    dataIndex: "creatorName",
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
    key: "tenantCount",
    dataIndex: "tenantCount",
    align: "center",
    title: "使用租户数量",
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
      columns,
      dataSource: [],
      options: [],
      loading: true,
      isSubmit: true,
      visible: false,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
      query: {
        name: undefined, // 类型名称
        creatorName: "", // 创建人
        rangeTime: ref<Moment[]>([]),
        beginTime: ref<Moment>(), // 开始时间
        endTime: ref<Moment>() // 结束时间
      },
      menuTree: [], // 菜单权限
      formState: {
        id: "",
        name: "", // 租户类型名称
        selectMenulist: [],
      },
      rules: {
        name: [{ required: true, message: "请输入类型名称", trigger: "blur" }],
        selectMenulist: [
          { required: true, message: "请选择功能权限", trigger: "change" },
        ],
      },
    });

    onMounted(() => {
      getTenantMealList();
      getTenantMealMenu(-1);
      listTenantMealChoose();
    });

    /**
     * 查询租户类型列表
     * @param
     * @return
     */
    const getTenantMealList = async () => {
      state.loading = true;
      let {
        pagination: { current, pageSize },
        query: { name, creatorName, beginTime, endTime },
      } = state;
      let res = await request({
        url: import.meta.env.VITE_BASE_URL + "/tenant/meal/list",
        type: "json",
        method: "post",
        data: {
          pageNum: current,
          pageSize,
          name,
          creatorName,
          beginTime, 
          endTime
        },
      });
      if (res.code == 200) {
        state.loading = false;
        state.pagination = {
          total: res.total,
          current,
          pageSize
      }
        state.dataSource = res.rows.map((item: any, index: number) =>
          Object.assign({}, item, { index: index + 1 })
        );
      }
    };

    /**
     * 添加租户类型数据
     * @param
     * @return
     */
    const addTenantMealInfo = async (data: any) => {
      let res = await request({
        url: import.meta.env.VITE_BASE_URL + "/tenant/meal/save",
        type: "json",
        method: "post",
        data,
      });
      if (res.code == 200) {
        getTenantMealList();
        message.success("添加数据成功");
        state.visible = false;
      } else {
        message.error("添加数据失败");
      }
    };

    /**
     * 编辑租户类型
     * @param
     * @return
     */
    const editTenantMealInfo = async (data: any) => {
      let res = await request({
        url: import.meta.env.VITE_BASE_URL + "/tenant/meal/edit",
        type: "json",
        method: "post",
        data,
      });
      if (res.code == 200) {
        getTenantMealList();
        message.success("修改数据成功");
        state.visible = false;
      } else {
        message.error("修改数据失败");
      }
    };

    /**
     * 删除租户类型
     * @param { Number } tenantMealId
     */
    const removeTeantMealInfo = async (tenantMealId: number) => {
      let res = await request({
        url: import.meta.env.VITE_BASE_URL + "/tenant/meal/remove",
        type: "json",
        method: "get",
        params: { tenantMealId },
      });
      if (res.code == 200) {
        getTenantMealList();
        message.success("删除数据成功");
        state.visible = false;
      } else {
        message.error("删除数据失败");
      }
    };

    /**
     * 租户类型详情
     * @param
     * @return
     */
    const detailTenantMealInfo = async (tenantMealId: number) => {
      state.formState.selectMenulist = [];
      let res = await request({
        url: import.meta.env.VITE_BASE_URL + "/tenant/meal/detail",
        type: "json",
        method: "get",
        params: { tenantMealId },
      });
      if (res.code == 200) {
        let { menuList }: any = res.data;
        state.formState.selectMenulist = menuList
          .filter((element: any) => element.checked)
          .map((item: any) => item.id);
      }
    };

    /**
     * 租户类型菜单
     * @param
     * @return
     */
    const getTenantMealMenu = async (tenantMealId: number) => {
      let res = await request({
        url: import.meta.env.VITE_BASE_URL + "/tenant/meal/menu",
        type: "json",
        method: "get",
        params: {
          tenantMealId,
        },
      });
      if (res.code == 200) {
        state.menuTree = convertTree(res.data, { id: "id", pid: "pid" });
      }
    };

    /**
     * 租户类型下拉列表
     * @return
     */
    const listTenantMealChoose = async () => {
       let res = await request({
         url: import.meta.env.VITE_BASE_URL + "/tenant/meal/choose/list",
         type: "json",
         method: "get",
         params: {}
       })
       if(res.code == 200) {
          let result = res.data as any;
          state.options = result.map((item: any) => {
             return {
                label: item.name,
                value: item.name
             }
          });
       }
    }

    /**
     * 时间控件选择
     * @param
     */
    const selectTimeChange = (value: any, dateString: any[]) => {
       state.query.rangeTime = value;
       state.query.beginTime = dateString[0];
       state.query.endTime = dateString[1];
    }

    /**
     * 停用
     * @return
     */
    const statusTenantMealModify = async (id: number, status: string) => {
       let res = await request({
         url: import.meta.env.VITE_BASE_URL + "/tenant/meal/modify/status",
         type: 'json',
         method: 'post',
         params: {
           id, 
           status
         }
       })
       if(res.code == 200) {
          let text = status == 'DISABLE' ? '停用' : '启用';
          message.success(`租户类型${text}成功!`);
          getTenantMealList();
       }
    }

    /**
     * 删除
     * @param { Number } id
     * @return
     */
    const deleteConfirm = (id: number) => {
      Modal.confirm({
        title: "删除后将不可恢复，请谨慎操作",
        content: "请确定是否删除",
        onOk() {
          removeTeantMealInfo(id);
        },
      });
    };

    /**
     * 分页查询
     * @param { Object } pagination
     */
    const paginationChange = (pagination: any) => {
      let { current, pageSize, total } = pagination;
      state.pagination = { current, pageSize, total };
      getTenantMealList();
    };

    /**
     * 列表查询
     * @return
     */
    const queryList = () => {
      state.pagination.current = 1;
      getTenantMealList();
    };

    /**
     * 列表重置
     * @return
     */
    const reset = () => {
      state.query = {
        name: undefined,
        creatorName: "",
        beginTime: undefined,
        endTime: undefined,
        rangeTime: []
      };
      getTenantMealList();
    };

    /**
     * 新增
     * @return
     */
    const add = () => {
      state.title = "新增";
      state.visible = true;
      state.isSubmit = true;
      state.formState.selectMenulist = [];
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
        name: record.name,
      } as any;
      detailTenantMealInfo(record.id);
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
        name: record.name,
      } as any;
      detailTenantMealInfo(record.id);
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
            addTenantMealInfo({
              name: params.name,
              menuIdList: params.selectMenulist,
            });
            break;
          case "编辑":
            editTenantMealInfo({
              name: params.name,
              menuIdList: params.selectMenulist,
              id: state.formState.id,
            });
            break;
        }
      });
    };

    return {
      formRef,
      ...toRefs(state),
      selectTimeChange,
      paginationChange,
      deleteConfirm,
      statusTenantMealModify,
      queryList,
      reset,
      see,
      add,
      edit,
      submit,
      destroyInfo,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
  },
});
