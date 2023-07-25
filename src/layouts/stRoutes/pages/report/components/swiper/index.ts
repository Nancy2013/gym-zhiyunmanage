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

    const snapGridLengthChange = () => {
      mySwiper.snapGrid = mySwiper.snapGrid.slice(0);
    };

    const clickSwiper = (swiper: any) => {
      const { clickedIndex } = swiper;
      console.log("-----clickSwiper--clickedIndex-", clickedIndex);
      emit('clickSwiper',swiper);
    };

    const clickSlide = (item: any) => {
      console.log("---clickSlide---", item);
    };

    const slideTo = () => {
      mySwiper.value.slideTo(2);
    };

    watch(()=>props.actived,(newVal,oldVal)=>{
      mySwiper.value.slideTo(newVal);
    });

    return {
      ...toRefs(state),
      ...toRefs(props),
      onSwiper,
      snapGridLengthChange,
      clickSwiper,
      clickSlide,
    };
  },
});
