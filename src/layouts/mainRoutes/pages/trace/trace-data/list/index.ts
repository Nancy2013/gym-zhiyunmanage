import { useAction } from "@/hooks";
import { defineComponent, reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
// 表格数据
const columns = [
    {
        key: 'name',
        dataIndex: 'name',
        align: 'center',
        title: '流程名称'
    },
    {
        key: 'objectName',
        dataIndex: 'objectName',
        align: 'center',
        title: '对象名称'
    },
    {
        key: 'creater',
        dataIndex: 'creater',
        align: 'center',
        title: '创建人'
    },
    {
        key: 'createTime',
        dataIndex: 'createTime',
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
// 表格数据
const dataSource = [
    {
        name: '石台香芽',
        objectName: '石台香芽等级',
        creater: '1233',
        createTime: '2022-08-05 15:47:33'
    }
]
export default defineComponent({
    setup() {
        const router = useRouter();
        const state = reactive({
            columns,
            dataSource
         })
         const showAction = () => {
            router.push({ path: '/trace/traceDataEdit' })
         }
         return {
           ...toRefs(state),
           showAction
         }
    }
})