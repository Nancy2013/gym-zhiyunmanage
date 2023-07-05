import { defineComponent, reactive, toRefs, onMounted } from "vue";
export default defineComponent({
  props: {},
  components: {},
  setup() {
    const state = reactive({});

    onMounted(() => {});
    return {
      ...toRefs(state),
    };
  },
});
