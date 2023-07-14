/**
 * 过滤文件大小
 * @param { Number } size 文件大小B
 * @return
 */
export const filterFileSize = (size: number): string => {
	if (size / (1024 * 1024) > 1) {
		return `${(size / (1024 * 1024)).toFixed(1)}MB`
	} else if (size / 1024 > 1) {
		return `${(size / 1024).toFixed(1)}KB`
	} else {
		return `${size}B`
	}

}

/**
	* 过滤word类型(数字字母汉字)
	* @param { String } val 待校验的数据
	* @return { String } 过滤后的数据
*/
export const filterWord = (val: string): string => {
	return val.replace(/[^A-Za-z0-9\u4e00-\u9fa5]/g, "")
}

/**
   过滤数字
   @param {String} num 待过滤的数字
   @return {Number} 过滤后的数字
*/
export const filterNum = function (num: string) {
	num = num.replace(/[^\d]/g, '')   //过滤非数字
	return num === '' ? '' : num
}

/**
   过滤浮点数
   @param {String} num 待过滤的数字
   @param {Number} decimalLen 过滤的小数位
   @return {Number} 过滤后的数字
*/
export const filterFloat = function (str: string, decimalLen = 2) {
	let result = str.toString().replace(/[^\d\.]/g, '')   //过滤非数字和.
	result = result.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".")   //去除多余的.
	let regStr = '^(\\-)*(\\d+)\\.('
	for (let i = 0; i < decimalLen; i++) {
		regStr += '\\d'
	}
	regStr += ').*$'
	const decimalReg = new RegExp(regStr)
	return result.replace(decimalReg, '$1$2.$3')  //小数点后最多decimalLen位
}