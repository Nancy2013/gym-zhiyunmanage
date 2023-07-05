import { defineComponent, reactive, toRefs, onMounted } from "vue";
import { Image } from 'ant-design-vue'
export default defineComponent({
  props: {
    data: [] as any,
    img: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
  },
  components: {
    Image,
  },
  setup() {
    const state = reactive({});

    onMounted(() => {});
    return {
      ...toRefs(state),
    };
  },
});
