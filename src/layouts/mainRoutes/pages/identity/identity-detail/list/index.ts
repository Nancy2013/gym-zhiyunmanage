import dayjs from "dayjs";
import request from "@/utils/axios";
import { useRouter } from "vue-router";
import { defineComponent, toRefs, reactive, onMounted, ref } from "vue";
import { getPopupContainer } from '@/hooks'
import { RenderFormItem } from '@/components/tsx/form'

const statusOptions = [
  {
    value: 1,
    label: "已创建",
  },
  {
    value: 2,
    label: "已同步",
  },
  {
    value: 3,
    label: "同步失败",
  },
]; // 状态数据

const searchRenderList: RenderFormItem[] = [
	{
		label: '工业标识/对象名称',
		key: 'idisCodeOrBoName',
		type: 'input',
		placeholder: '工业标识/对象名称'
  },
  {
		label: '状态',
		key: 'syncStatus',
		type: 'select',
    placeholder: '请选择状态',
    options: statusOptions
  },
  {
    label: '时间区间',
    key: 'rangeTime',
    type: 'datePicker',
    datePickerType: 'rangePicker'
  }
]
const columns = [
  {
    key: "idisCode",
    dataIndex: "idisCode",
    align: "center",
    title: "工业标识",
  },
  {
    key: "checkCode",
    dataIndex: "checkCode",
    align: "center",
    title: "防伪码",
  },
  {
    key: "syncStatus",
    dataIndex: "syncStatus",
    align: "center",
    title: "同步状态",
  },
  {
    key: "businessObjectCategoryName",
    dataIndex: "businessObjectCategoryName",
    align: "center",
    title: "对象分类",
    width: 120
  },
  {
    key: "boName",
    dataIndex: "boName",
    align: "center",
    title: "对象名称",
    width: 120
  },
  {
    key: "createdTime",
    dataIndex: "createdTime",
    align: "center",
    title: "创建时间",
    width: 140
  },
  {
    key: "action",
    title: "操作",
    align: "center",
    dataIndex: "action",
    width: 120,
    fixed: "right",
  },
]; // 表格数据

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
      searchRenderList,
      query: {
        idisCodeOrBoName: "",
        syncStatus: undefined,
        rangeTime: ref<any[]>([]),
      },
      statusOptions,
    });

    onMounted(() => {
      init();
    });

    /**
     * 初始化
     */
    const init = () => {
      codePage();
    };

    /**
     * 标识明细
     * @param
     * @return
     */
    const codePage = async () => {
      state.loading = true;
      let {
        pagination: { current, pageSize },
        query: { idisCodeOrBoName, syncStatus, rangeTime },
      } = state;
      const params: any = {
        pageNum: current,
        pageSize,
        idisCodeOrBoName,
        syncStatus,
      }
      if (Array.isArray(rangeTime) && rangeTime.length) {
        params.startTime = `${dayjs(rangeTime[0]).format("YYYY-MM-DD")} 00:00:00`
        params.endTime = `${dayjs(rangeTime[1]).format("YYYY-MM-DD")} 23:59:59`
      }
      let res: any = await request({
        url: import.meta.env.VITE_NODE_URL + "/code/page",
        type: "json",
        method: "post",
        data: params,
      });
      if (res.code == 200) {
        state.loading = false;
        state.dataSource = res.rows;
        state.pagination = {
          total: res.total,
          current,
          pageSize,
        };
      } else {
        state.loading = false;
      }
    };

    /**
     * 时间区间处理
     * @param { Moment } value
     * @param { Array } dateString
     * @return
     */
    const rangeDateChange = (value: any, dateString: any) => {
      state.query.rangeTime = value;
    };

    /**
     * 分页查询
     * @param { Object } pagination
     * @return
     */
    const paginationChange = (pagination: any) => {
      let { current, pageSize, total } = pagination;
      state.pagination = { current, pageSize, total };
      codePage();
    };

    /**
     * 路由跳转
     * @param { String } idisCode
     * @return
     */
    const showInfo = (idisCode: string) => {
      router.push({
        path: "/identity/identityDetailInfo",
        query: { idisCode },
      });
    };

    /**
     * 列表查询
     * @return
     */
    const queryList = () => {
      state.pagination.current = 1; // 重置页数
      codePage();
    };

    /**
     * 列表重置
     * @return
     */
    const reset = () => {
      state.query = {
        idisCodeOrBoName: "",
        syncStatus: undefined,
        rangeTime: [],
      };
      queryList();
    };

    return {
      ...toRefs(state),
      queryList,
      paginationChange,
      rangeDateChange,
      showInfo,
      reset,
      getPopupContainer,
    };
  },
});
