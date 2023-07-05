import { defineComponent, reactive } from 'vue'

const columns = [
    {
       key: 'mbmc',
       dataIndex: 'mbmc',
       align: 'center',
       title: '模板名称'
    },
    {
       key: 'fwwznl',
       dataIndex: 'fwwznl',
       align: 'center',
       title: '防伪文字内容'
    },
    {
       key: 'type',
       dataIndex: 'type',
       align: 'center',
       title: '类型'
    },
    {
       key: 'xscj',
       dataIndex: 'xscj',
       align: 'center',
       title: '显示场景'
    },
    {
       key: 'shzt',
       dataIndex: 'shzt',
       align: 'center',
       title: '审核状态'
    },
    {
       key: 'shsm',
       dataIndex: 'shsm',
       align: 'center',
       title: '审核说明'
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
export default defineComponent({
    setup() {
        const state = reactive({
            columns
        })

        return {
            ...state
        }
    }
})