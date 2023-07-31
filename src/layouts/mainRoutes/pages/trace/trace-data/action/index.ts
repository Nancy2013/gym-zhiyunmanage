import { defineComponent, reactive, toRefs, ref, onMounted } from "vue";
import sourceMobileImg from "@/assets/image/mobile.png";
import request from "@/utils/axios";
import { Modal, message, Empty } from "ant-design-vue";
import {
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
} from "@ant-design/icons-vue";
import { useRoute, useRouter } from "vue-router";
import { convertLevel } from "@/utils/function";

const columns = [
  {
    key: "fieldName",
    dataIndex: "fieldName",
    align: "center",
    title: "列表字段",
  },
  {
    key: "fieldShowName",
    dataIndex: "fieldShowName",
    align: "center",
    title: "展示字段",
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
// 默认模板
const defaultTemplates = [
  {
    disabled: true,
    type: "input",
    placeholder: "输入框",
    isEdit: false,
    title: "操作人",
    value: "",
  },
  {
    disabled: true,
    type: "input",
    placeholder: "输入框",
    isEdit: false,
    title: "操作岗位",
    value: "",
  },
  {
    disabled: true,
    type: "date",
    placeholder: "操作时间",
    isEdit: false,
    title: "操作时间",
    value: "",
  },
  {
    disabled: true,
    type: "imgUpload",
    placeholder: "日期时间选择",
    isEdit: false,
    title: "操作图片",
    value: "",
  },
  {
    disabled: true,
    type: "richText",
    placeholder: "富文本编辑",
    isEdit: false,
    title: "描述",
    value: "",
  },
];
export default defineComponent({
  components: {
    DeleteOutlined,
    EditOutlined,
    CheckOutlined,
    Empty,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const formBasicRef = ref();
    const formPreviewRef = ref();
    const formProcessRef = ref();
    const formRulesRef = ref();
    const state = reactive({
      visible: false,
      isSelectTemplate: false,
      isLeaf: false,
      defaultTemplates,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      templateImg: ref<any>(),
      mode: "default",
      current: 0,
      sourceMobileImg,
      columns,
      dataSource: ref<any>([]),
      selectedRowKeys: ref<any>([]),
      steps: [
        {
          title: "第一步",
        },
        {
          title: "第二步",
        },
      ],
      componentSelects,
      componentActions: ref<any>([]),
      treeData: ref<any>([]),
      traceProcessSelListVOS: ref<any>([]), // 溯源流程下拉列表
      businessObjectVOS: ref<any>([]), // 产品，产品批次下拉列表
      batchBOList: ref<any>([]), // 产品批次下拉列表
      traceConfigTemplateVOS: ref<any>([]), // 模板列表
      TraceConfigDataChooseSelListBO: ref<any>([]), // 数据选择列表
      ruleList: ref<any>([]), // 请选择
      roleDtoList: ref<any>([]), // 角色列表
      basicFormState: {
        dataId: ref<any>(undefined),
        processId: ref<any>(undefined),
        productId: ref<any>(undefined),
        batchId: ref<any>(undefined),
        templateId: ref<any>(undefined),
        stepId: ref<any>(undefined),
      },
      rulesFormState: {
        stepDataId: ref<any>(undefined),
        dataType: ref<any>(undefined),
        code: ref<any>(undefined),
        roleVisibleFlag: ref<any>(undefined),
        roleIdList: ref<any>(undefined),
        ruleKeys: ref<any>(undefined),
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
        authorityRange: [
          { required: true, message: "请选择权限范围", trigger: "change" },
        ],
        selectRole: [
          { required: true, message: "请选择角色", trigger: "change" },
        ],
      },
    });

    onMounted(() => {
      state.basicFormState.dataId = route.query.dataId;
      let {
        basicFormState: { dataId },
      } = state;
      getTraceDataSelects(dataId);
    });

    /**
     * 返回列表
     * @param
     * @return
     */
    const goBack = () => {
      Modal.confirm({
        content: "返回后，该页面所有数据将丢失不做保存，请确认是否继续",
        onOk() {
          router.go(-1);
        },
      });
    };

    /**
     * 弹出
     * @param
     * @return
     */
    const showModal = () => {
      state.visible = true;
    };

    /**
     * 选择模板确认
     * @param
     * @return
     */
    const confirmTemplate = () => {
      state.componentActions = state.defaultTemplates;
      state.visible = false;
      state.isSelectTemplate = true;
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
      let { processId, productId, batchId, templateId } = state.basicFormState;
      actionTraceData({ processId, batchId, productId, templateId });
    };

    /**
     * 选择产品
     * @param
     * @return
     */
    const selectProducts = (value: any) => {
      state.batchBOList = [];
      state.basicFormState.batchId = undefined;
      let arr: any = state.businessObjectVOS.filter(
        (v: any) => v.value == value
      );
      state.batchBOList = arr[0].batchBOList.map((v: any) => ({
        label: v.batchTitle,
        value: v.batchId,
      }));
      state.basicFormState.batchId = arr[0].batchBOList.find(
        (v: any) => v.batchChooseFlag == true
      )?.batchId;
    };

    /**
     * 切换模板操作
     * @return
     * @param
     */
    const switchTemplates = (index: number) => {
      state.traceConfigTemplateVOS.map((v: any, i: number) => {
        if (i == index) {
          v.active = true;
          state.basicFormState.templateId = v.id;
          state.templateImg = v.content;
        } else {
          v.active = false;
        }
        return v;
      });
    };

    /**
     * 人工配置数据类型: 使用组件
     * @return
     * @param
     */
    const useComponentFunc = (type: string, placeholder: string) => {
      if (state.componentActions.length >= 10) {
        message.success("最多只可选择十项!");
      } else {
        state.componentActions.push({
          disabled: false,
          type,
          placeholder,
          isEdit: false,
          title: "标题",
          value: "",
        });
      }
    };

    /**
     * 人工配置数据类型: 删除组件
     * @return
     * @param
     */
    const deleteComponentFunc = (index: number) => {
      state.componentActions.splice(index, 1);
    };

    /**
     * 人工配置数据类型: 编辑组件
     * @return
     * @param
     */
    const editComponentFunc = (index: number) => {
      state.componentActions.map((v: any, i: number) => {
        if (index == i) v.isEdit = true;
        return v;
      });
    };

    /**
     * 人工配置数据类型: 保存组件
     * @return
     * @param
     */
    const saveComponentFunc = (index: number) => {
      state.componentActions.map((v: any, i: number) => {
        if (index == i) v.isEdit = false;
        return v;
      });
    };

    /**
     * 数据规则列表数据选择
     */
    const onSelectChange = (selectedRowKeys: any) => {
      console.log("selectedRowKeys", selectedRowKeys);
      state.selectedRowKeys = selectedRowKeys;
    };

    /**
     * 点击树节点触发事件
     * @param
     * @return
     */
    const dropTreeNode = (selectedKeys: any, e: any) => {
      if (!e.node.children.length) {
        state.isLeaf = true;
      } else {
        state.isLeaf = false;
      }
      state.basicFormState.stepId = selectedKeys[0];
      state.isSelectTemplate = false;
      setStepDataId(state.treeData, selectedKeys[0]);
      getStepData(selectedKeys[0]);
      getChooseData(selectedKeys[0]);
      getStepManualItem(selectedKeys[0]);
    };

    /**
     * 监听数据选择触发事件
     * @param
     * @return
     */
    const traceListSelect = (code: string, dataSource?: any) => {
      getStepRuleData(code);
      let { ruleList } = dataSource;
      state.ruleList = ruleList ? ruleList.map((v: any) => ({ label: v.ruleValue, value: v.ruleKey, chooseFlag: v.chooseFlag })) : [];
      if(ruleList) {
        state.rulesFormState.ruleKeys = ruleList
          .filter((v: any) => v.chooseFlag)
          .map((v: any) => v.ruleKey);
      }
    };

    /**
     * 获取溯源数据基础信息
     * @param
     * @return
     */
    const getTraceDataSelects = async (dataId: number) => {
      let res = await request({
        url: import.meta.env.VITE_NODE_URL + "/trace/data/get",
        type: "json",
        method: "get",
        params: {
          dataId: dataId == undefined ? undefined : dataId,
        },
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

        if (dataId != undefined) {
          state.basicFormState.processId = result.traceProcessSelListVOS.find(
            (v: any) => v.chooseFlag == true
          ).id;
          state.basicFormState.productId = result.businessObjectVOS.find(
            (v: any) => v.chooseFlag == true
          ).productId;
          selectProducts(state.basicFormState.productId);
          switchTemplates(
            result.traceConfigTemplateVOS.findIndex(
              (v: any) => v.chooseFlag == true
            )
          );
        }
      }
    };

    /**
     * 添加溯源基础配置
     * @param
     * @return
     */
    const actionTraceData = async (data: any) => {
      let {
          basicFormState: { dataId, processId },
        } = state,
        suffixUrl =
          dataId == undefined ? "/trace/data/add" : "/trace/data/update",
        id = dataId == undefined ? undefined : dataId,
        text = dataId == undefined ? "添加" : "修改",
        res = await request({
          url: import.meta.env.VITE_NODE_URL + suffixUrl,
          type: "json",
          method: "post",
          data: Object.assign({}, data, { id }),
        });
      if (res.code == 200) {
        state.basicFormState.dataId = res.data;
        message.success(`溯源基础配置信息${text}成功!`);
        getProcessTree(dataId, processId);
      }
    };

    const setStepDataId = (target: any, targetId: number) => {
      convertLevel(target).forEach((v: any) => {
        if (targetId == v.id) state.rulesFormState.stepDataId = v.stepDataId;
      });
      console.log("stepDataId", state.rulesFormState.stepDataId);
    };

    /**
     * 根据流程id获取流程步骤树
     * @param
     * @return
     */
    const getProcessTree = async (dataId: number, processId: number) => {
      let res = await request({
        url:
          import.meta.env.VITE_NODE_URL +
          "/trace/step/data/get/process/step/tree",
        type: "json",
        method: "get",
        params: { dataId, processId },
      });
      if (res.code == 200) {
        let result: any = res.data;
        state.treeData = [
          { id: 0, name: result.name, children: result.children },
        ];
      }
    };

    /**
     * 获取溯源步骤数据
     * @param
     * @return
     */
    const getStepData = async (stepId: number) => {
      let {
        basicFormState: { dataId, processId },
      } = state;
      let res = await request({
        url: import.meta.env.VITE_NODE_URL + "/trace/step/data/get/step/data",
        type: "json",
        method: "get",
        params: { dataId, processId, stepId },
      });
      if (res.code == 200) {
        let result: any = res.data;
        state.rulesFormState.dataType = result.dataType
          ? result.dataType
          : undefined;
        state.rulesFormState.roleVisibleFlag = result.roleVisibleFlag
          ? result.roleVisibleFlag
          : undefined;
        state.rulesFormState.roleIdList = result.roleDtoList
          .filter((v: any) => v.chooseFlag)
          .map((v: any) => v.id);
        let {
          data: { roleDtoList },
        }: any = res;
        state.roleDtoList = roleDtoList.map((v: any) => ({
          label: v.name,
          value: v.id,
          chooseFlag: v.chooseFlag,
        }));
      }
    };

    /**
     * 获取溯源步骤数据人工添加数据项
     * @param
     * @return
     */
    const getStepManualItem = async (stepId: number) => {
      let {
        basicFormState: { dataId, processId },
      } = state;
      let res = await request({
        url: import.meta.env.VITE_NODE_URL + "/trace/step/data/manual/item",
        type: "json",
        method: "get",
        params: { dataId, processId, stepId },
      });
      if (res.code == 200) {
        console.log("获取人工添加数据项", res);
        let result: any = res.data;
        state.componentActions = result.map((v: any) => {
          let { attrNameCn, attrNameEn, attrValue, placeholder, type } = v;
          return {
            type,
            placeholder,
            isEdit: false,
            title: attrNameCn,
            value: JSON.parse(attrValue),
          };
        });
      }
    };

    /**
     * 获取溯源步骤数据选择功能 (系统采集)
     * @param
     * @return
     */
    const getChooseData = async (stepId: number) => {
      let {
        basicFormState: { dataId, processId }
      } = state;
      let res = await request({
        url: import.meta.env.VITE_NODE_URL + "/trace/step/data/choose/fuc",
        type: "json",
        method: "get",
        params: { dataId, processId, stepId },
      });
      state.ruleList = [];
      state.dataSource = [];
      state.rulesFormState.ruleKeys = [];
      state.rulesFormState.code = undefined;
      if (res.code == 200) {
        console.log("获取溯源步骤数据选择信息", res);
        let result: any = res.data;
        state.TraceConfigDataChooseSelListBO = result.map((v: any) => ({
          label: v.name,
          value: v.code,
          chooseFlag: v.chooseFlag,
          ruleList: v.ruleList
        }));
        let getFindRow = result.find((v: any) => v.chooseFlag);
        console.log('getFindRow', getFindRow);
        getFindRow && (state.rulesFormState.code = getFindRow.code);
        getFindRow && traceListSelect(getFindRow.code, getFindRow);
    }
  };

    /**
     * 获取溯源步骤数据数据规则 (系统采集)
     * @param
     * @return
     */
    const getStepRuleData = async (code: string) => {
      state.dataSource = [];
      let {
        basicFormState: { dataId, processId, stepId },
      } = state;
      let res = await request({
        url: import.meta.env.VITE_NODE_URL + "/trace/step/data/data/rule",
        type: "json",
        method: "get",
        params: { dataId, processId, stepId, code },
      });
      if (res.code == 200) {
        console.log("获取数据规则数据", res);
        let result: any = res.data;
        state.dataSource = result;
        state.selectedRowKeys = result
          .filter((v: any) => v.chooseFlag)
          .map((v: any) => v.fieldCode);
      }
    };

    /**
     * 添加人工配置数据
     * @param
     * @return
     */
    const submitAddManualInfo = async (data: any) => {
      let res = await request({
        url: import.meta.env.VITE_NODE_URL + "/trace/step/data/add/manual",
        type: "json",
        method: "post",
        data,
      });
      if (res.code == 200) {
        console.log("添加人工配置数据", res);
        message.success("人工配置数据添加成功");
        router.go(-1);
      }
    };

    /**
     * 添加系统采集数据
     * @param
     * @return
     */
    const submitAddChooseInfo = async (data: any) => {
      let res = await request({
        url: import.meta.env.VITE_NODE_URL + "/trace/step/data/add/choose",
        type: "json",
        method: "post",
        data,
      });
      if (res.code == 200) {
        console.log("添加系统采集数据", res);
        message.success("系统采集数据添加成功!");
        router.go(-1);
      }
    };

    /**
     * 修改数据 (人工配置，系统采集)
     * @param
     * @return
     */
    const submitUpdateInfo = async (data: any) => {
      let res = await request({
        url: import.meta.env.VITE_NODE_URL + "/trace/step/data/update",
        type: "json",
        method: "post",
        data,
      });
      if (res.code == 200) {
        console.log("修改数据 (人工配置，系统采集)", res);
        message.success("数据修改成功!");
        router.go(-1);
      }
    };

    /**
     * 提交
     * @return
     * @param
     */
    const submit = () => {
      let {
          selectedRowKeys,
          dataSource,
          componentActions,
          rulesFormState: {
            dataType,
            stepDataId,
            roleVisibleFlag,
            code,
            roleIdList,
            ruleKeys
          },
          basicFormState: { dataId, processId, stepId },
        } = state,
        // 人工配置
        manualDataList = componentActions.map((v: any) => {
          let { type, placeholder } = v;
          return {
            type,
            placeholder,
            dataId,
            processId,
            stepId,
            attrNameCn: v.title,
            attrNameEn: "",
            attrValue: JSON.stringify(v.value),
          };
        }),
        // 数据采集
        chooseDataList = dataSource
          .filter((v: any) =>
            selectedRowKeys.some((w: any) => w == v.fieldCode)
          )
          .map((v: any) => {
            let { fieldCode, fieldName, fieldShowName } = v;
            return {
              dataId,
              processId,
              stepId,
              code,
              fieldCode,
              fieldName,
              fieldShowName,
            };
          }),
        // 转递接口字段
        interfaceParams: any = {
          stepDataId,
          dataId,
          processId,
          stepId,
          dataType,
          roleVisibleFlag,
          manualDataList: dataType == 1 ? manualDataList : undefined,
          chooseDataList: dataType == 2 ? chooseDataList : undefined,
          roleIdList,
          ruleKeys
        };
      if (stepDataId == undefined || stepDataId == null) {
        switch (dataType) {
          case 1:
            submitAddManualInfo(interfaceParams);
            break;
          case 2:
            submitAddChooseInfo(interfaceParams);
            break;
          default:
            break;
        }
      } else {
        submitUpdateInfo(interfaceParams);
      }
    };

    return {
      formBasicRef,
      formPreviewRef,
      formProcessRef,
      formRulesRef,
      ...toRefs(state),
      labelCol: { span: 8 },
      wrapperCol: { span: 0 },
      prev,
      next,
      selectProducts,
      useComponentFunc,
      deleteComponentFunc,
      editComponentFunc,
      saveComponentFunc,
      submit,
      switchTemplates,
      dropTreeNode,
      traceListSelect,
      onSelectChange,
      goBack,
      showModal,
      confirmTemplate,
    };
  },
});
