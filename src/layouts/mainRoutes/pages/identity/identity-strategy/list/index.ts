import request from "@/utils/axios";
import { useRouter } from "vue-router";
import { Modal, message } from "ant-design-vue";
import { defineComponent, toRefs, reactive, onMounted } from "vue";
import {getPopupContainer} from '@/hooks'
const columns = [
  {
    key: "ruleName",
    dataIndex: "ruleName",
    align: "center",
    title: "标识策略名称",
  },
  {
    key: "businessObjectCategoryName",
    dataIndex: "businessObjectCategoryName",
    align: "center",
    title: "对象分类",
  },
  {
    key: "ruleType",
    dataIndex: "ruleType",
    align: "center",
    title: "生码类型",
  },
  {
    key: "ruleDetail",
    dataIndex: "ruleDetail",
    align: "center",
    title: "标识规则",
  },
  {
    key: "codePreview",
    dataIndex: "codePreview",
    align: "center",
    title: "编码预览",
  },
  {
    key: "creator",
    dataIndex: "creator",
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
    key: "action",
    title: "操作",
    align: "center",
    dataIndex: "action",
    fixed: "right",
    width: 200,
  },
]; // 表格数据

const ruleTypeoptions = [
  {
    value: 1,
    label: "手动生码",
  },
  {
    value: 2,
    label: "自动生码",
  },
]; // 生码类型数据

export default defineComponent({
  setup() {
    const router = useRouter();
    const state = reactive({
      columns,
      dataSource: [],
      loading: true,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
      query: {
        ruleName: "",
        ruleType: undefined,
      },
      visible: false,
      ruleTypeoptions,
    });

    onMounted(() => pageQuery());

    /**
     * 删除数据
     * @param { Nummber } id 
     * @return
     */
    const deleteConfirm = (id: number) => {
      Modal.confirm({
        title: "删除后将不可恢复，请谨慎操作",
        content: "请确定是否删除?",
        onOk() {
          deleteRule(id);
        },
      });
    };


    /**
     * 路由跳转
     * @param { String } title 
     * @param { Number? } id 
     * @return
     */
    const showAction = (type: string, id?: number) => {
      router.push({
        path: "/identity/identityStrategyAction",
        query: { type, id }
      });
    };


    /**
     * 标识策略
     * @return
     */
    const pageQuery = async () => {
      state.loading = true;
      let {
        pagination: { current, pageSize },
        query: { ruleName, ruleType },
      } = state;
      let res: any = await request({
        url: import.meta.env.VITE_NODE_URL + "/rule/pageQuery",
        type: "json",
        method: "post",
        data: {
          pageNum: current,
          pageSize,
          ruleName,
          ruleType,
        },
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
    };


    /**
     * 删除生码规则
     * @param { Number } id 
     */
    const deleteRule = async (id: number) => {
      let res: any = await request({
        url: import.meta.env.VITE_NODE_URL + `/rule/delRule/${id}`,
        type: "json",
        method: "get",
      });
      if (res.code == 200) {
        pageQuery();
        message.success("生码规则删除成功");
      } else {
        message.error("生码规则删除失败");
      }
      console.log("删除生码规则", res);
    };


    /**
     * 分页查询
     * @param { Object } pagination 
     */
    const paginationChange = (pagination: any) => {
      let { current, pageSize, total } = pagination;
      state.pagination = { current, pageSize, total };
      pageQuery();
    };

    /**
     * 列表查询
     */
    const queryList = () => {
      state.pagination.current = 1
      pageQuery();
    }

    /**
     * 列表重置
     * @return
     */
    const reset = () => {
      state.query = {
        ruleName: "",
        ruleType: undefined,
      };
      queryList()
    };

    return {
      ...toRefs(state),
      showAction,
      deleteConfirm,
      queryList,
      reset,
      paginationChange,
      getPopupContainer,
    };

  },
});
