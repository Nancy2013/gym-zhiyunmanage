import { defineComponent, PropType, ref, watch } from "vue";
import { Input } from 'ant-design-vue'
import { Textarea } from 'ant-design-vue/es/input'
import { filterFloat, filterNum, filterWord } from '@/utils/filter'
import { InputType } from '../form/form'
import { ChangeEvent } from "ant-design-vue/lib/_util/EventInterface";


export default defineComponent({
	props: {
		value: {
			type: [String, Number] as PropType<any>,
			require: true
		},
		inputType: {
			type: String as PropType<InputType>
		},
		decimalLen: {
			type: Number
		},
		placeholder: {
			type: String
		},
		disabled: {
			type: Boolean
		},
		allowClear: {
			type: Boolean
		},
		filterFnc: {
			type: Function as PropType<(value: string) => string>
		},
		maxlength: {
			type: Number
		},
		type: {
			type: String as PropType<'input' | 'textarea'>,
			default: 'input'
		},
		autosize: {
			type: [Boolean, Object],
			default: () => {
				return { minRows: 2, maxRows: 6 }
			}
		}

	},
	emits: ['update:value', "change"],
	setup(props, { slots, emit }) {
		const innerValue = ref(props.value)
		const handleChange = (event: ChangeEvent) => {
			let value = event.target?.value || ""
			if (props.filterFnc && typeof props.filterFnc === 'function') {
				value = props.filterFnc(value)
			} else {
				switch (props.inputType) {
					case 'word':
						value = filterWord(value)
						break
					case 'int':
						value = filterNum(value)
						break
					case 'float':
						value = filterFloat(value, props.decimalLen)
						break
					default:
						break
				}
			}
			emit('update:value', value)
			emit('change', value)
			innerValue.value = value
		}

		watch(() => props.value, (newValue) => {
			innerValue.value = newValue
		})

		return () => (
			props.type === 'input' ? <Input  v-model:value={innerValue.value} placeholder={props.placeholder} disabled={props.disabled} maxlength={props.maxlength} allowClear={props.allowClear} onChange={handleChange}></Input> : <Textarea v-model:value={innerValue.value} autoSize={props.autosize}  placeholder={props.placeholder} disabled={props.disabled} maxlength={props.maxlength} allowClear={props.allowClear} onChange={handleChange}></Textarea>
		)
	}
})