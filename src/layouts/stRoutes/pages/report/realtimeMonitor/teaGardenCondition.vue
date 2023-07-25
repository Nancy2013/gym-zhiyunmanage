<template>
  <div class="conditionPage">
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, toRef, onMounted } from "vue";
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
</script>

<style lang="less" scoped>
.conditionPage {}
</style>