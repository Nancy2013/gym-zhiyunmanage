import { defineComponent, reactive, toRefs, onMounted } from "vue";
import ppIcon from "@/assets/image/ppIcon.png";
import szIcon from "@/assets/image/szIcon.png";
import ppjmlIcon1 from "@/assets/image/ppjmlIcon1.png";
import ppjmlIcon2 from "@/assets/image/ppjmlIcon2.png";
import ppjmlIcon3 from "@/assets/image/ppjmlIcon3.png";
import zxwlhdIcon1 from "@/assets/image/zxwlhdIcon1.png";
import zxwlhdIcon2 from "@/assets/image/zxwlhdIcon2.png";
import request from "@/utils/axios";
const codeColumn = [
  {
    title: "品牌名称",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "图片",
    dataIndex: "img",
    key: "img",
  },
  {
    title: "品牌企业数",
    dataIndex: "count1",
    key: "count1",
  },
  {
    title: "已审批码量",
    dataIndex: "count2",
    key: "count2",
  },
  {
    title: "待审批码量",
    dataIndex: "count3",
    key: "count3",
  },
];
// 品牌及码量
const codeList = [
  {
    key: 1,
    title: "石台富硒茶",
    img: ppjmlIcon1,
    count1: 65,
    count2: 972773,
    count3: 310398,
  },
  {
    key: 2,
    title: "名优特新",
    img: ppjmlIcon2,
    count1: 62,
    count2: 96283,
    count3: 854387,
  },
  {
    key: 3,
    title: "石台香芽",
    img: ppjmlIcon3,
    count1: 63,
    count2: 83894,
    count3: 234798,
  },
];
// 数字化茶园
const digitalizeObj = {
  imgs: ["", "", ""],
  zzmj: "150亩",
  xhl: "3.0mg/kg",
  jwd: "112,89",
  fzr: "张奎",
  list: [
    {
      img: '',
      span1: "13.8",
      span2: "土壤温度",
    },
    {
      img: '',
      span1: "26.7",
      span2: "土壤水分",
    },
    {
      img: '',
      span1: "15.8",
      span2: "空气温度",
    },
    {
      img: '',
      span1: "13.9",
      span2: "空气湿度",
    },
    {
      img: '',
      span1: "101.2",
      span2: "大气压",
    },
  ],
  table: {
    columns: [
      {
        dataIndex: "rq",
        key: "rq",
        align: "center",
        title: "日期",
      },
      {
        dataIndex: "trwd",
        key: "trwd",
        align: "center",
        title: "土壤温度",
      },
      {
        dataIndex: "trsf",
        key: "trsf",
        align: "center",
        title: "土壤水分",
      },
      {
        dataIndex: "kqwd",
        key: "kqwd",
        align: "center",
        title: "空气温度",
      },
      {
        dataIndex: "kqsd",
        key: "kqsd",
        align: "center",
        title: "空气湿度",
      },
      {
        dataIndex: "dqy",
        key: "dqy",
        align: "center",
        title: "大气压",
      },
    ],
    datasource: [
      {
        key: 1,
        rq: "2023/02/02",
        trwd: "13.2",
        trsf: "25.6",
        kqwd: "16.8",
        kqsd: "10.9",
        dqy: "100.0",
      },
      {
        key: 2,
        rq: "2023/02/02",
        trwd: "13.2",
        trsf: "25.6",
        kqwd: "16.8",
        kqsd: "10.9",
        dqy: "100.0",
      },
    ],
  },
};

// 模块图标
const moduleIcons = {
  pp: {
    title: "品牌及码量",
    icon: ppIcon,
  },
  sz: {
    title: "数字化茶园",
    icon: szIcon,
  },
};
export default defineComponent({
  emits: ["updateVisible"],
  setup(props, { emit }) {
    const state = reactive({
      codeColumn,
      codeList,
      digitalizeObj,
      moduleIcons,
      carousels: [] as any,
      videoAddress: "",
      playerOptions: {
        autoplay: true, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: true, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        width: document.documentElement.clientWidth,
        notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: false,
          durationDisplay: false,
          remainingTimeDisplay: false,
          fullscreenToggle: false, //全屏按钮
        },
      },
    });

    // 获取视频设备序列号
    const getVideoSerial = async () => {
      let res: any = await request({
        baseURL: "/fcapi",
        url: "/ys/sensor/video/serial",
        type: "json",
        method: "get",
        params: {},
      });
      console.log("获取设备序列号", res);
      if (res.data.code == 200) {
        state.carousels = res.data.data.map((item: any, index: number) => {
          if (index == 0) {
            item = Object.assign({}, item, { video: zxwlhdIcon1 });
          } else if (index == 1) {
            item = Object.assign({}, item, { video: zxwlhdIcon2 });
          }
          return item;
        });
      }
    };

    // 获取视频播放地址
    const getVideoAddress = async (deviceSerial: string) => {
      state.videoAddress = "";
      let res: any = await request({
        baseURL: "/fcapi",
        url: "/ys/sensor/video/address",
        type: "json",
        method: "get",
        params: {
          deviceSerial,
        },
      });
      console.log("获取视频播放地址", res.data.data);
      if (res.data.code == 200) {
        state.videoAddress = res.data.data;
        emit("updateVisible");
      }
    };
    onMounted(() => {
      getVideoSerial();
    });
    return {
      ...toRefs(state),
      getVideoAddress,
    };
  },
});
