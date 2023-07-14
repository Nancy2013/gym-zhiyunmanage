import { defineComponent, reactive, toRefs, onMounted, ref, watch } from "vue";
import { convertTree } from "@/utils/function";
import request from "@/utils/axios";
import { Modal, message } from "ant-design-vue";

const columns = [
  {
    key: "name",
    dataIndex: "name",
    align: "center",
    title: "菜单名称",
    width: 250,
  },
  {
    key: "code",
    dataIndex: "code",
    align: "center",
    title: "菜单编号",
  },
  {
    key: "pcode",
    dataIndex: "pcode",
    align: "center",
    title: "菜单父编号",
  },
  {
    key: "url",
    dataIndex: "url",
    align: "center",
    title: "请求地址",
  },
  {
    key: "sort",
    dataIndex: "sort",
    align: "center",
    title: "排序",
  },
  {
    key: "levels",
    dataIndex: "levels",
    align: "center",
    title: "层级",
  },
  {
    key: "menuFlag",
    dataIndex: "menuFlag",
    align: "center",
    title: "是否是菜单",
  },
  {
    key: "status",
    dataIndex: "status",
    align: "center",
    title: "状态",
  },
  {
    key: "action",
    dataIndex: "action",
    align: "center",
    title: "操作",
    fixed: "right",
    width: 200,
  },
];
export default defineComponent({
  setup() {
    const formRef = ref();
    const state = reactive({
      title: "",
      columns,
      icons: [],
      dataSource: [],
      treeSelect: [],
      expandedRowKeys: [],
      loading: true,
      visible: false,
      getPcodes: {},
      pagination: {
        total: 0,
        current: 1,
        pageSize: 99999,
      },
      query: {
        name: "",
        levels: "",
      },
      formState: {
        pid: "",
        id: "",
        name: "",
        code: "",
        permissionCode: "",
        pcode: undefined,
        menuFlag: "",
        buyFlag: "",
        url: "",
        sort: "",
        icon: ""
      },
      rules: {
        name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入菜单编号", trigger: "blur" }],
        pcode: [{ required: true, message: "请输入父级编号", trigger: "blur" }],
        menuFlag: [
          { required: true, message: "请选择菜单类型", trigger: "change" },
        ],
        buyFlag: [
          { required: true, message: "请选择购买类型", trigger: "change" },
        ],
        url: [{ required: true, message: "请输入请求地址", trigger: "blur" }],
      },
    });

    onMounted(() => {
      getMenuList();
      getAllIcons();
    });

    /**
     * 属性监听
     * @return
     * 监听整个对象写法(watch(obj, ()=> {}));
     * 监听属性值写法(watch(()=>property, () => {}));
     */
    watch(state.getPcodes, (next: any, prev: any) => {
      selectMenuTreeList(next);
    });

      /**
     * 获取所有icons
     * @return
     */
    const getAllIcons = () => {
       let arr: any = [];
       const icons = import.meta.globEager('/src/assets/svg/antDesign/**/*.svg');
       Object.keys(icons).forEach(key => {
           let iconPath: any = key.replace('/src/assets/svg/antDesign/', '').split('.')[0];
           arr.push(iconPath);
       })
       state.icons = arr;
    }

    /**
     * 获取菜单列表
     * @param
     * @return
     */
    const getMenuList = async () => {
      state.loading = true;
      let {
        pagination: { current, pageSize },
        query: { name, levels },
      } = state;
      let res = await request({
        url: import.meta.env.VITE_BASE_URL + "/menu/list",
        type: "json",
        method: "post",
        data: {
          pageNum: current,
          pageSize,
          name,
          levels,
        },
      });
      if (res.code == 200) {
        state.loading = false;
        state.dataSource = convertTree(res.rows, { id: "code", pid: "pcode" });
        res.rows.forEach((element: any) => {
          state.getPcodes[element.id] = element;
        });
        state.pagination = {
          total: res.total,
          current,
          pageSize,
        };
      }
    };

    /**
     * 获取选择父级菜单列表数据
     * @return
     */
    const selectMenuTreeList = async (obj: any) => {
      let res = await request({
        url: import.meta.env.VITE_BASE_URL + "/menu/selectMenuTreeList",
        type: "json",
        method: "get",
      });
      if (res.code == 200) {
        let result = res.data as any;
        state.treeSelect = convertTree(
          result.map((item: any) => {
            return {
              key: item.id ? obj[item.id].code : 0,
              title: item.name,
              value: item.id ? obj[item.id].code : 0,
              id: item.id,
              pid: item.pid,
            };
          }),
          { id: "id", pid: "pid" }
        );
      }
    };

    /**
     * 删除菜单数据
     * @param { Number } id
     */
    const deleteMenuInfo = async (id: number) => {
      let res = await request({
        url: import.meta.env.VITE_BASE_URL + "/menu/remove",
        type: "json",
        method: "get",
        params: { id },
      });
      if (res.code == 200) {
        getMenuList();
        message.success("删除数据成功");
      } else {
        message.error("删除数据失败");
      }
    };

    /**
     * 添加菜单数据
     * @param
     */
    const addMenuInfo = async (data: any) => {
      let res = await request({
        url: import.meta.env.VITE_BASE_URL + "/menu/add",
        type: "json",
        method: "post",
        data,
      });
      if (res.code == 200) {
        getMenuList();
        message.success("添加数据成功");
        state.visible = false;
      } else {
        message.error("添加数据失败");
      }
    };

    /**
     * 编辑菜单数据
     * @param
     */
    const editMenuInfo = async (data: any) => {
      let res = await request({
        url: import.meta.env.VITE_BASE_URL + "/menu/edit",
        type: "json",
        method: "post",
        data,
      });
      if (res.code == 200) {
        getMenuList();
        message.success("修改数据成功");
        state.visible = false;
      } else {
        message.error("修改数据失败");
      }
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
          deleteMenuInfo(id);
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
      getMenuList();
    };

    /**
     * 列表查询
     */
    const queryList = () => {
      state.pagination.current = 1;
      getMenuList();
    };

    /**
     * 列表重置
     * @return
     */
    const reset = () => {
      state.query = {
        name: "",
        levels: "",
      };
      getMenuList();
    };

    /**
     * 添加
     * @return
     */
    const add = () => {
      state.title = "添加菜单";
      state.visible = true;
    };

    /**
     * 编辑
     * @return
     */
    const edit = (record: any) => {
      console.log('编辑数据', record);
      state.title = "编辑菜单";
      state.visible = true;
      state.formState = {
        id: record.id,
        pid: record.pid,
        name: record.name,
        code: record.code,
        pcode: record.pcode,
        permissionCode: record.permissionCode,
        menuFlag: record.menuFlag,
        buyFlag: record.buyFlag,
        url: record.url,
        icon: record.icon,
        sort: 0,
      } as any;
    };

    /**
     * 选择树形节点
     * @return
     */
    const selectTreeChange = (value: any, node: any) => {
      console.log("选择树形节点", value);
      console.log("选择树形节点", node);
      state.formState.pid = node.id;
    };

    /**
     * 提交
     * @return
     */
    const submit = () => {
      formRef.value.validate().then((params: any) => {
        switch (state.title) {
          case "添加菜单":
            addMenuInfo(
              Object.assign({}, params, { pid: state.formState.pid })
            );
            break;
          case "编辑菜单":
            editMenuInfo(
              Object.assign(
                {},
                { id: state.formState.id },
                { ...params, pid: state.formState.pid }
              )
            );
            break;
        }
      });
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
     * 展开所有
     * @return
     */
    const expandAll = () => {
      state.expandedRowKeys = state.dataSource.map(
        (item: any) => item.id
      ) as any;
    };

    /**
     * 折叠所有
     * @return
     */
    const closeAll = () => {
      state.expandedRowKeys = [];
    };

    /**
     * 点击展开图标时触发
     * @return
     */
    const expandChange = (expanded: any, record: any) => {
      if (expanded) {
        state.expandedRowKeys = [record.id].concat(
          state.expandedRowKeys
        ) as any;
      } else {
        state.expandedRowKeys = state.expandedRowKeys.filter(
          (item: any) => item != record.id
        );
      }
    };

    return {
      formRef,
      ...toRefs(state),
      paginationChange,
      deleteConfirm,
      queryList,
      reset,
      add,
      edit,
      submit,
      destroyInfo,
      expandAll,
      closeAll,
      expandChange,
      selectTreeChange,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
  },
});
