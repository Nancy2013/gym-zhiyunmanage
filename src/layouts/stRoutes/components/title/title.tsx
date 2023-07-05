import { defineComponent, PropType } from "vue";
import styles from './index.module.less'

export default defineComponent({
	props: {
		title: {
			type: String,
		},
		icon: {
			type: String
		}
	},
	setup(props) {
		return () => (  //props, { slots }
			<div class={styles['xc-title']}>
				<img src={props.icon} alt="" />
				<span>{ props.title }</span>
			</div>
		)
	}
})
