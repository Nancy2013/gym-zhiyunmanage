import { defineComponent, reactive, toRefs, ref, onMounted } from "vue";
import sourceMobileImg from "@/assets/image/mobile.png";
import request from "@/utils/axios";
import { message } from "ant-design-vue";
import { Moment } from 'moment';
import {
  DeleteOutlined,
  EditOutlined,
  CheckOutlined
} from "@ant-design/icons-vue";

const columns = [
  {
    key: "lbzd",
    dataIndex: "lbzd",
    align: "center",
    title: "列表字段",
  },
  {
    key: "zszd",
    dataIndex: "zszd",
    align: "center",
    title: "展示字段",
  },
  {
    key: "action",
    dataIndex: "action",
    align: "center",
    title: "操作",
  },
];
// 组件选择
const componentSelects = [
  {
    type: "input",
    placeholder: "输入框",
  },
  {
    type: "date",
    placeholder: "日期时间选择",
  },
  {
    type: "range",
    placeholder: "日期时间范围选择",
  },
  {
    type: "imgUpload",
    placeholder: "图片上传",
  },
  {
    type: "fileUpload",
    placeholder: "文件上传（Word或PDF）",
  },
  {
    type: "richText",
    placeholder: "富文本编辑",
  },
];
export default defineComponent({
  components: {
    DeleteOutlined,
    EditOutlined,
    CheckOutlined
  },
  setup() {
    const formBasicRef = ref();
    const formPreviewRef = ref();
    const formProcessRef = ref();
    const formRulesRef = ref();
    const state = reactive({
      current: 0,
      sourceMobileImg,
      columns,
      dataSource: [] as any,
      steps: [
        {
          title: "第一步",
        },
        {
          title: "第二步",
        },
      ],
      componentSelects,
      componentActions: [] as any,
      treeData: [
        {
          title: "顶级",
          key: "0-0",
          children: [
            {
              title: "制作工艺",
              key: "0-0-0",
              children: [
                { title: "工艺1", key: "0-0-0-0" },
                { title: "工艺2", key: "0-0-0-1" },
              ],
            },
            {
              title: "质检过程",
              key: "0-0-1",
              children: [
                { title: "第一道质检", key: "0-0-1-0" },
                { title: "第二道质检", key: "0-0-1-1" },
              ],
            },
            {
              title: "打包装盒",
              key: "0-0-2",
              children: [{ title: "打包装盒", key: "0-0-2-0" }],
            },
          ],
        },
      ],
      traceProcessSelListVOS: [], // 溯源流程下拉列表
      businessObjectVOS: [], // 产品，产品批次下拉列表
      batchBOList: [], // 产品批次下拉列表
      traceConfigTemplateVOS: [], // 模板列表
      basicFormState: {
        processId: undefined,
        productId: undefined,
        batchId: undefined,
        templateId: undefined,
      },
      rulesFormState: {
        sourceName: undefined,
        selectType: undefined,
        dataRules: undefined,
        authorityRange: undefined,
        selectRole: undefined,
      },
      basicRules: {
        processId: [
          { required: true, message: "请选择流程", trigger: "change" },
        ],
        productId: [
          { required: true, message: "请选择产品", trigger: "change" },
        ],
        batchId: [
          { required: true, message: "请选择产品批次", trigger: "change" },
        ],
        templateId: [
          { required: true, message: "请选择模板", trigger: "change" },
        ],
      },
      rulesRules: {
        sourceName: [
          { required: true, message: "请选择数据来源", trigger: "change" },
        ],
        selectType: [
          { required: true, message: "请选择功能", trigger: "change" },
        ],
        dataRules: [
          { required: true, message: "请添加数据规则", trigger: "blur" },
        ],
        authorityRange: [
          { required: true, message: "请选择权限范围", trigger: "change" },
        ],
        selectRole: [
          { required: true, message: "请选择角色", trigger: "change" },
        ],
      },
    });

    onMounted(() => {
      getTraceDataSelects();
    });

    /**
     * 使用组件
     * @return
     * @param
     */
    const useComponentFunc = (type: string, placeholder: string) => {
        let value: any = '';
        state.componentActions.push({ type, placeholder, isEdit: false, title: '', value });
        if(state.componentActions.length > 10) {
           message.success("最多只可选择十项!");
        }
    }

    /**
     * 删除组件
     * @return
     * @param
     */
    const deleteComponentFunc = (index: number) => {
        state.componentActions.splice(index, 1);
    }

    /**
     * 编辑组件
     * @return
     * @param
     */
    const editComponentFunc = (index: number) => {
        state.componentActions.map((v: any, i: number) => {
            if(index == i) v.isEdit = true;
            return v
        })
    }

    /**
     * 保存组件
     * @return
     * @param
     */
    const saveComponentFunc = (index: number) => {
        state.componentActions.map((v: any, i: number) => {
            if(index == i) v.isEdit = false;
            return v;
        })
    }

    /**
     * 添加属性
     * @return
     */
    const handleAdd = () => {
      const newData = {
        sort: 0,
        lbzd: "",
        zszd: "",
      };
      state.dataSource.push(newData);
      state.dataSource = state.dataSource.map((item: any, index: number) =>
        Object.assign({}, item, { sort: index + 1 })
      );
    };

    /**
     * 删除属性
     * @param { Number } key
     * @return
     */
    const handleDelete = (key: number) => {
      state.dataSource = state.dataSource.filter(
        (item: any) => item.sort != key
      );
    };

    /**
     * 上一步操作
     * @param
     * @return
     */
    const prev = () => {
      state.current--;
    };

    /**
     * 下一步操作
     * @param
     * @return
     */
    const next = () => {
      state.current++;
      let { processId, productId, batchId, templateId } = state.basicFormState
      addTraceData({ processId, batchId, productId, templateId })
    };

    /**
     * 选择产品
     * @param
     * @return
     */
    const selectProducts = (value: any) => {
      state.batchBOList = [];
      state.basicFormState.batchId = undefined
      let arr: any = state.businessObjectVOS.filter(
        (v: any) => v.value == value
      );
      state.batchBOList = arr[0].batchBOList.map((v: any) => ({ label: v.batchTitle, value: v.batchId }))
    };

    /**
     * 获取溯源数据基础信息
     * @param
     * @return
     */
    const getTraceDataSelects = async () => {
      let res = await request({
        url: import.meta.env.VITE_NODE_URL + "/trace/data/get",
        type: "json",
        method: "get",
      });
      if (res.code == 200) {
        let result = res.data as any;
        state.traceProcessSelListVOS =
          result.traceProcessSelListVOS &&
          result.traceProcessSelListVOS.map((v: any) => ({
            label: v.name,
            value: v.id,
          })); // 溯源流程下拉列表
        state.businessObjectVOS =
          result.businessObjectVOS &&
          result.businessObjectVOS.map((v: any) => ({
            label: v.productName,
            value: v.productId,
            batchBOList: v.batchBOList,
          })); // 产品，产品批次下拉列表
        state.traceConfigTemplateVOS =
          result.traceConfigTemplateVOS && result.traceConfigTemplateVOS; // 模板列表
      }
    };

    /**
     * 添加溯源基础配置
     * @param
     * @return
     */
    const addTraceData = async (data: any) => {
       let res = await request({
          url: import.meta.env.VITE_BASE_URL + "/trace/data/add",
          type: 'json',
          method: 'post',
          data
       });
       if(res.code == 200) {
         
       }
    }

    /**
     * 提交
     * @return
     * @param
     */
    const submit = () => {
        console.log('提交', state.componentActions);
    }

    return {
      formBasicRef,
      formPreviewRef,
      formProcessRef,
      formRulesRef,
      ...toRefs(state),
      labelCol: { span: 8 },
      wrapperCol: { span: 0 },
      handleAdd,
      handleDelete,
      prev,
      next,
      selectProducts,
      useComponentFunc,
      deleteComponentFunc,
      editComponentFunc,
      saveComponentFunc,
      submit
    };
  },
});
