/**
 * 输入框的类型 int-整数 float-小数 notSymbol-不包含特殊符号 
 */
type InputType = "int" | "float" | 'notSymbol'

interface InputFilter {
	/**
	 * 输入框类型
	 */
	type: InputType,
	/**
	 * 小数位
	 */
	decimalPlaces?: number

}

import { filterWord, filterFloat, filterNum } from '@/utils/filter'


export default function (formData: any, value: any, inputFilter: InputFilter) {
	const filterInput = (event: any) => {
		switch (inputFilter.type) {
			case 'notSymbol': 
				formData[value] = filterWord(event.target.value)
				break
			case 'float':
				formData[value] = filterFloat(event.target.value, inputFilter.decimalPlaces)
				break
			case 'int':
				formData[value] = filterNum(event.target.value)
				break
		}
	}
	return {
		filterInput
	}
}