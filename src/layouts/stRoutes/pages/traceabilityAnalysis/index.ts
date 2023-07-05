import { defineComponent, onMounted, reactive, toRefs } from "vue";
import { useRoute } from "vue-router";
import { useAction } from "@/hooks";
export default defineComponent({
  setup() {
    const route = useRoute();
    const state = reactive({});
    const storeAction = useAction('stModule',['asyncUpdateIsStBreamub', 'asyncUpdateApprovalStatus', 'asyncUpdateStSelectedKeys'])
    onMounted(() => {
      const { asyncUpdateIsStBreamub, asyncUpdateApprovalStatus, asyncUpdateStSelectedKeys } = storeAction
      asyncUpdateIsStBreamub({isStBreamub: true})
      asyncUpdateApprovalStatus({approvalStatus: 3})
      asyncUpdateStSelectedKeys({stSelectedKeys: [route.path]})
    });
    return {
      ...toRefs(state),
    };
  },
});
