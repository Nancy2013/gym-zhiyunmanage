import { defineComponent, reactive, toRefs, ref, onMounted, watch } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css"; // Import Swiper styles
import "swiper/css/navigation";
export default defineComponent({
  props: {
    data: {
      type: Array,
      default: "",
    },
    actived:{
      type:Number,
      default:0,
    },
  },
  components: {
    Swiper,
    SwiperSlide,
  },
  setup(props: any, { emit }) {
    const mySwiper = ref() as any;
    const state = reactive({
      modules: [Autoplay, Navigation],
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });

    onMounted(() => {});

    const onSwiper = (swiper: any) => {
      console.log(swiper);
      mySwiper.value = swiper;
    };

    const onSwiperclick = (swiper: any) => {
      const { clickedIndex } = swiper;
      console.log("-----onSwiperclick--clickedIndex-", clickedIndex);
      emit('onSwiperclick',swiper);
      
    };
    const onSlideClick = (item: any) => {
      console.log("---clickSlide---", item);
      emit('onSlideClick',item);
    };

    const slideTo = () => {
      mySwiper.value.slideTo(2);
    };

    watch(()=>props.actived,(newVal:any,oldVal:any)=>{
      const pos=props.data.findIndex((item:any)=>item.id===newVal);
      console.log('----watch-----swiper-------',pos);
      
      if(pos>-1){
        mySwiper.value.slideTo(pos);
      }
    });

    return {
      ...toRefs(state),
      ...toRefs(props),
      onSwiper,
      onSwiperclick,
      onSlideClick,
    };
  },
});
