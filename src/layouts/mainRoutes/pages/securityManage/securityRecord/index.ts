import { defineComponent, reactive } from 'vue'

const columns = [
    {
        key: 'gybs',
        dataIndex: 'gybs',
        align: 'center',
        title: '工业标识'
    },
    {
        key: 'dxmc',
        dataIndex: 'dxmc',
        align: 'center',
        title: '对象名称'
    },
    {
        key: 'dxpc',
        dataIndex: 'dxpc',
        align: 'center',
        title: '对象批次'
    },
    {
        key: 'wxnc',
        dataIndex: 'wxnc',
        align: 'center',
        title: '微信昵称'
    },
    {
        key: 'cydz',
        dataIndex: 'cydz',
        align: 'center',
        title: '查验地址'
    },
    {
        key: 'address',
        dataIndex: 'address',
        align: 'center',
        title: 'IP地址'
    },
    {
        key: 'time',
        dataIndex: 'time',
        align: 'center',
        title: '查验时间'
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