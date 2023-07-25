import { useAction } from "@/hooks";
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
import request from "@/utils/axios";

// 表格数据
const columns = [
    {
        key: 'processName',
        dataIndex: 'processName',
        align: 'center',
        title: '流程名称'
    },
    {
        key: 'remark',
        dataIndex: 'remark',
        align: 'center',
        title: '流程说明'
    },
    {
        key: 'productName',
        dataIndex: 'productName',
        align: 'center',
        title: '产品名称'
    },
    {
        key: 'productCount',
        dataIndex: 'productCount',
        align: 'center',
        title: '产品数'
    },
    {
        key: 'updater',
        dataIndex: 'updater',
        align: 'center',
        title: '更新人'
    },
    {
        key: 'updatedTime',
        dataIndex: 'updatedTime',
        align: 'center',
        title: '更新时间'
    },
    {
        key: 'creator',
        dataIndex: 'creator',
        align: 'center',
        title: '创建人'
    },
    {
        key: 'createdTime',
        dataIndex: 'createdTime',
        align: 'center',
        title: '创建时间'
    },
    {
        key: 'action',
        title: '操作',
        align: 'center',
        dataIndex: 'action',
        width: 200
    }
]

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
                pageSize: 10
            },
            query: {
                condition: ''
            }
         })

         onMounted(() => {
             getTraceDataList();
         })

         const showAction = () => {
            router.push({ path: '/trace/traceDataAction' })
         }

         /**
          * 查询溯源数据列表
          * @param
          * @return
          */
         const getTraceDataList = async () => {
            state.loading = true;
            let {
                pagination: { current, pageSize },
                query: { condition }
            } = state;
            let res = await request({
                url: import.meta.env.VITE_NODE_URL + "/trace/data/page",
                type: "json",
                method: "post",
                data: {
                    pageNum: current,
                    pageSize,
                    condition
                }
            })
            if(res.code == 200) {
                state.loading = false;
                state.pagination = {
                    total: res.total,
                    current,
                    pageSize
                }
                state.dataSource = res.rows;
            }
         }

         return {
           ...toRefs(state),
           showAction
         }
    }
})