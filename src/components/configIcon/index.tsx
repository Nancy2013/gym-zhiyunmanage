import { defineComponent, reactive, watch, toRefs } from "vue";
import styles from "./index.module.less";


export default defineComponent({
    props: {
        name: {
            type: String,
            required: true
        },
        color: {
            type: String,
            default: ''
        }
    },

    setup(props) {
        
        const { name, color } = toRefs(props);

        let state = reactive({ 
            iconName: `#icon-${name.value}`,
            svgClass: name.value ? `svg-icon icon-${name.value}` : 'svg-icon'
         });

        watch(name, (next, prev)=>{
            Object.assign(state, {
                iconName: `#icon-${next}`,
                svgClass: name.value ? `svg-icon icon-${next}` : 'svg-icon'
            })
        })

        return () => (
            // @ts-ignore #
            <svg class={[styles['svg-icon'], state.svgClass.replace('svg-icon', '')]} style={{ color: color.value }}>
                
                <use xlinkHref={state.iconName} />
            </svg>
            // @ts-ignore #
        )
    }
})