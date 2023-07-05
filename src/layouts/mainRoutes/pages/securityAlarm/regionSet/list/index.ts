import { defineComponent, reactive, toRef,toRefs,onMounted } from "vue";
import { usePage } from './../../composables/usePage';
import moment from 'moment';
import service from '@/service/mainRoutes'
const columns = [
  {
    dataIndex: "index",
    key: "index",
    align: "center",
    title: "序号",
    width: 70,
  },
  {
    dataIndex: "name",
    key: "name",
    align: "center",
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
  },
  {
    dataIndex: "createUserName",
    key: "createUserName",
    align: "center",
    title: "创建人",
  },
  {
    dataIndex: "createdTime",
    key: "createdTime",
    align: "center",
    title: "创建时间",
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
    const {dataSource,loading,pagination, handleSearch,edit,add,handleDel,paginationChange,handleFresh,}=usePage(opts);

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
            state.options = data.map((item: any) =>({id:item.id,name:item.name}));
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
      edit,
      add,
      handleDel,
      pagination,
      paginationChange,
      handleFresh,
      reset,
    };
  },
});
