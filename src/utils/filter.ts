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
export const filterWord = (val: string):string => {
	return val.replace(/[^A-Za-z0-9\u4e00-\u9fa5]/g, "")
}