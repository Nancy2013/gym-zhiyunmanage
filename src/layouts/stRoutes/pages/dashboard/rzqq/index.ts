import { defineComponent, reactive, toRefs } from "vue";
import rightArrow from "@/assets/image/rightArrow.png";
import rzIcon from "@/assets/image/rzIcon.png";
import qqIcon from "@/assets/image/qqIcon.png";

// 企业认证列表
const enterpriseList = [
  {
    key: 1,
    name: "千年香茶叶股份有限公司",
    status: 3, // 1:已认证，2:已驳回，3:待认证，
    time: "2023/03/22",
  },
  {
    key: 2,
    name: "福建名峰茶业有限公司",
    status: 2,
    time: "2023/03/22",
  },
  {
    key: 3,
    name: "杭州丰泽茶叶有限公司",
    status: 3,
    time: "2023/03/23",
  },
  {
    key: 4,
    name: "安化明森泰茶叶有限公司",
    status: 1,
    time: "2023/03/24",
  },
  {
    key: 5,
    name: "陕西平利九叶蓝茶叶有限公司",
    status: 1,
    time: "2023/03/26",
  },
  {
    key: 6,
    name: "福建金溪茶业有限公司",
    status: 1,
    time: "2023/03/26",
  },
];
const enterpriseDots = [
  {
    key: 1,
    status: 1,
    count: 58,
  },
  {
    key: 2,
    status: 3,
    count: 12,
  },
  {
    key: 3,
    status: 2,
    count: 8,
  },
];

// 地块确权
const farmList = [
  {
    key: 1,
    name: "安徽省池州市石台县001号",
    status: 1, // 1:已确权，2:已驳回，3:待确权
    time: "2023/03/22",
  },
  {
    key: 2,
    name: "安徽省池州市石台县002号",
    status: 2,
    time: "2023/03/22",
  },
  {
    key: 3,
    name: "安徽省池州市石台县003号",
    status: 3,
    time: "2023/03/23",
  },
  {
    key: 4,
    name: "安徽省池州市石台县004号",
    status: 1,
    time: "2023/03/24",
  },
  {
    key: 5,
    name: "安徽省池州市石台县005号",
    status: 1,
    time: "2023/03/26",
  },
  {
    key: 6,
    name: "安徽省池州市石台县006号",
    status: 1,
    time: "2023/03/26",
  },
];

const farmDots = [
  {
    key: 1,
    status: 1,
    count: 58,
  },
  {
    key: 2,
    status: 3,
    count: 12,
  },
  {
    key: 3,
    status: 2,
    count: 8,
  },
];

// 模块图标
const moduleIcons = {
  rz: {
    title: "企业认证",
    icon: rzIcon,
  },
  qq: {
    title: "地块确权",
    icon: qqIcon,
  },
};

// 企业认证
const switchQyStatus = (state: number) => {
  let statusValue: string = "";
  switch (state) {
    case 1:
      statusValue = "已认证";
      break;
    case 2:
      statusValue = "已驳回";
      break;
    case 3:
      statusValue = "待认证";
      break;
    default:
      break;
  }
  return statusValue;
};

// 地块授权
const switchDkStatus = (state: number) => {
  let statusValue: string = "";
  switch (state) {
    case 1:
      statusValue = "已确权";
      break;
    case 2:
      statusValue = "已驳回";
      break;
    case 3:
      statusValue = "待确权";
      break;
    default:
      break;
  }
  return statusValue;
};

export default defineComponent({
  setup() {
    const state = reactive({
      enterpriseList,
      enterpriseDots,
      farmList,
      farmDots,
      rightArrow,
      moduleIcons,
    });
    return {
      ...toRefs(state),
      switchQyStatus,
      switchDkStatus,
    };
  },
});
