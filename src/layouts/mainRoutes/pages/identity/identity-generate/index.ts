import dayjs from "dayjs";
import request from "@/utils/axios";
import { message } from "ant-design-vue";
import {
  defineComponent,
  toRefs,
  reactive,
  onMounted,
  watch,
  ref,
  computed,
} from "vue";
import service from "@/service/mainRoutes";
import { getPopupContainer } from '@/hooks'
import { RenderFormItem } from '@/components/tsx/form'
import { identityCodeStatusOptions } from '@/utils/config'


export const batchSearchRenderList: RenderFormItem[] = [
  {
    label: '产品名称',
    key: 'condition',
    type: 'input',
    placeholder: '产品名称'
  },
  {
    label: '状态',
    key: 'status',
    type: 'select',
    placeholder: '请选择状态',
    options: identityCodeStatusOptions
  },
]

export const sectionSearchRenderList: RenderFormItem[] = [
  {
    label: '时间区间',
    key: 'rangeTime',
    type: 'datePicker',
    datePickerType: 'rangePicker'
  }
]

const codeColumns = [
  {
    key: "index",
    dataIndex: "index",
    title: "流水号",
    width: 180
  },
  {
    key: "status",
    dataIndex: "status",
    title: "状态",
    width: 100
  },
  {
    key: "count",
    dataIndex: "count",
    align: "right",
    title: "生码数量",
    width: 100
  },
  {
    key: "successCount",
    dataIndex: "successCount",
    align: "right",
    title: "已同步数量",
    width: 100
  },
  {
    key: "hasCheckCode",
    dataIndex: "hasCheckCode",
    title: "查验码",
    width: 100
  },
  {
    key: "boName",
    dataIndex: "boName",
    title: "产品名称",
    width: 180
  },
  {
    key: "remark",
    dataIndex: "remark",
    title: "备注",
    width: 120
  },
  {
    key: "createdTime",
    dataIndex: "createdTime",
    title: "创建时间",
    width: 140,
  },
  {
    key: "creator",
    dataIndex: "creator",
    title: "创建人",
    width: 100
  },
  {
    key: "action",
    dataIndex: "action",
    title: "操作",
    fixed: "right",
    width: 300,
  },
]; // 表格列 (批量赋值)

const segColumns = [
  {
    key: "index",
    dataIndex: "index",
    title: "流水号",
    width: 200,
  },
  {
    key: "count",
    dataIndex: "count",
    align: "right",
    title: "生码数量",
    width: 100
  },
  {
    key: "surplusCount",
    dataIndex: "surplusCount",
    align: "right",
    title: "未激活量",
    width: 100
  },
  {
    key: "hasCheckCode",
    dataIndex: "hasCheckCode",
    title: "查验码",
    width: 100
  },
  {
    key: "remark",
    dataIndex: "remark",
    title: "备注",
    width: 140
  },
  {
    key: "createdTime",
    dataIndex: "createdTime",
    title: "创建时间",
    width: 140,
  },
  {
    key: "creator",
    dataIndex: "creator",
    title: "创建人",
    width: 120
  },
  {
    key: "action",
    dataIndex: "action",
    align: "center",
    title: "操作",
    width: 300,
  },
]; // 表格列 (分段赋值)

const segModalColumns = [
  {
    key: "index",
    dataIndex: "index",
    align: "center",
    title: "流水号段",
    width: 150,
  },
  {
    key: "count",
    dataIndex: "count",
    align: "center",
    title: "数量",
    width: 100,
  },
  {
    key: "boName",
    dataIndex: "boName",
    align: "center",
    title: "产品",
    width: 100,
  },
  {
    key: "batchNo",
    dataIndex: "batchNo",
    align: "center",
    title: "产品批次",
    width: 100,
  },
  {
    key: "templateName",
    dataIndex: "templateName",
    align: "center",
    title: "产品模板",
    width: 100,
  },
  {
    key: "createdTime",
    dataIndex: "createdTime",
    align: "center",
    title: "创建时间",
    width: 150,
  },
]; // 表格列 (弹框表单)

