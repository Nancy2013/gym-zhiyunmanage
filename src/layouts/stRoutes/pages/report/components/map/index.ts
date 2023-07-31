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
    actived:{
      type:Number,
      default:0,
    },
  },
  components: {},
  setup(props: any, { emit }) {
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
                minClusterSize: 10, // 聚合的最小数量
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
        let lnglats: any = [];
        let convertedArr: any = [];
        props.data.forEach((item: any) => {
          const { lng, lat } = item;
          if (lng && lat) {
            lnglats.push([lng, lat]);
          }
        });
        const maxSize = 40; // GPS转高德坐标,每次最多支持40对坐标
        const page = Math.ceil(lnglats.length / maxSize);
        let count = 0; // 转换次数

        /**
         *批量转换坐标
         *
         * @param {*} LngLat 坐标切片
         */
        const batchConvert = (LngLat: any) => {
          AMap.convertFrom(LngLat, "gps", function (status: any, result: any) {
            if (result.info === "ok") {
              count++;
              console.log("----convertFrom------", result.locations);
              convertedArr = convertedArr.concat(result.locations);
              if (count >= page) {
                createMarker(convertedArr);
              }
            }
          });
        };

        for (let i = 0; i < page; i++) {
          const lnglatsSlice = lnglats.slice(i * maxSize, (i + 1) * maxSize);
          batchConvert(lnglatsSlice);
        }
      });
    };

    /**
     *生成点标记
     *
     * @param {*} position
     */
    const createMarker = (positions: any) => {
      console.log("-----createMarker-------", positions);
      createAMap().then((AMap) => {
        positions.forEach((position: any, $index: number) => {
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
          marker.id = props.data[$index].id;
          marker.on("click", onMarkerClick);
          if (marker.id === props.actived) {
            marker.setAnimation("AMAP_ANIMATION_BOUNCE"); // 初始化标记弹跳
          }
          markers.push(marker);
        });
        cluster.addMarkers(markers);
      });
    };

    /**
     * 点击标记
     * @param event 点击回调
     */
    const onMarkerClick = (event: any) => {
      console.log("-----onMarkerClick------", event);
      const marker = event.target;
      setAnimation(marker);
      emit("onMarkerClick", event);
    };

    /**
     * 设置点标记弹跳
     * @param marker 当前标记
     * @returns
     */
    const setAnimation = (marker: any) => {
      markers.forEach((item: any) => {
        // 重置弹跳效果
        item.setAnimation("");
      });
      marker.setAnimation("AMAP_ANIMATION_BOUNCE"); // 当前标记弹跳

      return marker;
    };

    watch(()=>props.actived,(newVal,oldVal)=>{
      const activeMarker=markers.filter((item:any)=>item.id===newVal)[0];
      console.log('------activeMarker------',newVal,activeMarker);
      if(activeMarker){
        setAnimation(activeMarker);
      }
    });

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
