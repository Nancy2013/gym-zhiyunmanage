import { defineComponent, reactive, toRefs, onMounted, watch } from "vue";
import { createAMap } from "@/utils/map";
import { shallowRef } from "@vue/reactivity";
import mapIcon from "@/assets/image/main/securityAlarm/icon.gif";
export default defineComponent({
  props: {
    data: {
      type: Array,
      default: [] as any,
    },
  },
  components: {},
  setup(props: any) {
    let map = shallowRef(null) as any;
    let cluster: any = null; // 点聚合
    let markers: any = []; // 点标记
    const state = reactive({
      heatmap: "" as any,
      points: [] as any,
    });
    onMounted(() => {
      initMap();
    });

    /**
     *初始化高德地图
     *
     */
    const initMap = () => {
      createAMap()
        .then(() => {
          const AMap = (window as any).AMap;
          map = new AMap.Map("container", {
            //设置地图容器id
            resizeEnable: true,
            viewMode: "2D", //是否为3D地图模式
            zoom: 4, //初始化地图级别
          });
          initCluster();
        })
        .catch((e: any) => {
          console.log(e);
        });
    };

    /**
     *初始化点聚合
     *
     */
    const initCluster = () => {
      if (cluster) {
        cluster.setMap(null);
      } else {
        //默认样式
        createAMap()
          .then((AMap) => {
            AMap.plugin(["AMap.MarkerClusterer"], function () {
              const styles = [
                {
                  // 1-10,
                  url: mapIcon,
                  size: new AMap.Size(90, 90),
                  offset: new AMap.Pixel(-45, -45),
                },
                {
                  // 10-100,
                  url: mapIcon,
                  size: new AMap.Size(90, 90),
                  offset: new AMap.Pixel(-45, -45),
                },
                {
                  // 101-1000,
                  url: mapIcon,
                  size: new AMap.Size(90, 90),
                  offset: new AMap.Pixel(-45, -45),
                },
              ];
              const opts = {
                gridSize: 80, // 聚合计算时网格的像素大小
                maxZoom: 10, // 最大的聚合级别
                minClusterSize: 2, // 聚合的最小数量
                styles, // 聚合图标
              };
              cluster = new AMap.MarkerClusterer(map, markers, opts);
            });
          })
          .catch((e: any) => {
            console.log(e);
          });
      }
    };

    /**
     *添加点标记
     *
     */
    const addMarkers = () => {
      removeMarkers(); // 显示前先移除
      convertFrom(); // 转换坐标
    };

    /**
     *删除点标记
     *
     */
     const removeMarkers = () => {
      markers = []; // 删除点标记
      cluster && cluster.clearMarkers(); // 取消点聚合
    };

    /**
     *点坐标转换
     *
     */
    const convertFrom = () => {
      createAMap().then((AMap) => {
        let lnglats:any=[];
        props.data.forEach((item:any)=>{
          const {lng,lat}=item;
          if(lng&&lat){
            lnglats.push([lng,lat]);
          }
        });        
        AMap.convertFrom(lnglats, "gps", function (status: any, result: any) {
          // GPS转高德坐标
          if (result.info === "ok") {
            console.log('----convertFrom------',result.locations);
            createMarker(result.locations);
          }
        });
      });
    };

    /**
     *生成点标记
     *
     * @param {*} position
     */
    const createMarker=(positions:any)=>{
      createAMap().then((AMap)=>{
        positions.forEach((position:any)=>{
          const size = 50;
          const icon = new AMap.Icon({
            image: mapIcon,
            size: new AMap.Size(size, size), // 图标尺寸
            imageSize: new AMap.Size(size, size),
          });
          const opt = {
            position,
            icon,
          };
          const marker = new AMap.Marker(opt);
          markers.push(marker);
        });
        cluster.addMarkers(markers);
      });
    }


    watch(
      () => [...props.data],
      (newValue: any, valueOld: any) => {
        console.log("-----watch-----", props.data);
        addMarkers();
      }
    );

    return {
      ...toRefs(state),
      map,
    };
  },
});
