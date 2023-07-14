import { defineComponent, reactive, toRefs, toRef,ref, onMounted, watch, computed } from "vue";
import service from "@/service/mainRoutes";
import { useRouter, useRoute } from "vue-router";
import { message } from "ant-design-vue";
const columns = [
  {
    dataIndex: "productName",
    key: "productName",
    align: "center",
    title: "产品名称",
    width: 200,
  },
  {
    dataIndex: "batchNo",
    key: "batchNo",
    align: "center",
    title: "批次编号",
  },
  {
    dataIndex: "action",
    key: "action",
    align: "center",
    title: "操作",
  },
];
const productFieldNames = {
  value: "id",
  label: "productName",
};
const batchFieldNames = {
  value: "id",
  label: "batchNo",
};
const regionFieldNames = {
  value: "id",
  label: "name",
};
const rules = {
  regin: [{ required: true, message: "请选择区域", trigger: "blur" }],
};
export default defineComponent({
  props: {},
  components: {},
  setup() {
    const router = useRouter();
    const route = useRoute();
    const formRef = ref();
    const state = reactive({
      id: route.query.id,
      formData: {} as any,
      search: {
        productId: null,
        batchId: null,
      },
      productOptions: [] as any,
      productFieldNames,
      batchOptions: [] as any,
      batchFieldNames,
      columns,
      leftPagination: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
      rightPagination:{
        total: 0,
        current: 1,
        pageSize: 10,
      },
      unbatchData: [] as any, 
      batchData: [] as any,
      filterData:[] as any,
      regionOptions: [] as any,
      regionFieldNames,
      lfLoading: false,
      rtLoading: false,
      rules,
    });

    onMounted(() => {
      init();
    });

    /**
     *初始化
     *
     */
    const init = () => {
      const { id } = state;
      if (id) {
        detailBatch();
      }
      queryProduct();
      queryBatch();
      queryUnbatch();
      queryRegion();
    };

    /**
     *详情
     *
     */
    const detailBatch = () => {
      const { id } = state;
      const { detailBatch } = service.securityAlarmReq;
      const params = {
        deployId: id,
      };
      state.rtLoading = true;
      detailBatch(params)
        .then((res: any) => {
          const { code, data } = res;
          if (code === 200) {
            state.formData = data;
            const {deployDetailStr}=data;
            state.batchData=deployDetailStr;
          }
          state.rtLoading = false;
        })
        .catch((e: any) => {
          console.error(e);
          state.rtLoading = false;
        });
    };

    // 过滤产品
    const productFilterOption = (input: string, option: any) => {
      return option.productName.indexOf(input) >= 0;
    };

    /**
     *查询产品下拉框
     *
     */
    const queryProduct = () => {
      const { queryProductList } = service.securityAlarmReq;
      queryProductList()
        .then((res: any) => {
          const { code, data } = res;
          if (code === 200) {
            state.productOptions = data;
          }
        })
        .catch((e: any) => {
          console.error(e);
        });
    };

    // 过滤批次
    const batchFilterOption = (input: string, option: any) => {
      return option.batchTitle.indexOf(input) >= 0;
    };

    /**
     *查询批次下拉框
     *
     */
    const queryBatch = () => {
      const { queryBatchList } = service.securityAlarmReq;
      queryBatchList()
        .then((res: any) => {
          const { code, data } = res;
          if (code === 200) {
            state.batchOptions = data;
          }
        })
        .catch((e: any) => {
          console.error(e);
        });
    };

    /**
     *select更新
     *
     */
    const handleChange = () => {
      queryUnbatch();
    };

    /**
     *新增
     *
     * @param {*} item
     */
    const handleAdd = (item: any) => {
      operateItem(state.unbatchData, state.batchData, item);
    };

    const filterData=computed(()=>{    
      const batchIds=state.batchData.map((item:any)=>item.batchId);
      const filterData=state.unbatchData.filter((item:any)=>!batchIds.includes(item.batchId)) // 未被绑定到右侧表格      
      return filterData;
    });

    /**
     *查询左侧未绑定批次
     *
     */
    const queryUnbatch = () => {
      const { queryUndeployBatch } = service.securityAlarmReq;
      const { search,id } = state;
      const params = {
        deployId:id,
        ...search,
      };
      state.lfLoading = true;
      queryUndeployBatch(params)
        .then((res: any) => {
          const { code, data } = res;
          if (code === 200) {
            state.unbatchData = data.filter((item:any)=>item);
          }
          state.lfLoading = false;
        })
        .catch((e: any) => {
          console.error(e);
          state.lfLoading = false;
        });
    };

    /**
     *分页
     *
     * @param {*} pagination 分页组件
     */
    const paginationChange = (pagination: any,flag:string) => {
      let { total, current, pageSize } = pagination;
      state[`${flag}Pagination`] = { total, current, pageSize };
    };

    // 监听左侧分页组件
    watch(
      () => [...filterData.value],
      (newVal: any, oldVal: any) => {
        updatePagination('left');
      },
    );

    // 监听右侧分页组件
    watch(
      () => [...state.batchData],
      (newVal: any, oldVal: any) => {
        updatePagination('right');
      },
    );

    /**
     *更新分页
     *
     */
    const updatePagination = (flag:string) => {
      let { current, pageSize } = state[`${flag}Pagination`];
      const {batchData}=state;
      const total =flag==='left'? filterData.value.length:batchData.length;
      state[`${flag}Pagination`] = { total, current, pageSize };
    };

    /**
     *查询区域
     *
     */
    const queryRegion = () => {
      const { queryRegionList } = service.securityAlarmReq;
      queryRegionList()
        .then((res: any) => {
          const { code, data } = res;
          if (code === 200) {
            state.regionOptions = data;
          }
        })
        .catch((e: any) => {
          console.error(e);
        });
    };

    /**
     *删除
     *
     * @param {*} item
     */
    const handleDel = (item: any) => {
      operateItem(state.batchData, state.unbatchData, item);
    };

    /**
     *批次穿梭
     *
     * @param {*} fromArr 移除的表格
     * @param {*} toArr 新增的表格
     * @param {*} item 操作的批次
     */
    const operateItem = (fromArr: any, toArr: any, item: any) => {
      const posFrom = fromArr.findIndex((batch: any) => batch.batchId === item.batchId);
      const posTo=toArr.findIndex((batch: any) => batch.batchId === item.batchId);
      if (posFrom >= 0) {
        fromArr.splice(posFrom, 1);
      }
      if(posTo<0){
        toArr.push(item);
      }
    };

    /**
     *格式化提交批次数据
     *
     * @param {*} data 批次数据
     * @return {*} 
     */
    const formatBatchData=(data:any)=>{
      if(Array.isArray(data)){
        const batchData=data.map((item:any)=>{
          const {batchId,batchNo,productId,productName}=item;
          return {
            batchId,
            batchNo,
            productId,
            productName,
          }
        });
        return batchData;
      }
      return [];
    }

    /**
     *提交
     *
     */
    const submit = () => {
      if(!validate()){
        return;
      }
      const { id, batchData,formData } = state;
        const operate = id ? "editBatch" : "addBatch"; // 添加 | 修改
        const params = {
          ...formData,
          deployDetailParamList: formatBatchData(batchData),
          id,
        };
        const { securityAlarmReq } = service;
        state.rtLoading = true;
        console.log("----submit------", params);
        securityAlarmReq[operate](params)
          .then((res: any) => {
            const { code } = res;
            if (code === 200) {
              message.success("操作成功！");
              back();
            }
            state.rtLoading = false;
          })
          .catch((e: any) => {
            console.error(e);
            state.rtLoading = false;
          });
    };

    /**
     *校验
     *
     */
    const validate=()=>{
      const {formData,batchData}=state;
      if(!formData.regionId){
        message.error("请选择区域！");
        return false;
      }

      if(batchData.length<=0){
        message.error("请选择要分配的批次！");
        return false;
      }

      return true;
    }

    /**
     *返回
     *
     */
    const back = () => {
      router.back();
    };
    
    return {
      ...toRefs(state),
      formRef,
      filterData,
      productFilterOption,
      batchFilterOption,
      handleChange,
      handleAdd,
      handleDel,
      paginationChange,
      back,
      submit,
    };
  },
});
