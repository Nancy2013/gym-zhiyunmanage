/**
 *判断是否为空
 *@param {String}a 变量
 *@return 是否为空
 */
 export const isEmpty = function (a:any):boolean {
    if (a === undefined || a === 'undefined' || a === null || a === 'null' || a === '' || JSON.stringify(a) === '{}' || JSON.stringify(a) === '[]') {
        return true
    }
    return false
}


/**
 *获取文件后缀名
 *@param {String} name 文件名字
 *@return { String } 文件后缀名
 */
export const getSuffixName = (name: string) => {
	return name.substring(name.lastIndexOf(".") + 1)
}

/**
 * 时间显示格式
 */
export const pickerFormat={
    yearFormat:'YYYY',
    monthFormat:'YYYY-MM',
    dateFormat:'YYYY-MM-DD',
    timeFormat:'YYYY-MM-DD HH:mm:ss',
}