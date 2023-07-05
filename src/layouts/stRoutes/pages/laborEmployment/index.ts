import { defineComponent, onMounted, reactive, toRefs } from "vue";
import upIcon from '@/assets/image/upIcon.png';
import downIcon from '@/assets/image/downIcon.png';
import { useRoute } from "vue-router";
import { useAction } from "@/hooks";
// 卡片数据
const cardsList = [
    {
        name: '参与企业数量',
        count: 10000,
        roate: '31%',
        progress: '80%',
        yrzCount: 90,
        drzCount: 10,
        icon: downIcon,
        color: '#FF903F'
    },
    {
        name: '参与茶园工',
        count: 82000,
        roate: '29%',
        progress: '50%',
        yrzCount: 700,
        drzCount: 100,
        icon: upIcon,
        color: '#629B88'
    },
    {
        name: '参与包装工',
        count: 1000,
        roate: '13%',
        progress: '70%',
        yrzCount: 1000,
        icon: upIcon,
        color: '#629B88'
    }
]
// 表格数据
const columns = [
    {
      key: "lwgdbh",
      dataIndex: "lwgdbh",
      align: "center",
      title: "劳务工单编号"
    },
    {
      key: "qyjc",
      dataIndex: "qyjc",
      align: "center",
      title: "企业简称"
    },
    {
      key: "ygxq",
      dataIndex: "ygxq",
      align: "center",
      title: "用工需求"
    },
    {
      key: "fbr",
      dataIndex: "fbr",
      align: "center",
      title: "发布人"
    },
    {
      key: "fbsj",
      dataIndex: "fbsj",
      align: "center",
      title: "发布时间"
    },
    {
      key: "ypr",
      dataIndex: "ypr",
      align: "center",
      title: "应聘人"
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
         key: 1,
         lwgdbh:'20180119009900',
         qyjc:'石台西黄山',
         ygxq:'招聘茶园工',
         fbr:'赵刚',
         fbsj:'2001.08.1010:02:39',
         ypr:'张三',
         shzt:1
       },
       {
        key: 2,
        lwgdbh:'20180119009911',
        qyjc:'玄武湖茶厂',
        ygxq:'招聘产茶工',
        fbr:'赵刚',
        fbsj:'2001.08.1010:02:39',
        ypr:'孙丽丽',
        shzt:2
      },
      {
        key: 3,
        lwgdbh:'20180119009912',
        qyjc:'中茶',
        ygxq:'招聘茶园工',
        fbr:'赵刚',
        fbsj:'2001.08.1010:02:39',
        ypr:'李想',
        shzt:2
      },
      {
        key: 4,
        lwgdbh:'20180119009913',
        qyjc:'天福茗茶',
        ygxq:'招聘包装工',
        fbr:'赵刚',
        fbsj:'2001.08.1010:02:39',
        ypr:'陈国伟',
        shzt:3
      }
    ]
export default defineComponent({
    setup() {
        const route = useRoute()
        const storeAction = useAction('stModule',['asyncUpdateIsStBreamub', 'asyncUpdateApprovalStatus', 'asyncUpdateStSelectedKeys'])
        const state = reactive({
            cardsList,
            columns,
            dataSource
        })
        const convertStatus = (state: number) => {
            let value: string = ''
            switch(state) {
                case 1: value = '待审核'; break;
                case 2: value = '已通过'; break;
                case 3: value = '已驳回'; break;
                default:break;
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