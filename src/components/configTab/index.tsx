import { defineComponent } from "vue";
import styles from "./index.module.less";

/**
 * 配置项设置
 */

interface PropertyType {

}

export default defineComponent({
    props: {

    },
    setup(props, { slots }) {
        return () => (
            <div class={styles["tab-main"]}>
                {slots}
            </div>
        )
    }
})