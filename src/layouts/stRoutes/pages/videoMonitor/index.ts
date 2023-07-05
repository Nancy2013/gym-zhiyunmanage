import { defineComponent, onMounted, reactive, toRefs } from "vue";
import videoIcon1 from "@/assets/image/videoIcon1.png";
import videoIcon2 from "@/assets/image/videoIcon2.png";
import videoIcon3 from "@/assets/image/videoIcon3.png";
import videoIcon4 from "@/assets/image/videoIcon4.png";
import screenIcon1 from "@/assets/image/screenIcon1.png";
import addressIcon from "@/assets/image/addressIcon.png";
import { useRoute } from "vue-router";
import { useAction } from "@/hooks";
// 摄像头数据
const cameraList = [
  {
    name: "摄像头001",
    video: videoIcon1,
  },
  {
    name: "摄像头002",
    video: videoIcon2,
  },
  {
    name: "摄像头003",
    video: videoIcon3,
  },
  {
    name: "摄像头004",
    video: videoIcon4,
  },
];
// 气象数据
const weathers = {
  one: [
    {
      name: "土壤湿度",
      value: "13.8",
    },
    {
      name: "PM2.5",
      value: "54",
    },
    {
      name: "二氧化碳",
      value: "594",
    },
    {
      name: "负氧离子",
      value: "10484",
    },
    {
      name: "土壤PH",
      value: "6.77",
    },
    {
      name: "有机质",
      value: "94.86",
    },
    {
      name: "氮元素",
      value: "4.93",
    },
    {
      name: "钾元素",
      value: "90.47",
    },
  ],
  two: [
    {
      name: "土壤湿度",
      value: "13.8",
    },
    {
      name: "PM2.5",
      value: "54",
    },
    {
      name: "二氧化碳",
      value: "594",
    },
    {
      name: "负氧离子",
      value: "10484",
    },
    {
      name: "土壤PH",
      value: "6.77",
    },
    {
      name: "有机质",
      value: "94.86",
    },
    {
      name: "氮元素",
      value: "4.93",
    },
    {
      name: "钾元素",
      value: "90.47",
    },
  ],
  three: [
    {
      name: "土壤湿度",
      value: "13.8",
    },
    {
      name: "PM2.5",
      value: "54",
    },
    {
      name: "二氧化碳",
      value: "594",
    },
    {
      name: "负氧离子",
      value: "10484",
    },
    {
      name: "土壤PH",
      value: "6.77",
    },
    {
      name: "有机质",
      value: "94.86",
    },
    {
      name: "氮元素",
      value: "4.93",
    },
    {
      name: "钾元素",
      value: "90.47",
    },
  ],
  four: [
    {
      name: "土壤湿度",
      value: "13.8",
    },
    {
      name: "PM2.5",
      value: "54",
    },
    {
      name: "二氧化碳",
      value: "594",
    },
    {
      name: "负氧离子",
      value: "10484",
    },
    {
      name: "土壤PH",
      value: "6.77",
    },
    {
      name: "有机质",
      value: "94.86",
    },
    {
      name: "氮元素",
      value: "4.93",
    },
    {
      name: "钾元素",
      value: "90.47",
    },
  ],
};
export default defineComponent({
  setup() {
    const route = useRoute();
    const storeAction = useAction('stModule',['asyncUpdateIsStBreamub', 'asyncUpdateApprovalStatus', 'asyncUpdateStSelectedKeys'])
    const state = reactive({
      cameraList,
      weathers,
      screenIcon1,
      addressIcon,
    });
    onMounted(() => {
      const { asyncUpdateIsStBreamub, asyncUpdateApprovalStatus, asyncUpdateStSelectedKeys } = storeAction
      asyncUpdateIsStBreamub({isStBreamub: true})
      asyncUpdateApprovalStatus({approvalStatus: 3})
      asyncUpdateStSelectedKeys({stSelectedKeys: [route.path]})
    });
    return {
      ...toRefs(state),
    };
  },
});
