import {defineComponent,reactive,toRefs,onMounted} from 'vue'
import * as echarts from "echarts";
import clIcon from '@/assets/image/clIcon.png';
import syIcon from '@/assets/image/syIcon.png';

// 模块图标
const moduleIcons={
  cl:{
    title:'品牌产量分析',
    icon:clIcon,
  },
  sy:{
    title:'溯源数据分析',
    icon:syIcon,
  },
}

export default defineComponent({
  setup(){
    const state=reactive({
      moduleIcons,
  })

  // 图表基本设置
  const lineConfig={
    legend:{
      itemWidth: 35,
      itemHeight: 13,
      itemGap:50,
      textStyle:{
        padding:[0,0,0,10],
        color:'#969799',
      },
      itemStyle:{
        opacity:1,
      },
    },
    xyAxis:{
      nameTextStyle:{
        color:'#969799',
      },
      axisLine:{
        show:true,
        lineStyle:{
          color:'#EBEDF0',
        },
      },
      axisLabel:{
        color:'#969799',
      },
      axisTick:{
        show:false,
      },
    },
    series:{
      symbol:'circle',
      symbolSize:10,
      itemStyle:{
      opacity:0.6, 
      },
    }
  }

  // 线性图表
  const initLineCharts = () => {
    let chartDom: any = document.getElementById("echartId");
    chartDom.removeAttribute("_echarts_instance_");
    let myChart = echarts.init(chartDom);
    let option;
    option = {
      tooltip: {
        trigger: "axis",
      },
      color: ["#185EF0", "#FF8814", "#4ECBB3"],
      legend: {
        right: 10,
        ...lineConfig.legend,
        data: [
          { name: "石台硒芽茶", icon: "rect" },
          { name: "名优特新", icon: "rect" },
          { name: "石台香芽", icon: "rect" },
        ],
      },
      grid: {
        left: "2%",
        right: "6%",
        bottom: "2%",
        top: "13%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false, // 图表区域从Y轴开始
        ...lineConfig.xyAxis,
        data: [
          "2022/07/01",
          "2022/07/02",
          "2022/07/03",
          "2022/07/04",
          "2022/07/05",
          "2022/07/06",
        ],
      },
      yAxis: {
        name: "单位（万元）",
        type: "value",
        ...lineConfig.xyAxis,
      },
      series: [
        {
          name: "石台硒芽茶",
          type: "line",
          smooth: true,
          data: [4000, 2000, 3000, 6000, 5000, 6000],
          showSymbol: false,
          areaStyle: {
            opacity: 0.12,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "#594BF6",
              },
              {
                offset: 1,
                color: "#7198FF",
              },
            ]),
          },
        },
        {
          name: "名优特新",
          type: "line",
          smooth: true,
          data:[7000, 6000, 8000, 9000, 8000, 9000],
          showSymbol: false,
          areaStyle: {
            opacity: 0.12,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "#FF903F",
              },
              {
                offset: 1,
                color: "rgba(166,175,42,0)",
              },
            ]),
          },
        },
        {
          name: "石台香芽",
          type: "line",
          smooth: true,
          data: [10000, 9000, 10000, 10000, 9000, 10000],
          showSymbol: false,
          areaStyle: {
            opacity: 0.12,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "#4C9E88",
              },
              {
                offset: 1,
                color: "rgba(166,175,42,0)",
              },
            ]),
          },
        },
      ],
    };

    option && myChart.setOption(option);
  };

  // 饼图
  const initPieCharts = () => {
    let chartDom: any = document.getElementById("pieChartId");
    chartDom.removeAttribute("_echarts_instance_");
    let myChart = echarts.init(chartDom);
    let option;

    option = {
      title: {
        text: "溯源地区统计",
        x: "center",
        y: "center",
        top: "25%",
      },
      color: ["#185EF0", "#75E3D6", "#58AFFF", "#4ECB73", "#FFCE20"],
      tooltip: {
        trigger: "item",
      },
      legend: {
        top: "bottom",
        left:'15%',
        itemWidth:14,
        itemHeight:6,
        orient: "vertical",
        formatter(params: unknown) {
          switch (params) {
            case "安徽省":
              return "安徽省" + "    " + "35%";
              break;
            case "山西省":
              return "山西省" + "    " + "20%";
              break;
            case "浙江省":
              return "浙江省" + "    " + "20%";
              break;
            case "江苏省":
              return "江苏省" + "    " + "15%";
              break;
            case "其他省":
              return "其他省" + "    " + "10%";
              break;
            default:
              break;
          }
        },
        data: [
          { name: "安徽省", },
          { name: "山西省", },
          { name: "浙江省", },
          { name: "江苏省", },
          { name: "其他省", },
        ],
      },
      series: [
        {
          name: "溯源地区统计",
          type: "pie",
          radius: ["45%", "70%"],
          center: ["50%", "30%"],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: "center",
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 1048, name: "安徽省" },
            { value: 735, name: "山西省" },
            { value: 580, name: "浙江省" },
            { value: 484, name: "江苏省" },
            { value: 300, name: "其他省" },
          ],
        },
      ],
    };
    myChart.clear();
    option && myChart.setOption(option);
  };

  // 折线图
  const initLinearCharts = () => {
    let chartDom: any = document.getElementById("linearChartId");
    chartDom.removeAttribute("_echarts_instance_");
    let myChart = echarts.init(chartDom);
    let option;

    option = {
      title: {
        text: "溯源码使用情况",
        x: "left",
        textStyle:{
          color:'#000',
          fontSize:16,
        },
      },
      tooltip: {
        trigger: "axis",
      },
      color: ["#185EF0", "#FF8814", "#4ECBB3"],
      legend: {
        bottom: 0,
        ...lineConfig.legend,
        data: [
          { name: "溯源码申请",icon:'rect'},
          { name: "溯源码扫码",icon:'rect'},
          { name: "防伪查询",icon:'rect'},
        ],
      },
      grid: {
        top: "15%",
        left: "3%",
        right: "6%",
        bottom: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["一月", "二月", "三月", "四月", "五月", "六月"],
        ...lineConfig.xyAxis,
        
      },
      yAxis: {
        type: "value",
        ...lineConfig.xyAxis,
      },
      series: [
        {
          name: "溯源码申请",
          type: "line",
          ...lineConfig.series,
          data: [4000, 6000, 4000, 10000, 8000, 9000, 4000],
        },
        {
          name: "溯源码扫码",
          type: "line",
          ...lineConfig.series,
          data: [6000, 4000, 6000, 4000, 2000, 4000, 6000],
        },
        {
          name: "防伪查询",
          type: "line",
          ...lineConfig.series,
          data: [8000, 10000, 8000, 6000, 4000, 6000, 8000],
        },
      ],
    };
    myChart.clear();
    option && myChart.setOption(option);
  };

  
  onMounted(() => {
    initPieCharts();
    initLineCharts();
    initLinearCharts();
  });

  return {
      ...toRefs(state),
  };
  },
});