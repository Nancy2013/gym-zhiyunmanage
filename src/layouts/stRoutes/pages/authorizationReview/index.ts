import { defineComponent, reactive, toRefs, onMounted } from "vue";
import { Modal, message } from "ant-design-vue";
import request from "@/utils/axios";
import { useRoute } from "vue-router";
import { useAction } from "@/hooks";
// 表格数据
const columns = [
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
    key: "applicant",
    dataIndex: "applicant",
    align: "center",
    title: "申请人",
    width: 200,
  },
  {
    key: "phone",
    dataIndex: "phone",
    align: "center",
    title: "负责人手机号",
    width: 200,
  },
  {
    key: "applyCount",
    dataIndex: "applyCount",
    align: "center",
    title: "申请码量",
    width: 200,
  },
  {
    key: "brand",
    dataIndex: "brand",
    align: "center",
    title: "申请品牌",
    width: 200,
  },
  {
    key: "createTime",
    dataIndex: "createTime",
    align: "center",
    title: "申请时间",
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
    key: "actualCount",
    dataIndex: "actualCount",
    align: "center",
    title: "授权码量",
    width: 200,
  },
  {
    key: "updateTime",
    dataIndex: "updateTime",
    align: "center",
    title: "授权时间",
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
const statusOptions = [
  {
    label: "审核状态",
    value: "",
  },
  {
    label: "待审核",
    value: 0,
  },
  {
    label: "已通过",
    value: 1,
  },
  {
    label: "已驳回",
    value: 2,
  },
];
export default defineComponent({
  setup() {
    const route = useRoute();
    const storeAction = useAction('stModule', ['asyncUpdateIsStBreamub', 'asyncUpdateApprovalStatus', 'asyncUpdateStSelectedKeys'])
    const state = reactive({
      columns,
      dataSource: [],
      loading: true,
      pagination: {
        total: 0,
        current: 1,
        limit: 10
      },
      statusOptions,
      query: {
        condition: "",
        applyCodeCount: "",
        acturalCodeCount: "",
        status: "",
      },
      visible: false,
      id: "",
      actualCount: "",
      reason: "",
      brand: "",
      applyCount: "",
      type: '',
      selectedRowKeys: []
    });
    const convertStatus = (status: number) => {
      let value: string = "";
      switch (status) {
        case 0:
          value = "待审核";
          break;
        case 1:
          value = "已通过";
          break;
        case 2:
          value = "已驳回";
          break;
        default:
          break;
      }
      return value;
    };

    // 码量申请查询
    const queryAuthorization = async () => {
      state.loading = true
      let { pagination: { limit, current }, query: { condition, applyCodeCount, acturalCodeCount, status } } = state
      let res: any = await request({
        baseURL: "/fcapi",
        url: "/tea/auth/pageCodeApplication",
        type: "json",
        method: "post",
        data: { limit, page: current, condition, applyCodeCount, acturalCodeCount, status },
      });
      if (res.data.code == 0) {
        let { data, count } = res.data
        state.dataSource = data;
        state.loading = false;
        state.selectedRowKeys = [];
        state.pagination = {
          total: count,
          current,
          limit
        };
      }
    };

    // 更新码量申请 (单个)
    const updateCodeApplication = async (data: any) => {
      let res: any = await request({
        baseURL: "/fcapi",
        url: "/tea/auth/updateCodeApplication",
        type: "json",
        method: "post",
        data,
      });
      if (res.data.code == 200) {
        queryAuthorization();
        state.visible = false;
      }
    };

    // 复选框操作
    const rowSelection = {
      onChange: (selectedRowKeys: any) => {
        state.selectedRowKeys = selectedRowKeys
      },
      getCheckboxProps: (record: any) => ({
        disabled: record.status != 0,
        // name: record.approvalStatus,
      })
    }

    // 更新码量申请 （多个）
    const updateCodeApplicationAll = async (data: any) => {
      let res: any = await request({
       baseURL: "/fcapi",
       url: "/tea/auth/processCodeApplicationBatch",
       type: "json",
       method: "post",
       data,
      })
      if(res.data.code == 200) {
        queryAuthorization();
       state.visible = false;
      }
   }

    // 点击查询
    const clickQuery = () => {
      state.pagination.current = 1;
      queryAuthorization();
    };

    // 驳回
    const cancel = () => {
      if (state.reason) {
        switch(state.type) {
           case 'each': updateCodeApplication({
            id: state.id,
            status: 2,
            reason: state.reason,
          }); break;
          case 'all': updateCodeApplicationAll({
            ids:state.selectedRowKeys, approvalStatus: 2, reason: state.reason 
          }); break;
        }
        message.success("审核已驳回");
      } else {
        message.error("请填写驳回原因");
      }
    };

    // 认证通过
    const ok = () => {
      if (state.actualCount) {
        switch(state.type) {
          case 'each': updateCodeApplication({
            id: state.id,
            status: 1,
            actualCount: state.actualCount,
          }); break;
          case 'all':  updateCodeApplicationAll({
            ids:state.selectedRowKeys, approvalStatus: 1,
            actualCount: state.actualCount
          }); break;
        }
        
        message.success("审核已通过");
      } else {
        message.error("请输入实际可授权码量");
      }
    };

    // 弹出弹框
    const showModal = (type: string, item?:any) => {
      state.visible = true;
      state.type = type;
      if(type == 'each') {
        state.id = item.id;
        state.brand = item.brand;
        state.applyCount = item.applyCount;
      } else {
        state.id = '';
        state.brand = '';
        state.applyCount = '';
      }
      state.reason = '';
      state.actualCount = '';
    };

    // 驳回原因
    const reasonModal = (item:any) => {
      const modal = Modal.error({});
      modal.update({
        title: "驳回原因",
        content: item.reason,
        okText: "确认",
      });
    };

    // 分页查询
    const paginationChange = (pagination: any) => {
      let { total, current, limit } = pagination
      state.pagination = { total, current, limit };
      queryAuthorization();
    } 

    onMounted(() => {
      queryAuthorization();
      const { asyncUpdateIsStBreamub, asyncUpdateApprovalStatus, asyncUpdateStSelectedKeys } = storeAction
      asyncUpdateIsStBreamub({ isStBreamub: true })
      asyncUpdateApprovalStatus({ approvalStatus: 3 })
      asyncUpdateStSelectedKeys({ stSelectedKeys: [route.path] })
    });

    return {
      ...toRefs(state),
      convertStatus,
      clickQuery,
      showModal,
      cancel,
      ok,
      reasonModal,
      rowSelection,
      paginationChange
    };
  },
});
