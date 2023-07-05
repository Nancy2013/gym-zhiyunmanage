import {defineComponent,reactive,toRefs} from 'vue'
import hdIcon from '@/assets/image/hdIcon.png';
import hotIcon from '@/assets/image/hotIcon.png';
import zxwlhdIcon1 from "@/assets/image/zxwlhdIcon1.png";
import zxwlhdIcon2 from "@/assets/image/zxwlhdIcon2.png";
import rmllIcon1 from "@/assets/image/rmllIcon1.png";
import rmllIcon2 from "@/assets/image/rmllIcon2.png";
import rmllIcon3 from "@/assets/image/rmllIcon3.png";
import bgTag1 from '@/assets/image/bgTag1.png'
import bgTag2 from '@/assets/image/bgTag2.png'

// 模块图标
const moduleIcons={
  hd:{
    title:'最新文旅活动',
    icon:hdIcon,
  },
  hot:{
    title:'热门游览',
    icon:hotIcon,
  },
}

// 最新文旅活动
const wllls = {
  wlhdList: [
    {
      key: 1,
      img: zxwlhdIcon1,
      label: "茶叶节-茶叶采摘体验活动剪影",
    },
    {
      key: 2,
      img: zxwlhdIcon2,
      label: "4.18茶叶节即将开幕",
    },
  ],
  rmllList: [
    {
      key: 1,
      img: rmllIcon1,
      label: "硒茶示范园采摘体验",
      tag: "免费",
      slogan: "",
      price: "",
      address: "池州市石台县六朝路100号",
      bgIcon:bgTag1,
    },
    {
      key: 2,
      img: rmllIcon2,
      label: "品茶体验",
      tag: "¥68.00",
      slogan: "",
      price: "",
      address: "",
      bgIcon:bgTag2,
    },
    {
      key: 3,
      img: rmllIcon3,
      label: "山间[名宿]",
      tag: "",
      slogan: "网红打卡地",
      price: "",
      address: "池州市石台县人",
    },
  ],
};

export default defineComponent({
  setup(){
    const state=reactive({
      wllls,
      moduleIcons,
    })
    return {
        ...toRefs(state),
    };
  },
});