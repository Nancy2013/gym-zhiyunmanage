import { filterWord, filterFloat, filterNum } from './filter'

/**
   过滤数字类型输入框
   @param {Object} data 待过滤的数字
   @param {String} key 待过滤的数字
   @return {Number} 过滤后的数字
*/
export const filterWordInput = (data: any, key: string) => {
	data[key] = filterWord(data[key])
}

/**
   过滤数字类型输入框
   @param {Object} data 待过滤的数字
   @param {String} key 待过滤的数字
   @return {Number} 过滤后的数字
*/
export const filterFloatInput = (data: any, key: string, decimalPlaces = 2) => {
	data[key] = filterFloat(data[key], decimalPlaces)
}

/**
   过滤数字类型输入框
   @param {Object} data 待过滤的数字
   @param {String} key 待过滤的数字
   @return {Number} 过滤后的数字
*/
export const filterNumInput = (data: any, key: string) => {
	data[key] = filterNum(data[key])
}