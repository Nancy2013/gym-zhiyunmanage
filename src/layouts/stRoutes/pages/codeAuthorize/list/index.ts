import { defineComponent, onMounted, reactive, toRefs, ref, watch } from "vue";
import { Modal, message } from "ant-design-vue";
import service from "@/service/stRoutes";
import { usePage } from "./../composables/usePage";
import type { Rule } from "ant-design-vue/es/form";
import {showTime} from '@/utils/function'
const columns = [
  {
    key: "index",
    dataIndex: "index",
    align: "center",
    title: "序号",
    width: 100,
  },
  {
    key: "enterpriseName",
    dataIndex: "enterpriseName",
    align: "center",
    title: "企业名称",
    width: 200,
  },
  {
    key: "brandName",
    dataIndex: "brandName",
    align: "center",
    title: "品牌名称",
    width: 200,
  },
  {
    key: "applyCodeNum",
    dataIndex: "applyCodeNum",
    align: "center",
    title: "申请码量",
    width: 200,
  },
  {
    key: "createdTime",
    dataIndex: "createdTime",
    align: "center",
    title: "申请时间",
    width: 200,
    defaultSortOrder: 'descend',
    sorter: (a: any, b: any) => {
      if(a.createdTime > b.createdTime){
        return 1;
      }
      if(a.createdTime < b.createdTime){
        return -1;
      }
      return 0;
    },
  },
  {
    key: "applyRemark",
    dataIndex: "applyRemark",
    align: "center",
    title: "申请理由",
    width: 200,
  },
  {
    key: "status",
    dataIndex: "status",
    align: "center",
    title: "审核状态",
    width: 200,
  },
  {
    key: "grantCodeNum",
    dataIndex: "grantCodeNum",
    align: "center",
    title: "发放码量",
    width: 200,
  },
  {
    key: "grantTime",
    dataIndex: "grantTime",
    align: "center",
    title: "发放时间",
    width: 200,
  },
  {
    key: "action",
    title: "操作",
    align: "center",
    dataIndex: "action",
    fixed: "right",
    width: 200,
  },
];
/**
 *表单校验
 *
 * @param {Rule} _rule 规则
 * @param {string} value 返回值
 * @return {*}
 */
const validate = async (_rule: Rule, value: string) => {
  return Promise.resolve();
};
export default defineComponent({
  setup() {
    const formRef = ref();
    const state = reactive({
      columns,
      visible: false,
      formData: {
        id: 0,
        enterpriseName: "",
        brandName: "",
        applyCodeNum: "",
        createdTime: "",
        applyRemark: "",
        status: null as any,
        grantCodeNum: "",
        grantTime: "",
        grantRemark: "",
      },
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    });
    const {
      loading,
      pagination,
      codeStatus,
      statusOptions,
      search,
      dataSource,
      query,
      paginationChange,
      handleSearch,
      reset,
    } = usePage({});

    onMounted(() => {});

    // Form表单rules
    const rules = reactive({
      grantCodeNum: [
        { required: true, message: "请输入发放码量", validator: validate},
      ],
      grantRemark: [
        { required: true, message: "请输入驳回原因", validator: validate },
      ],
    });

    /**
     * 关闭弹窗
     */
    const handleClose = () => {
      formRef.value && formRef.value.resetFields();
      state.formData={} as any;
    };

    /**
     *驳回
     *
     */
    const reject = () => {
      const { grantRemark } = state.formData;
      if (!grantRemark) {
        message.error("请输入驳回原因");
        return;
      }
      const params = {
        grantRemark,
        grantCodeNum: "",
        status:2, // 已驳回
      };
      updateCode(params, "驳回");
    };

    /**
     *审核通过
     *
     */
    const ok = () => {
      const { grantCodeNum, grantRemark } = state.formData;
      if (!grantCodeNum) {
        message.error("请输入有效发放码量");
        return;
      }
      const params = {
        grantRemark,
        grantCodeNum,
        status:1, // 已审核
      };
      updateCode(params, "审核通过");
    };

    /**
     * 审核码量授权
     * @param params 审核参数
     * @param msg 操作成功信息提示
     */
    const updateCode = (params: any, msg: string) => {
      const { updateCode } = service.codeAuthorize;
      const { id } = state.formData;
      params.id = id;
      console.log("------updateCode------", params);
      updateCode(params)
        .then((res: any) => {
          const { code } = res;
          if (code === 200) {
            message.success(`${msg}成功`);
            hideModal();
            query();
          }
        })
        .catch((e: any) => {
          console.error(e);
        });
    };

    /**
     *审核|详情
     *
     * @param {*} item
     */
    const showModal = (item: any) => {
      state.visible = true;
      state.formData = {
        ...item,
      };
    };

    /**
     *隐藏弹窗
     *
     */
    const hideModal = () => {
      state.visible = false;
    };

    return {
      ...toRefs(state),
      formRef,
      rules,
      codeStatus,
      statusOptions,
      showModal,
      hideModal,
      reject,
      handleClose,
      ok,
      handleSearch,
      paginationChange,
      reset,
      loading,
      columns,
      pagination,
      search,
      dataSource,
      showTime,
    };
  },
});
