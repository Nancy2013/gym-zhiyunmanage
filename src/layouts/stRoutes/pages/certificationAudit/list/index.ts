import { defineComponent, onMounted, reactive, toRefs, watch } from "vue";
import { Modal, message } from "ant-design-vue";
import request from "@/utils/axios";
import { useRoute, useRouter } from "vue-router";
import { useAction } from "@/hooks";
import {certificationStatus} from "@/utils/dict";
import audit from '@/assets/image/audit.png'
import {showTime} from '@/utils/function'
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
    key: "tenantName",
    dataIndex: "tenantName",
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
    key: "plantArea",
    dataIndex: "plantArea",
    align: "center",
    title: "种植面积(亩)",
    width: 200,
  },
  {
    key: "annualOutput",
    dataIndex: "annualOutput",
    align: "center",
    title: "年产量(kg)",
    width: 200,
  },
  {
    key: "productNum",
    dataIndex: "productNum",
    align: "center",
    title: "产线数",
    width: 200,
  },
  {
    key: "contact",
    dataIndex: "contact",
    align: "center",
    title: "联系人",
    width: 200,
  },
  {
    key: "contactPhone",
    dataIndex: "contactPhone",
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

  Object.keys(certificationStatus).forEach(status=>{
    options.push({
      label:certificationStatus[status]||status,
      value:status
    });
  })

  return options;
}

export default defineComponent({
  setup() {
    const router = useRouter()
    const storeAction = useAction('stModule',['asyncUpdateIsStBreamub',])
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
        keyWords: "",
        approvalStatus: "",
      },
      visible: false,
      formData:{
        id: "",
        tenantName:'',
        reason: "",
        enterpriseCode:'',
      },
      isCode:false,
      audit,
    });

    onMounted(() => {
      query();
      const { asyncUpdateIsStBreamub } = storeAction
      asyncUpdateIsStBreamub({isStBreamub: true})
    });

    // 查询
    const query = async () => {
      state.loading = true
      let { pagination: { pageSize, current }, search: { keyWords, approvalStatus } } = state
      const params={
        pageNum:current,
        pageSize,
        approveStatus:approvalStatus,
        keyWords,
      };
      let res: any = await request({
        url: `${import.meta.env.VITE_XICHA_URL}/auth/page-query`,
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
      const {reason,id}=state.formData;
      if (reason) {
        const params={ id, approve: 3,reason }    
        let res: any = await request({
          url:`${import.meta.env.VITE_XICHA_URL}/auth/approve`,
          type: "json",
          method: "post",
          data:params,
        });
        const {code}=res
        if (code == 200) {
          query();
          hideModal();
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
      const {id}=state.formData;
      const params={ id, approve: 2, }
      let res: any = await request({
        url:`${import.meta.env.VITE_XICHA_URL}/auth/approve`,
        type: "json",
        method: "post",
        data:params,
      });
      const {code}=res
      if (code == 200) {
        query();
        hideModal();
        message.success("认证审核成功");
      }
    };


    /**
     *显示弹窗
     *
     * @param {*} [item] 当前企业申请
     */
    const showModal = (item:any,flag:string) => {
      state[`${flag}`] = true;
      state.formData={
        ...item,
        reason:'',
      };
    };
     
    /**
     * 关闭弹窗
     */
    const hideModal=()=>{
      state.visible = false;
      state.isCode = false;
    };

    /**
     * 关闭弹窗后事件
     */
    const handleClose = () => {
      state.formData={} as any;
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

    
    return {
      ...toRefs(state),
      certificationStatus,
      handleSearch,
      showModal,
      cancel,
      ok,
      enterDetail,
      paginationChange,
      hideModal,
      showTime,
      handleClose,
    };
  },
});
