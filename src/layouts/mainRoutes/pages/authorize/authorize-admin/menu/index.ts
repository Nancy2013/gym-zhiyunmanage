import { defineComponent, reactive, toRefs, onMounted, ref, watch } from "vue";
import { convertTree } from "@/utils/function";
import request from "@/utils/axios";
import { Modal, message } from "ant-design-vue";
import { RenderFormItem } from '@/components/tsx/form'


const searchRenderList: RenderFormItem[] = [
  {
    label: '菜单名称/编码',
    key: 'name',
    type: 'input',
    placeholder: '菜单名称/编码'
  },
  {
    label: '层级',
    key: 'levels',
    type: 'input',
    placeholder: '层级'
  }
]

const renderFormList: RenderFormItem[] = [
  {
    label: '终端类型',
    type: 'select',
    key: 'terminalType',
    placeholder: '请选择终端类型'
  },
  {
    label: '所属平台',
    type: 'select',
    key: 'platformType',
    placeholder: '请选择所属平台'
  },
  {
    label: '名称',
    type: 'input',
    key: 'name',
    placeholder: '请输入名称'
  },
  {
    label: '菜单编号',
    type: 'input',
    key: 'code',
    placeholder: '请输入菜单编号'
  },
  {
    label: '菜单权限码',
    type: 'input',
    key: 'permissionCode',
    placeholder: '请输入菜单权限码'
  },
  {
    label: '父级编号',
    type: 'treeSelect',
    key: 'pcode',
    treeDataSimpleMode: true,
    treeDefaultExpandAll: true,
    placeholder: '请选择父级编号'
  },
  {
    label: '是否是菜单',
    type: 'radio',
    key: 'menuFlag',
    options: [{label: '是', value: 'Y'}, {label: '否', value: 'N'}]
  },
  {
    label: '是否可购买',
    type: 'radio',
    key: 'buyFlag',
    options: [{label: '是', value: 'Y'}, {label: '否', value: 'N'}]
  },
  {
    label: '请求地址',
    type: 'input',
    key: 'url',
    placeholder: '请输入请求地址'
  },
  {
    label: '排序',
    type: 'input',
    key: 'sort',
    placeholder: '请输入排序'
  },
]

const columns = [
  {
    key: "name",
    dataIndex: "name",
    title: "菜单名称",
    width: 200,
  },
  {
    key: "code",
    dataIndex: "code",
    title: "菜单编号",
    width: 160
  },
  {
    key: "pcode",
    dataIndex: "pcode",
    title: "菜单父编号",
    width: 120
  },
  {
    key: "url",
    dataIndex: "url",
    title: "请求地址",
    width: 180
  },
  {
    key: "sort",
    dataIndex: "sort",
    title: "排序",
    width: 80
  },
  {
    key: "levels",
    dataIndex: "levels",
    title: "层级",
    width: 80
  },
  {
    key: "menuFlag",
    dataIndex: "menuFlag",
    title: "是否是菜单",
    width: 100
  },
  {
    key: "status",
    dataIndex: "status",
    title: "状态",
    width: 100
  },
  {
    key: "action",
    dataIndex: "action",
    title: "操作",
    fixed: "right",
    width: 140,
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
      searchRenderList,
      renderFormList,
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
        terminalType: undefined,
        platformType: null,
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
        terminalType: [{ required: true, message: "请选择终端类型", trigger: "change" }],
        platformType: [{ required: true, message: "请选择所属平台", trigger: "change" }],
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
      getTerminalSelects('MENU_TERMINAL_TYPE').then((options: any) => {
        state.renderFormList[0].options = options.map((item: any) => ({ label: item.name, value: Number(item.code) }))
      });

      getTerminalSelects('MENU_PLATFORM_TYPE').then((options: any) => {
        state.renderFormList[1].options = options.map((item: any) => ({ label: item.name, value: item.code })) 
      });
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
     * 获取终端类型列表
     * @param
     * @return
     */
    const getTerminalSelects = (code: string) => {
      return new Promise((resolve, reject) => {
        request({
          url: import.meta.env.VITE_BASE_URL + "/dict/listDictsByCode",
          type: "json",
          method: "get",
          params: {
            dictTypeCode: code   //'MENU_TERMINAL_TYPE'
          }
        }).then((res) => {
          resolve(res.data)
        })
      })

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
        state.renderFormList[5].treeData = convertTree(
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
      state.title = "编辑菜单";
      state.visible = true;
      state.formState = {
        id: record.id,
        pid: record.pid,
        name: record.name,
        code: record.code,
        pcode: record.pcode == '0' ? 0 : record.pcode,
        permissionCode: record.permissionCode,
        menuFlag: record.menuFlag,
        buyFlag: record.buyFlag,
        url: record.url,
        icon: record.icon,
        sort: 0,
        terminalType: record.terminalType
      } as any;
    };

    /**
     * 表单数据改变时触发
     * @return
     */
    const haddleUnifyEvent = (event: any, formItem: any) => {
      if (formItem.key === 'pcode') {
        state.formState.pid = event.value.node.id
      }
    }

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
      haddleUnifyEvent,
      deleteConfirm,
      queryList,
      reset,
      add,
      edit,
      submit,
      destroyInfo,
      expandAll,
      closeAll,
      expandChange
    };
  }
});
