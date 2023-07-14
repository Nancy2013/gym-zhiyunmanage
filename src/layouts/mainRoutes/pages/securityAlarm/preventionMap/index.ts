import { defineComponent, reactive, toRefs, onMounted } from "vue";
import service from "@/service/mainRoutes";
import Mapview from "@/layouts/mainRoutes/pages/securityAlarm/components/map/index.vue";
import {sendTime} from '@/utils/function'
const productFieldNames = {
  value: "id",
  label: "productName",
};
const batchFieldNames = {
  value: "id",
  label: "batchNo",
};
export default defineComponent({
  props: {},
  components: {
    Mapview,
  },
  setup() {
    const state = reactive({
      search: {
        productId: null,
        batchId: null,
        time: [],
      },
      data:  [] as any,
      loading: true,
      productOptions: [] as any,
      productFieldNames,
      batchOptions: [] as any,
      batchFieldNames,
    });

    onMounted(() => {
      init();
    });

    /**
     *初始化
     *
     */
    const init = () => {
      query();
      queryProduct();
      queryBatch();
    };

    /**
     *查询
     *
     */
    const query = () => {
      const { productId, batchId, time } = state.search;
      const [beginTime, endTime] = time||[];
      const params = {
        productId,
        batchId,
        beginTime: beginTime?sendTime(beginTime,'startOf'):'',
        endTime: endTime?sendTime(endTime,'endOf'):'',
      };
      const { queryRecordCoord } = service.securityAlarmReq;
      queryRecordCoord(params)
        .then((res: any) => {
          const { code, data } = res;
          if (code === 200) {
            const { securityRecord } = data;
            state.data = securityRecord.map((item:any)=>({
              lng:item.longitude,
              lat:item.latitude,
            }));
          }
          state.loading = false;
        })
        .catch((e: any) => {
          console.error(e);
          state.loading = false;
        });
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

    // 过滤产品
    const productFilterOption = (input: string, option: any) => {
      return option.productName.indexOf(input) >= 0;
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

     // 过滤批次
     const batchFilterOption = (input: string, option: any) => {
      return option.batchTitle.indexOf(input) >= 0;
    };

    /**
     *搜索
     *
     */
    const handleSearch = () => {
      query();
    };

    /**
     *重置
     *
     */
    const reset = () => {
      state.search = {
        productId: null,
        batchId: null,
        time: [],
      };
    };
    return {
      ...toRefs(state),
      handleSearch,
      reset,
      productFilterOption,
      batchFilterOption,
    };
  },
});
