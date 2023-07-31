<template>
  <div class="monitorPage">
    <div class="map">
      <MapView :data='data' @onMarkerClick="onMarkerClick" :actived="current.id"/>
    </div>
    <div class="video">
      <VideoView :videoSrc="current.videoSrc" v-if="current.videoSrc"/>
      <VideoView v-else/>
    </div>
    <div class="swiper">
      <SwiperView @onSlideClick="onSlideClick" :data="data" :actived="current.id"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, toRef,ref, onMounted } from "vue";
import MapView from './../components/map/index.vue'
import VideoView from './../components/video/index.vue'
import SwiperView from './../components/swiper/index.vue'
import service from '@/service/stRoutes';
import { useAction } from "@/hooks";
const tempData = [
  {
    "id": 1,
    "longitude": 118.94527,
    "latitude": 31.35485,
    videoSrc:'https://vjs.zencdn.net/v/oceans.mp4',
  },
  {
    "id": 2,
    "longitude": 120.94527,
    "latitude": 35.35485,
    videoSrc:'https://cdn.jsdelivr.net/gh/xdlumia/files/video-play/IronMan.mp4',
  },
  {
    "id": 3,
    "longitude": 99.94527,
    "latitude": 22.35485,
    // videoSrc:'https://vjs.zencdn.net/v/oceans.mp4',
  },
  {
    "id": 4,
    "longitude": 18.94527,
    "latitude": 10.35485,
    // videoSrc:'https://vjs.zencdn.net/v/oceans.mp4',
  },
  {
    "id": 5,
    "longitude": 108.94527,
    "latitude": 31.35485,
    // videoSrc:'https://vjs.zencdn.net/v/oceans.mp4',
  },
  {
    "id": 6,
    "longitude": 114.17433,
    "latitude": 22.31655,
    // videoSrc:'https://vjs.zencdn.net/v/oceans.mp4',
  },
  {
    "id": 7,
    "longitude": 118.82694,
    "latitude": 31.86719
  },
  {
    "id": 8,
    "longitude": 118.82693,
    "latitude": 31.8672
  },
  {
    "id": 9,
    "longitude": 118.82695,
    "latitude": 31.86721
  },
  {
    "id": 10,
    "longitude": 118.82694,
    "latitude": 31.86715
  },
];
export default defineComponent({
  props: {},
  components: {
    MapView,
    VideoView,
    SwiperView,
  },
  setup() {
    const storeAction = useAction("stModule", ["asyncUpdateIsStBreamub"]);
    const state = reactive({
      data:[] as any,
      loading: true,
      current:{} as any,
    });
    onMounted(() => {
      const { asyncUpdateIsStBreamub } = storeAction;
      asyncUpdateIsStBreamub({ isStBreamub: true });
      queryMonitor();
    });

    /**
     * 查询
     */
    const queryMonitor = () => {
      const { queryMonitor } = service.report;
      const params = {}
      queryMonitor(params).then((res: any) => {
        const { code, data } = res;
        if (code === 200) {
          state.data=tempData.map((item:any)=>({
            ...item,
            lng:item.longitude,
            lat:item.latitude,
          }));
          state.current=state.data[0]
        }
        state.loading = false;
      }).catch((e: any) => {
        console.error(e);
        state.loading = false;
      });
    }

    /**
     * 点击点标记
     * @param marker 当前点标记
     */
    const onMarkerClick=(marker:any)=>{
      const {id}=marker.target;
      setCurrent(id);
    }

    /**
     * 点击swiper-slide
     * @param swiper  当前swiper-slide
     */
    const onSlideClick=(slide:any)=>{
      const {id}=slide;
      setCurrent(id);
    }

    /**
     * 设置当前茶园
     * @param id 茶园id
     */
    const setCurrent=(id:any)=>{
      const {data}=state;
      const current=data.filter((item:any)=>item.id===id)[0];
      if(current){
        state.current=current;
      }
    }

    return {
      ...toRefs(state),
      onMarkerClick,
      onSlideClick,
    };
  },
});
</script>

<style lang="less" scoped>
.monitorPage {
  width: 100%;
  display: flex;

  .map,
  
  .swiper {
    flex: 1;
  }
  .video{
    flex: 2;
  }
  .swiper{
    height: 800px;
  }
}
</style>