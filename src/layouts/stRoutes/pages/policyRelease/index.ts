import { defineComponent, onMounted, reactive, toRefs } from "vue";
import { useRoute } from "vue-router";
import { useAction } from "@/hooks";
// 表格数据
const columns = [
  {
    key: "title",
    dataIndex: "title",
    align: "center",
    title: "政策标题"
  },
  {
    key: "createUser",
    dataIndex: "createUser",
    align: "center",
    title: "创建人"
  },
  {
    key: "shzt",
    dataIndex: "shzt",
    align: "center",
    title: "审核状态"
  },
  {
    key: "action",
    title: "操作",
    align: "center",
    dataIndex: "action",
    fixed: 'right',
    width: 200,
  }
]
const dataSource = [
  {
    title: '石台丁香:春茶采摘忙，茶香促振兴',
    createUser: '张三',
    fbsj: '2001.08.1010:02:39',
    shzt: 1
  },
  {
    title: '安徽石台县再获“中国天然氧吧”称号',
    createUser: '孙丽丽',
    fbsj: '2001.08.1010:02:39',
    shzt: 2
  }, 
  {
    title: '石台丁香:春茶采摘忙，茶香促振兴',
    createUser: '李想',
    fbsj: '2001.08.1010:02:39',
    shzt: 3
  },
  {
    title: '油坊店乡:“三化”茶园展新颜“两强一增”促振兴',
    createUser: '陈国伟',
    fbsj: '2001.08.1010:02:39',
    shzt: 3
  }
]
export default defineComponent({
  setup() {
    const route = useRoute()
    const storeAction = useAction('stModule', ['asyncUpdateIsStBreamub', 'asyncUpdateApprovalStatus', 'asyncUpdateStSelectedKeys'])
    const state = reactive({
      columns,
      dataSource
    })
    const convertStatus = (state: number) => {
      let value: string = ''
      switch (state) {
        case 1: value = '待审核'; break;
        case 2: value = '已通过'; break;
        case 3: value = '已驳回'; break;
        default: break;
      }
      return value
    }
    onMounted(() => {
      const { asyncUpdateIsStBreamub, asyncUpdateApprovalStatus, asyncUpdateStSelectedKeys } = storeAction
      asyncUpdateIsStBreamub({isStBreamub: true})
      asyncUpdateApprovalStatus({approvalStatus: 3})
      asyncUpdateStSelectedKeys({stSelectedKeys: [route.path]})
    })
    return {
      ...toRefs(state),
      convertStatus
    }
  }
})