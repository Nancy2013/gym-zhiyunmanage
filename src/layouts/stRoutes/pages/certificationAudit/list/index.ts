import { defineComponent, onMounted, reactive, toRefs, watch } from "vue";
import { Modal, message } from "ant-design-vue";
import request from "@/utils/axios";
import { useRoute, useRouter } from "vue-router";
import { useAction } from "@/hooks";
import {approvalStatusOptions} from "./config";
import audit from '@/assets/image/audit.png'

// 表格数据
const columns = [
  {
    key: "index",
    dataIndex: "index",
    align: "center",
    title: "序号",
    width: 100,
  },
  {
    key: "companyName",
    dataIndex: "companyName",
    align: "center",
    title: "企业名称",
    width: 200,
  },
  {
    key: "shortName",
    dataIndex: "shortName",
    align: "center",
    title: "企业简称",
    width: 200,
  },
  {
    key: "teaGardenSelf",
    dataIndex: "teaGardenSelf",
    align: "center",
    title: "是否自有茶园",
    width: 200,
  },
  {
    key: "plantingArea",
    dataIndex: "plantingArea",
    align: "center",
    title: "种植面积(亩)",
    width: 200,
  },
  {
    key: "production",
    dataIndex: "production",
    align: "center",
    title: "年产量(kg)",
    width: 200,
  },
  {
    key: "productionLineNum",
    dataIndex: "productionLineNum",
    align: "center",
    title: "产线数",
    width: 200,
  },
  {
    key: "contactsName",
    dataIndex: "contactsName",
    align: "center",
    title: "联系人",
    width: 200,
  },
  {
    key: "contactsPhone",
    dataIndex: "contactsPhone",
    align: "center",
    title: "联系电话",
    width: 200,
  },
  {
    key: "createdTime",
    dataIndex: "createdTime",
    align: "center",
    title: "申请时间",
    width: 200,
  },

  {
    key: "approvalStatus",
    dataIndex: "approvalStatus",
    align: "center",
    title: "审核状态",
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

const getStatusOptions=()=>{
  const options=[
    {
      label: "审核状态",
      value: "",
    },
  ];

  Object.keys(approvalStatusOptions).forEach(status=>{
    options.push({
      label:approvalStatusOptions[status]||status,
      value:status
    });
  })

  return options;
}

export default defineComponent({
  setup() {
    const router = useRouter()
    const storeAction = useAction('stModule',['asyncUpdateIsStBreamub','asyncUpdateApprovalStatus'])
    const state = reactive({
      columns,
      dataSource: [],
      loading: true,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10
      },
      statusOptions:getStatusOptions(),
      search: {
        companyName: "",
        approvalStatus: "",
      },
      visible: false,
      modalCompanyName: "",
      id: "",
      reason: "",
      isCode:false,
      code:'',
      audit,
    });

    onMounted(() => {
      query();
      const { asyncUpdateIsStBreamub,asyncUpdateApprovalStatus } = storeAction
      asyncUpdateIsStBreamub({isStBreamub: true})
      asyncUpdateApprovalStatus({approvalStatus:-1})
    });

    // 查询
    const query = async () => {
      state.loading = true
      let { pagination: { pageSize, current }, search: { companyName, approvalStatus } } = state
      const params={
        pageNum:current,
        pageSize,
        approveStatus:approvalStatus,
        keyWords:companyName,
      };
      let res: any = await request({
        url: `${import.meta.env.VITE_XICHA_URL}/page-query`,
        type: "json",
        method: "post",
        data: params,
      });
      const {code,data}=res;
      if (code == 200) {
        let { total } = data
        state.dataSource = data.rows;
        state.loading = false;
        state.pagination = {
          total,
          current,
          pageSize
        };
      }
    };

    /**
     *初始化分页
     *
     */
    const initPagination=()=>{
      state.pagination.current = 1;
    }

    /**
     *搜索查询
     *
     */
    const handleSearch = () => {
      initPagination();
      query();
    };

    
    /**
     *驳回
     *
     */
    const cancel = async() => {
      if (state.reason) {
        const {id,reason}=state;
        const params={ id, approve: 3,reason }    
        let res: any = await request({
          url:`${import.meta.env.VITE_XICHA_URL}/approve`,
          type: "json",
          method: "post",
          data:params,
        });
        const {code}=res
        if (code == 200) {
          query();
          state.visible = false;
          message.success("认证审核已驳回");
        }
      } else {
        message.error("请填写驳回原因");
      }
    };


    /**
     *通过
     *
     */
    const ok = async() => {
      const params={ id: state.id, approve: 2, }
      let res: any = await request({
        url:`${import.meta.env.VITE_XICHA_URL}/approve`,
        type: "json",
        method: "post",
        data:params,
      });
      const {code}=res
      if (code == 200) {
        query();
        state.visible = false;
        message.success("认证审核成功");
      }
    };


    /**
     *显示弹窗
     *
     * @param {*} [item] 当前企业申请
     */
    const showModal = (item?:any) => {
      state.visible = true;
      state.id = item.id;
      state.modalCompanyName = item.companyName;
      state.reason = "";
    };


    /**
     *详情
     *
     * @param {*} item 当前企业申请
     */
    const enterDetail = (item: any) => {
       router.push({ path: '/stPublic/application/certificationAudit/detail', query: { id: item.id } })
    }


    /**
     *分页
     *
     * @param {*} pagination 分页组件
     */
    const paginationChange = (pagination: any) => {
      let { total, current, pageSize } = pagination
      state.pagination = { total, current, pageSize };
      query();
    }


    /**
     *显示企业码
     *
     */
    const showCode=(item?:any)=>{
      state.id = item.id;
      state.code=item.identificationCode;
      state.modalCompanyName = item.companyName;
      state.isCode=true;
    };

    /**
     * 关闭企业码
     *
     */
    const cancelCode=()=>{
      state.isCode=false;
    }

    
    return {
      ...toRefs(state),
      approvalStatusOptions,
      handleSearch,
      showModal,
      cancel,
      ok,
      enterDetail,
      paginationChange,
      showCode,
      cancelCode,
    };
  },
});
