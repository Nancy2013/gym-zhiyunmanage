import { defineComponent, onMounted } from "vue";
import messageAlbrumIcon from "@/assets/image/messageAlbrumIcon.png";
import messageUserIcon from "@/assets/image/messageUserIcon.png";
import { useRoute } from "vue-router";
import { useAction } from "@/hooks";
import { Pagination } from 'ant-design-vue'
interface DataItem {
  type: number;
  title: string;
  time: string;
  description: string;
  icon: string;
}
const data: DataItem[] = [
  {
    type: 1, // 1: 认证审核，2: 茶园确权，3：授权审核
    title: "你有新的审核消息, 请查看",
    time: "2001.08.10 10:02:39",
    description: "",
    icon: messageUserIcon,
  },
  {
    type: 2,
    title: "你有新的审核消息, 请查看",
    time: "2001.08.10 10:02:39",
    description: "",
    icon: messageUserIcon,
  },
  {
    type: 3,
    title: "你有新的审核消息, 请查看",
    time: "2001.08.10 10:02:39",
    description: "",
    icon: messageUserIcon,
  },
  {
    type: 3,
    title: "你有新的审核消息, 请查看",
    time: "2001.08.10 10:02:39",
    description:
      "消息正文：系统更新，更新内容为1、整体交互优化，优化用户体验；2、新增功能销售报表分析",
    icon: messageAlbrumIcon,
  },
  {
    type: 3,
    title: "你有新的审核消息, 请查看",
    time: "2001.08.10 10:02:39",
    description: "",
    icon: messageUserIcon,
  },
  {
    type: 3,
    title: "你有新的审核消息, 请查看",
    time: "2001.08.10 10:02:39",
    description: "",
    icon: messageUserIcon,
  },
  {
    type: 3,
    title: "你有新的审核消息, 请查看",
    time: "2001.08.10 10:02:39",
    description: "",
    icon: messageAlbrumIcon,
  },
  {
    type: 3,
    title: "你有新的审核消息, 请查看",
    time: "2001.08.10 10:02:39",
    description: "",
    icon: messageAlbrumIcon,
  },
  {
    type: 3,
    title: "你有新的审核消息, 请查看",
    time: "2001.08.10 10:02:39",
    description: "",
    icon: messageAlbrumIcon,
  },
  {
    type: 3,
    title: "你有新的审核消息, 请查看",
    time: "2001.08.10 10:02:39",
    description: "",
    icon: messageAlbrumIcon,
  },
  {
    type: 3,
    title: "你有新的审核消息, 请查看",
    time: "2001.08.10 10:02:39",
    description: "",
    icon: messageUserIcon,
  },
  {
    type: 3,
    title: "你有新的审核消息, 请查看",
    time: "2001.08.10 10:02:39",
    description: "",
    icon: messageUserIcon,
  },
];
export default defineComponent({
  components: {
    Pagination
  },
  setup() {
    const route = useRoute();
    const storeAction = useAction('stModule', ['asyncUpdateIsStBreamub', 'asyncUpdateApprovalStatus', 'asyncUpdateStSelectedKeys'])
    onMounted(() => {
      const { asyncUpdateIsStBreamub, asyncUpdateApprovalStatus, asyncUpdateStSelectedKeys } = storeAction
      asyncUpdateIsStBreamub({isStBreamub: true})
      asyncUpdateApprovalStatus({approvalStatus: 3})
      asyncUpdateStSelectedKeys({stSelectedKeys: [route.path]})
    })

    return {
      data,
    };
  },
});
