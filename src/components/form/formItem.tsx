import { defineComponent, PropType, toRefs, ref, watch } from "vue";
import { Select, Radio, DatePicker, Checkbox, Cascader, Switch, TreeSelect } from 'ant-design-vue'
import { RangePicker } from 'ant-design-vue/es/date-picker'
import { FormItem } from "ant-design-vue/es/form";
import { RadioGroup } from 'ant-design-vue/es/radio'
import { CheckboxGroup } from 'ant-design-vue/es/checkbox'
import { CascaderOptionType } from 'ant-design-vue/lib/cascader/index'
import FcInput from '../input/input'
import FcUpload from '../upload/upload'
import { RenderFormItem } from './form'
import styles from "./form.module.less";
//import styles from "./index.module.less";




export default defineComponent({
	components: {
		FormItem,
		FcInput,
		FcUpload
	},
	props: {
		renderItem: {
			type: Object as PropType<RenderFormItem>,
			required: true
		},
		value: {
			type: [String, Number, Object, Boolean, Symbol, Array] as PropType<any>,
		}
	},
	emits: ["update:value", "change", "unifyEvent"],
	setup(props, { slots, emit }) {
		const innerRenderItem = ref(props.renderItem)
		const { rules, label, required, width, type, key, options, placeholder, decimalLen, disabled, allowClear = ref(true), inputType, filterFnc, maxlength, datePickerType, labelAlign, labelCol, fieldNames, showSearch, password, layout } = { ...toRefs(innerRenderItem.value) }
		const innerValue = ref(props.value)

		/**
		 * 处理表单数据改变事件
		 * @param { Object } value 表单绑定的值
		 * @return
		 */
		const handleChange = (value: any) => {
			emit("change", value)
			emit('update:value', value)
		}

		/**
		 * 处理自定义事件(回车 失焦等其他时间)
		 * @param { Object } event 表单绑定的值
		 * @return
		 */
		const handleUnifyEvent = (event: any) => {
			emit('unifyEvent', event)
		}

		/**
		 * 处理级联选择器加载数据
		 * @param { Array } selectedOptions 级联选择器当前选中的值
		 * @return
		 */
		const handleLoadDate = (selectedOptions: CascaderOptionType[]) => {
			emit('update:value', selectedOptions.map((option) => {
				return option.value
			}))
			if (innerRenderItem.value.loadData && typeof innerRenderItem.value.loadData === 'function') {
				innerRenderItem.value.loadData(selectedOptions)
			}
		}

		watch(() => props.value, (newValue) => {
			innerValue.value = newValue
		})

		watch(() => props.renderItem, (newRenderItem) => {
			innerRenderItem.value = newRenderItem
		})

		return () => (
			<div class={`${styles['fcFormItem-wrapper']} ${styles[`fcFormItem-wrapper-${type.value}`]}`} style={{ width: width?.value }}>
				<FormItem class={`${styles['fcFormItem']} fcFormItem-${key.value}`} name={key.value} rules={rules?.value} label={label?.value} required={required?.value} labelAlign={labelAlign?.value} labelCol={labelCol?.value}>
					{slots.default ? slots.default() :
						(() => {
							switch (type.value) {
								case 'select':
									return <Select disabled={disabled?.value} v-model:value={innerValue.value} options={options?.value} placeholder={placeholder?.value} fieldNames={fieldNames?.value} filterOption={props.renderItem.filterOption} showSearch={showSearch?.value} allowClear={allowClear?.value} onChange={handleChange}></Select>
								case 'treeSelect':
									return <TreeSelect {...innerRenderItem.value} v-model:value={innerValue.value} onChange={handleChange} onSelect={ (value: any, node: any, extra: any)=> { handleUnifyEvent({ type: 'select', value: { value, node, extra } }) } }></TreeSelect>
								case 'textarea':
									return <FcInput type='textarea' disabled={disabled?.value} v-model:value={innerValue.value} placeholder={placeholder?.value} allowClear={allowClear?.value} decimalLen={decimalLen?.value} inputType={inputType?.value} filterFnc={filterFnc?.value} maxlength={maxlength?.value} onChange={handleChange} onUnifyEvent={handleUnifyEvent}></FcInput>
								case 'radio':
									return <RadioGroup disabled={disabled?.value} v-model:value={innerValue.value} onChange={(event) => { handleChange(event.target.value) }}>
										{
											(Array.isArray(options?.value) && options?.value.length) ? options?.value.map((option) => {
												return <Radio value={option.value}>{option.label}</Radio>
											}) : ""
										}
									</RadioGroup>
								case 'datePicker':
									return datePickerType?.value === 'rangePicker' ? <RangePicker class={styles['fcDatePicker']} disabled={disabled?.value} v-model:value={innerValue.value} allowClear={allowClear?.value} onChange={handleChange}></RangePicker> : <DatePicker class={styles['fcDatePicker']} disabled={disabled?.value} v-model:value={innerValue.value} placeholder={placeholder?.value} allowClear={allowClear?.value} onChange={handleChange}></DatePicker>
								case 'checkbox':
									return <CheckboxGroup disabled={disabled?.value} v-model:value={innerValue.value} onChange={(event) => { handleChange(event) }}>
										{
											(Array.isArray(options?.value) && options?.value.length) ? options?.value.map((option) => {
												return <Checkbox value={option.value}>{option.label}</Checkbox>
											}) : ""
										}
									</CheckboxGroup>
								case 'cascader':
									return <Cascader disabled={disabled?.value} v-model:value={innerValue.value} options={options?.value} placeholder={placeholder?.value} loadData={innerRenderItem.value.loadData && typeof innerRenderItem.value.loadData === 'function' ? handleLoadDate : null} allowClear={allowClear?.value} onChange={handleChange}></Cascader>
								case 'upload':
									return <FcUpload {...Object.assign(innerRenderItem.value)} v-model:value={innerValue.value} type={innerRenderItem.value.uploadType} onChange={handleChange}></FcUpload>
								case 'switch':
									return <Switch {...innerRenderItem.value} v-model:checked={innerValue.value} onChange={handleChange}></Switch>
								default:
									return <FcInput disabled={disabled?.value} v-model:value={innerValue.value} placeholder={placeholder?.value} allowClear={allowClear?.value} decimalLen={decimalLen?.value} inputType={inputType?.value} filterFnc={filterFnc?.value} password={password?.value} maxlength={maxlength?.value} onChange={handleChange} onUnifyEvent={handleUnifyEvent}></FcInput>

							}
						})()
					}

				</FormItem>
			</div>

		)
	}
})