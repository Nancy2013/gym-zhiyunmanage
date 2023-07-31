import { defineComponent, reactive, toRef,toRefs,onMounted } from "vue";
import { usePage } from './../../composables/usePage';
import moment from 'moment';
import service from '@/service/mainRoutes'
import { RenderFormItem } from '@/components/tsx/form'

export const searchRenderList: RenderFormItem[] = [
	{
		label: '区域名称',
		key: 'name',
		type: 'input',
		placeholder: '区域名称'
  },
  {
		label: '省份',
		key: 'province',
		type: 'select',
    placeholder: '请选择省份',
    options: []
	},
	{
		label: '创建人',
		key: 'creatorName',
		type: 'input',
		placeholder: '创建人'
  },
]

const columns = [
  {
    dataIndex: "tableIndex",
    key: "tableIndex",
    title: "序号",
    width: 70,
  },
  {
    dataIndex: "name",
    key: "name",
    title: "区域名称",
  },
  {
    dataIndex: "province",
    key: "province",
    align: "center",
    title: "省份",
    width:200,
    ellipsis: true,
  },
  {
    dataIndex: "city",
    key: "city",
    align: "center",
    title: "城市",
    width:300,
    ellipsis: true,
  },
  {
    dataIndex: "tenantName",
    key: "tenantName",
    align: "center",
    title: "所属企业",
    width: 140
  },
  {
    dataIndex: "createUserName",
    key: "createUserName",
    align: "center",
    title: "创建人",
    width: 140
  },
  {
    dataIndex: "createdTime",
    key: "createdTime",
    align: "center",
    title: "创建时间",
    width: 140
  },
  {
    dataIndex: "action",
    key: "action",
    align: "center",
    title: "操作",
    fixed: "right",
    width: 200,
  },
]
const fieldNames = {
  value: "name",
  label: "name",
};
export default defineComponent({
  props: {},
  components: {},
  setup() {
    const state = reactive({
      data:[] as any,
      search:{
        name:'',
        creatorName:'',
        province:null,
      },
      columns,
      searchRenderList,
      moment,
      options:[]as any,
      fieldNames,
    });

    const search=toRef(state,'search');
    const opts={
      queryApi:'queryRegion',
      delApi:'delRegion',
      addPath:'/securityAlarm/regionSet/add',
      search,
    };
    const {dataSource,loading,pagination, handleSearch,jump,handleDel,paginationChange,handleFresh,}=usePage(opts);

    onMounted(() => {
      getAddressTree();
    });
     /**
     *查询tree
     *
     */
     const getAddressTree = () => {
      const { getAddressTree } = service.securityAlarmReq;
      getAddressTree()
        .then((res: any) => {
          const { code, data } = res;
          if (code === 200) {
            state.searchRenderList[1].options = data.map((item: any) =>({value:item.name,label:item.name}));
          }
        })
        .catch((e: any) => {
          console.error(e);
        });
    };
    
    /**
     *重置
     *
     */
    const reset=()=>{
      state.search={
        name:'',
        creatorName:'',
        province:null,
      };
    }
    return {
      ...toRefs(state),
      dataSource,
      loading,
      handleSearch,
      jump,
      handleDel,
      pagination,
      paginationChange,
      handleFresh,
      reset,
    };
  },
});
