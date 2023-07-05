import { defineComponent, PropType } from "vue";
import styles from './index.module.less'

/**
 * 搜索项类型
 */
type SearchType = 'input' | 'select'

/**
 * 搜索项配置
 */
export interface SerachItem {
	label?: string
	key: string,
	type: SearchType
	placeholder?: string
}


export default defineComponent({
	props: {
		rendList: {
			type: Object as PropType<SerachItem[]>,
			require: true
		},
		value: {
			type: String
		}
	},
	setup(props) {
		return () => (
			<a-form model={props.value}>
				<a-row>
					
				</a-row>
			</a-form>

		)
	}
})
