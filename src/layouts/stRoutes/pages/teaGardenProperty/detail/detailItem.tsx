import { defineComponent, PropType } from "vue";
import { Image } from 'ant-design-vue'
import styles from './index.module.less'
import { detailRenderItem } from './config'

export default defineComponent({
	props: {
		item: {
			type: Object as PropType<detailRenderItem>,
			require: true
		},
		value: {
			type: String
		}
	},
	setup(props) {
		return () => (
			<div class={styles['detail-item']} style={{ width: `${props.item?.width}` }}>
				<div class={styles['detail-label']}>{props.item?.require ? <span>*</span> : ''}{props.item?.label}</div>
				{
					props.item?.type == 'text' ? <div class={styles['detail-text']}>{props.value}</div> : props.item?.type == 'img' ? (
						Array.isArray(props.value) ? (props.value.map((img) => {
							return <div>
								<Image width={100} height={100} src={img}></Image>
							</div>
						})) : <div>
							<Image width={100} height={100} src={props.value}></Image>
						</div>
					) : ''
				}


			</div >

		)
	}
})