export default defineComponent({
  setup() {
    const formRef = ref();
    const state = reactive({
      type: 0,
      title: "",
      convertType: "",
      codeColumns,
      segColumns,
      segModalColumns,
      dataSource: [],
      segModalDataSource: [],
      rules: [],
      objects: [],
      templates: [],
      batchs: [],
      loading: true,
      convertInterface: "",
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
      batchSearchRenderList,
      sectionSearchRenderList,
      query: {
        condition: "",
        status: undefined,
        rangeTime: ref<any[]>([]),
      },
      visible: false,
      addFormState: {
        otherCount: 1099880,
        count: "",
        ruleId: undefined,
        hasCheckCode: 0,
        remark: "",
      },
      bindFormState: {
        recordId: "",
        boId: undefined,
        boName: "",
        templateId: undefined,
        templateName: "",
      },
      assignFormState: {
        index: "",
        indexStart: "",
        indexEnd: "",
        otherCount: 1099880,
        count: 0,
        hasCheckCode: 0,
        recordId: "",
        boId: undefined,
        boName: "",
        templateId: undefined,
        templateName: "",
        batchId: undefined,
        batchNo: "",
        remark: "",
      },
      detailFormState: {
        index: "",
        indexStart: "",
        indexEnd: "",
        status: 0,
        count: 0,
        hasCheckCode: 0,
        recordId: "",
        boId: undefined,
        boName: "",
        templateId: undefined,
        templateName: "",
        batchId: undefined,
        batchNo: "",
        remark: "",
      },
      downloadFormState: {
        recordId: "",
        idType: "",
      },
      addRules: {
        type: [
          { required: true, message: "请选择标识赋值方式", trigger: "change" },
        ],
        count: [
          { required: true, message: "请输入生码数量 (码量)", trigger: "blur" },
        ],
        ruleId: [
          { required: true, message: "请选择标识策略", trigger: "change" },
        ],
        hasCheckCode: [
          { required: true, message: "请选择防伪码", trigger: "change" },
        ],
      },
      bindRules: {
        boId: [
          {
            required: true,
            message: "请选择产品",
            trigger: "change",
          },
        ],
        templateId: [
          {
            required: true,
            message: "请选择需要绑定的模板",
            trigger: "change",
          },
        ],
        batchId: [
          {
            required: true,
            message: "请选择产品",
            trigger: "change",
          },
        ],
      },
      assignRules: {
        index: [
          {
            required: true,
            message: "必填项不能为空",
            trigger: "blur",
          },
        ],
        indexStart: [
          {
            required: true,
            message: "必填项不能为空",
            trigger: "blur",
          },
        ],
        indexEnd: [
          {
            required: true,
            message: "必填项不能为空",
            trigger: "blur",
          },
        ],
        boId: [
          {
            required: true,
            message: "请选择需要绑定的对象",
            trigger: "change",
          },
        ],
        templateId: [
          {
            required: true,
            message: "请选择需要绑定的模板",
            trigger: "change",
          },
        ],
        batchId: [
          {
            required: true,
            message: "请选择需要绑定的批次",
            trigger: "change",
          },
        ],
      },
      detailRules: {
        count: [
          {
            required: true,
            message: "",
          },
        ],
        hasCheckCode: [
          {
            required: true,
            message: "",
          },
        ],
        boName: [
          {
            required: true,
            message: "",
          },
        ],
        templateName: [
          {
            required: true,
            message: "",
          },
        ],
        batchNo: [
          {
            required: true,
            message: "",
          },
        ],
      },
      detailVisible: false,
    });

    onMounted(() => {
      let { type } = state;
      state.convertInterface = Object.is(type, 0) ? "code" : "code/seg";
      codeRecord(state.convertInterface);
    });

    watch(
      () => state.type,
      (next) => {
        state.pagination = { total: 0, current: 1, pageSize: 10 }; // 清空分页
        state.query = {
          condition: "",
          status: undefined,
          rangeTime: [],
        };
        state.convertInterface = Object.is(next, 0) ? "code" : "code/seg";
        codeRecord(state.convertInterface);
      }
    ); // 数据监听

    /**
     * 查询标识策略
     * @return
     */
    const rulesQuery = async () => {
      let res: any = await request({
        url: import.meta.env.VITE_NODE_URL + "/rule/pageQuery",
        type: "json",
        method: "post",
        data: {
          pageNum: 1,
          pageSize: 99999,
          ruleType: 1,
        },
      });
      if (res.code == 200) {
        state.rules = res.rows.map((item: any) => ({
          value: item.id,
          label: item.ruleName,
        }));
      }
    };

    /**
     * 查询对象列表
     * @return
     */
    const queryProduct = async () => {
      const { queryProduct } = service.identity
      const params = {
        pageNum: 1,
        pageSize: 99999,
      }
      let res: any = await queryProduct(params);
      if (res.code == 200) {
        state.objects = res.rows.map((item: any) => ({
          value: item.id,
          label: item.name,
        }));
      }
    };

    /**
     * 查询模板列表
     * @param { Number } boId
     */
    const templateQuery = async (boId: number) => {
      let res: any = await request({
        url: import.meta.env.VITE_NODE_URL + "/businessObjectTemplate/list",
        type: "json",
        method: "post",
        data: {
          pageNum: 1,
          pageSize: 99999,
          boId,
        },
      });
      if (res.code == 200) {
        state.templates = res.rows.map((item: any) => ({
          value: item.id,
          label: item.name,
        }));
      }
    };

    /**
     * 查询批次列表
     * @param { Number } boId
     */
    const batchQuery = async (boId: number) => {
      let res: any = await request({
        url: import.meta.env.VITE_NODE_URL + "/businessBatchObject/pageQuery",
        type: "json",
        method: "post",
        data: {
          pageNum: 1,
          pageSize: 99999,
          boId,
        },
      });
      if (res.code == 200) {
        state.batchs = res.rows.map((item: any) => ({
          value: item.id,
          label: item.batchTitle,
        }));
      }
    };

    /**
     * 标识生成
     * @param { string } type
     * code: 批量生码，code/seg: 分段生码
     * @param { Number? } segmentRecordId
     * @return
     */
    const codeRecord = async (type: string, segmentRecordId?: number) => {
      if (segmentRecordId) {
        let res: any = await request({
          url: import.meta.env.VITE_NODE_URL + `/${type}/record`,
          type: "json",
          method: "post",
          data: { segmentRecordId },
        });
        if (res.code == 200) {
          state.segModalDataSource = res.rows;
        }
      } else {
        state.loading = true;
        let {
          pagination: { current, pageSize },
          query: { condition, status, rangeTime },
        } = state;
        const params: any = {
          pageNum: current,
          pageSize,
          condition,
          status,
        }
        if (Array.isArray(rangeTime) && rangeTime.length) {
          params.startTime = dayjs(rangeTime[0]).format('YYYY-MM-DD')
          params.endTime = dayjs(rangeTime[1]).format('YYYY-MM-DD')
        }

        let res: any = await request({
          url: import.meta.env.VITE_NODE_URL + `/${type}/record`,
          type: "json",
          method: "post",
          data: params
        });
        if (res.code == 200) {
          state.loading = false;
          state.dataSource = res.rows;
          state.pagination = {
            total: res.total,
            current,
            pageSize,
          };
        }
      }
    };

    /**
     * 生码操作
     * @param { Object } data
     * @param { String } type
     * code: 批量生码，code/seg: 分段生码
     * @return
     */
    const codeGenerate = async (data: any, type: string) => {
      let res: any = await request({
        url: import.meta.env.VITE_NODE_URL + `/${type}/generate`,
        type: "json",
        method: "post",
        data,
      });
      if (res.code == 200) {
        state.visible = false;
        codeRecord(type);
        message.success(res.msg);
      }
    };

    /**
     * 同步到二级节点
     * @param { Object } data
     * @param { String } type
     * code: 批量赋值，code/seg: 分段赋值
     * @return
     */
    const codeRelease = async (data: any, type: string) => {
      let res: any = await request({
        url: import.meta.env.VITE_NODE_URL + `/${type}/release`,
        type: "json",
        method: "post",
        data,
      });

      if (res.code == 200) {
        state.visible = false;
        codeRecord(type);
        message.success(res.msg);
      }
    };

    /**
     * 模板绑定
     * @param { Object } data
     * @param { String } type
     * @return
     */
    const changeTemplate = async (data: any, type: string) => {
      let res: any = await request({
        url: import.meta.env.VITE_NODE_URL + `/${type}/change/template`,
        type: "json",
        method: "post",
        data,
      });
      if (res.code == 200) {
        state.visible = false;
        codeRecord(type);
        message.success(res.msg);
      }
    };

    /**
     * 下载模板
     * @param { String } type
     * @param { String } id
     * @param { String } downloadType
     */
    const downloadTemplate = (
      type: string,
      id: string,
      downloadType?: string
    ) => {
      const key = state.type ? "segmentRecordId" : "recordId";

      /**
       * 下载模板
       * @param { Object } content
       * @param { String } fileName
       * @return
       */
      const downloadByBlob = (content: any, fileName: string) => {
        const aTag = document.createElement("a");
        const blob: any = new Blob([content]);
        aTag.style.display = "none";
        aTag.href = URL.createObjectURL(blob);
        aTag.setAttribute("download", fileName);
        document.body.appendChild(aTag);
        aTag.click();
      };

      /**
       * 下载excel模板
       * @return
       */
      const downloadExcel = async () => {
        let res: any = await request({
          responseType: "blob",
          url: import.meta.env.VITE_NODE_URL + "/code/down/excel",
          method: "get",
          params: { [`${key}`]: id },
          isDownload: true,
        });
        let getDecodeUrl = decodeURI(res.headers[`content-disposition`]).split(
          "="
        )[1];
        downloadByBlob(res.data, getDecodeUrl.split('"')[1]);
      };

      /**
       * 下载zip模板
       * @return
       */
      const downloadZip = async () => {
        let res: any = await request({
          responseType: "blob",
          url: import.meta.env.VITE_NODE_URL + "/code/down/zip",
          method: "get",
          params: { [`${key}`]: id, type: downloadType },
          isDownload: true,
        });
        downloadByBlob(
          res.data,
          res.headers[`content-disposition`].split('"')[1]
        );
      };
      type == "excel" && downloadExcel();
      type == "zip" && downloadZip();
    };

    /**
     * 打开不同弹框
     * @param { String } type
     * @param { Object? } record
     */
    const showModal = (type: string, record?: any) => {
      switch (type) {
        case "add":
          state.title = "添加标识信息";
          break;
        case "assign":
          state.title = "赋值";
          state.assignFormState.index = `${record.indexStart} - ${record.indexEnd}`;
          state.assignFormState.recordId = record.id;
          state.assignFormState.count = record.count;
          state.assignFormState.hasCheckCode = record.hasCheckCode;
          break;
        case "download":
          state.title = "下载";
          state.downloadFormState.recordId = record.id;
          break;
        case "bind":
          state.title = "模板绑定";
          const { id, boId, templateId, } = record
          state.bindFormState.recordId = id;
          state.bindFormState.boId = boId;
          state.bindFormState.templateId = templateId;
          break;
        default:
          break;
      }
      if (Object.is(type, "add")) rulesQuery();
      if (Object.is(type, "assign")) queryProduct();
      if (state.type && type == "assign") codeRecord("code", record.id);
      if (Object.is(type, "bind")) {
        queryProduct();
        templateQuery(record.boId);
        batchQuery(record.boId);
      }
      state.convertType = type;
      state.visible = true;
    };

    /**
     * 显示状态
     */
    const getStatus = computed(() => {
      return function (value: number) {
        const status = identityCodeStatusOptions.filter((item: any) => item.value === value)[0];
        if (status) {
          return status.label;
        }
        return value;
      };
    });

    /**
     *详情弹窗
     *
     * @param {*} record 当前行
     */
    const showDetailModal = (record: any) => {
      state.detailVisible = true;
      state.title = "详情";
      const { indexStart, indexEnd } = record;
      state.detailFormState = {
        ...record,
        index: `${indexStart}~${indexEnd}`,
      };
      if (state.type) {
        // 分段赋值
        codeRecord("code", record.id);
      }
    };

    /**
     * 全选码段
     * @return
     */
    const selectAllCode = () => {
      let arr = state.assignFormState.index.split("-");
      state.assignFormState.indexStart = arr[0].trim();
      state.assignFormState.indexEnd = arr[1].trim();
    };

    /**
     *
     *产品、模版、批次下拉框
     * @param {string} type 下拉框类型
     * @param {string} flag 弹窗标识
     * @param {boolean} [isInterface] 是否联动
     */
    const selectChange = (
      type: string,
      flag: string,
      isInterface?: boolean
    ) => {
      let { objects, templates, batchs } = state;
      let { boId, templateId, batchId } = state[`${flag}`];
      /**
       * 获取label字段值
       * @param { Number } id
       * @param { Array } arr
       * @return
       */
      const getLabel = (id: number, arr: any) => {
        let label: string = "";
        arr.forEach((item: any) => {
          if (item.value == id) {
            label = item.label;
          }
        });
        return label;
      };

      if (isInterface) {
        state[`${flag}`].templateId = undefined;
        state[`${flag}`].batchId = undefined;
        let id = boId as unknown as number;
        batchQuery(id);
        templateQuery(id);
      } // 是否有联动数据调用

      switch (type) {
        case "objects":
          state[`${flag}`].boName = getLabel(
            boId as unknown as number,
            objects
          );
          break;
        case "templates":
          state[`${flag}`].templateName = getLabel(
            templateId as unknown as number,
            templates
          );
          break;
        case "batchs":
          state[`${flag}`].batchNo = getLabel(
            batchId as unknown as number,
            batchs
          );
          break;
        default:
          break;
      }
    };

    /**
     * 清空数据
     * @return
     */
    const destroyInfo = () => {
      formRef.value && formRef.value.resetFields();
      state.objects = [];
      state.templates = [];
      state.batchs = [];
    };

    /**
     * 分页查询
     * @param { Object } pagination
     * @return
     */
    const paginationChange = (pagination: any) => {
      let { current, pageSize, total } = pagination;
      state.pagination = { current, pageSize, total };
      codeRecord(state.convertInterface);
    };

    /**
     * 列表查询
     * @return
     */
    const queryList = () => {
      state.pagination.current = 1;
      codeRecord(state.convertInterface);
    };

    /**
     * 列表重置
     * @return
     */
    const reset = () => {
      state.query = {
        condition: "",
        status: undefined,
        rangeTime: [],
      };
      queryList();
    };

    /**
     * 数据提交
     * @return
     */
    const submit = () => {
      let {
        addFormState: { count, hasCheckCode, ruleId },
        assignFormState: {
          recordId,
          boId,
          boName,
          templateId,
          templateName,
          batchId,
          batchNo,
          indexStart,
          indexEnd,
        },
        convertInterface,
      } = state;
      formRef.value.validate().then((params: any) => {
        switch (state.convertType) {
          case "add":
            codeGenerate(
              {
                count,
                hasCheckCode: hasCheckCode ? 1 : 0,
                ruleId,
                remark: state.addFormState.remark,
              },
              convertInterface
            );
            break;
          case "assign":
            state.type
              ? (() => {
                if (Number(indexStart) - Number(indexEnd) > 0) {
                  message.error("结束号段应该不小于开始号段!");
                } else {
                  codeRelease(
                    {
                      segmentRecordId: recordId,
                      indexStart,
                      indexEnd,
                      boId,
                      boName,
                      templateId,
                      templateName,
                      batchId,
                      batchNo,
                      remark: state.assignFormState.remark,
                    },
                    convertInterface
                  );
                }
              })()
              : codeRelease(
                {
                  recordId,
                  boId,
                  boName,
                  templateId,
                  templateName,
                  batchId,
                  batchNo,
                  remark: state.assignFormState.remark,
                },
                convertInterface
              );
            break;
          case "bind":
            changeTemplate(
              {
                recordId: state.bindFormState.recordId,
                boId: state.bindFormState.boId,
                boName: state.bindFormState.boName,
                templateId: state.bindFormState.templateId,
                templateName: state.bindFormState.templateName,
              },
              convertInterface
            );
            break;
          default:
            break;
        }
      });
    };

    /**
     *生码数量提示
     *
     * @param {*} value
     */
    const handleCountChange = (e: any) => {
      const { value } = e.target;
      if (parseInt(value) > 500000) {
        message.error("码量过大，会影响其他正常操作！");
      }
    };

    /**
     * 查询剩余码量 TODO
     * @returns 返回结果
     */
    const queryRemainCode = () => {
      const params = {
        id: ''
      };
      const { queryRemainCode } = service.identity;
      return queryRemainCode(params);
    }

    return {
      ...toRefs(state),
      formRef,
      showModal,
      selectAllCode,
      submit,
      paginationChange,
      destroyInfo,
      selectChange,
      queryList,
      reset,
      downloadTemplate,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      handleCountChange,
      showDetailModal,
      getStatus,
      getPopupContainer,
    };
  },
});
