import { defineComponent, reactive, toRefs, onMounted } from "vue";
import { useAction, useState } from "@/hooks";
import rzshdIcon from "@/assets/image/rzshdIcon.png";
import cyqqdIcon from "@/assets/image/cyqqdIcon.png";
import sqshdIcon from "@/assets/image/sqshdIcon.png";
import zcfbdIcon from "@/assets/image/zcfbdIcon.png";
import ssjkdIcon from "@/assets/image/ssjkdIcon.png";
import lwygdIcon from "@/assets/image/lwygdIcon.png";

import cqzsIcon from '@/assets/image/shitai/home/cqzsIcon.png';
import cyzsIcon from '@/assets/image/shitai/home/cyzsIcon.png';
import ppzsIcon from '@/assets/image/shitai/home/ppzsIcon.png';
import clzsIcon from '@/assets/image/shitai/home/clzsIcon.png';
import grzsIcon from '@/assets/image/shitai/home/grzsIcon.png';
import zlsbIcon from '@/assets/image/shitai/home/zlsbIcon.png';

//模块icon
import dbIcon from '@/assets/image/dbIcon.png';
import cyIcon from '@/assets/image/cyIcon.png';
import request from "@/utils/axios";
import { useRoute } from "vue-router";
// 卡片数组
const cardsList = [
  {
    key: 1,
    title: "茶企总数",
    count: 300,
    unit: "家",
    color: "#487AF5",
    img: cqzsIcon
  },
  {
    key: 2,
    title: "茶园总数",
    count: 8,
    unit: "座",
    color: "#BE93F3",
    img: cyzsIcon
  },
  {
    key: 3,
    title: "品牌总数",
    count: 56,
    unit: "个",
    color: "#00BDE4",
    img: ppzsIcon
  },
  {
    key: 4,
    title: "茶农总数",
    count: 3060,
    unit: "人",
    color: "#FF903F",
    img: clzsIcon
  },
  {
    key: 5,
    title: "工人总数",
    count: 2180,
    unit: "人",
    color: "#4C9E88",
    img: grzsIcon
  },
  {
    key: 6,
    title: "智能设备",
    count: 300,
    unit: "台",
    color: "#A5AE29",
    img: zlsbIcon
  },
];
// 使用卡片
const usedList = [
  {
    key: 1,
    title: "认证审核",
    color: "#D8D8D8",
    icon: rzshdIcon,
    path: "/stPublic/application/certificationAudit",
  },
  {
    key: 2,
    title: "茶园确权",
    color: "rgb(190 147 243 / 30%)",
    icon: cyqqdIcon,
    path: "/stPublic/application/teaGardenProperty",
  },
  {
    key: 3,
    title: "授权审核",
    color: "rgb(165 174 41 / 30%)",
    icon: sqshdIcon,
    path: "/stPublic/application/authorizationReview",
  },
  {
    key: 4,
    title: "政策发布",
    color: "rgb(0 189 228 / 30%)",
    icon: zcfbdIcon,
    path: "/stPublic/application/policyRelease",
  },
  {
    key: 5,
    title: "实施监控",
    color: "rgb(255 137 191 / 30%)",
    icon: ssjkdIcon,
    path: "/stPublic/application/videoMonitor",
  },
  {
    key: 6,
    title: "劳务用工",
    color: "rgb(117 148 223 / 30%)",
    icon: lwygdIcon,
    path: "/stPublic/application/laborEmployment",
  },
];


// 模块图标
const moduleIcons={
  db:{
    title:'我的代办',
    icon:dbIcon,
  },
  cy:{
    title:'我的常用',
    icon:cyIcon,
  },
}
export default function(){
    const route = useRoute();
    const storeState = useState('stModule',["userInfo"]);
    const storeAction = useAction('stModule',[
      "asyncUpdateIsStBreamub",
      "asyncUpdateStSelectedKeys",
    ]);
    const state = reactive({
      cardsList,
      usedList,
      moduleIcons,
      visible: false,
    });

    onMounted(() => {
      const { asyncUpdateIsStBreamub, asyncUpdateStSelectedKeys } = storeAction;
      asyncUpdateIsStBreamub({ isStBreamub: false });
      asyncUpdateStSelectedKeys({ stSelectedKeys: [route.path] });
    });
    return {
      ...toRefs(state),
      ...storeState,
    };
  };
