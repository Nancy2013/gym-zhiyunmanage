import { defineComponent, reactive, toRefs } from "vue";
import configTree from '@/components/configTree';
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

// 树形数据
const treeData = [
    {
        title: '流程',
        parent: 0,
        key: '0'
    }
]

export default defineComponent({
    components: {
        configTree
    },
    setup() {
       const state = reactive({
          title: '',
          columns,
          dataSource,
          visible: false,
          formState: {
            lcmc: '',
            object: undefined,
            bzmc: ''
          },
          rules: {
            lcmc: [
                { required: true, message: '请输入流程名称', trigger: 'blur' }
            ],
            object: [
                { required: true, message: '请选择对象', trigger: 'change' }
            ]
          },
          treeData
       })
       // 打开不同弹框
       const showModal = (title: string) => {
          state.title = title
          state.visible = true
       } 
       return {
         ...toRefs(state),
         showModal,
         labelCol: { span: 6 },
         wrapperCol: { span: 14 },
       }
    }
})