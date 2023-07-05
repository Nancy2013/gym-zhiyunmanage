import { PropType, defineComponent, ref, toRefs, watch } from "vue";
import { message, PageHeader, PageHeaderProps } from "ant-design-vue";
import { useRouter } from "vue-router";
import "./index.module.less";

/**
 * 配置项设置
 */

export default defineComponent({
  props: {
    pageConfigs: {
      type: Object as PropType<PageHeaderProps>,
      required: true,
    },
  },
  setup(props, { slots }) {
    const router = useRouter();
    // toRefs解构保持响应式
    let { pageConfigs } = toRefs(props);
    return () => (
      <PageHeader {...pageConfigs.value} onBack={() => router.go(-1)}>
        {slots}
      </PageHeader>
    );
  },
});
