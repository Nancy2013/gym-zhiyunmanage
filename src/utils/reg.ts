/**
	文件描述：正则工具类
	创建人：段素栋
	创建时间：2021-03-18
 */

/**
    校验手机号
    @param {String} phone 手机号
    @return {Boolean} 是否校验通过
*/
const validPhone = (phone:any) => {
	return /^(1)[0-9]{10}$/.test(phone)
}

/**
    校验验证码
    @param {String} code 验证码
    @return {Boolean} 是否校验通过
*/
const validCode = (code:any) => {
	return /^\d{6}$/.test(code)
}


/**
    校验邮箱
    @param {String} email 邮箱
    @return {Boolean} 是否校验通过
*/
const validEmail = (email:any) => {
	if (new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$").test(email)) {
		return true
	}
	return false
}

/**
    校验身份证号码
    @param {String} card 身份证号
    @return {Boolean} 是否校验通过
*/
const validCard = (card:any) => {
	if (/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/.test(card)) {
		return true
	}
	return false
}

/**
    校验姓名
    @param {String} name 姓名
    @return {Boolean} 是否校验通过
*/
const validName = (name:string) => {
	if (name.indexOf('•') > -1 || name.indexOf('·') > -1) {
		return /^[\u4e00-\u9fa5]+[·•][\u4e00-\u9fa5]{1,18}$/.test(name)
	} else {
		return /^[\u4e00-\u9fa5]{2,20}$/.test(name) || /^[a-zA-Z0-9]{2,31}$/.test(name)
	}
}

/**
    校验整数
    @param {String} val 待校验的文字
    @return {Boolean} 是否校验通过
*/
const vailNumber = function(val:any) {
	return /^\d+$/.test(val)
}

/**
 * @description: 校验特殊字符
 * @param {*} val
 * @return {*}
 */
const validSpecialKey=function(val:any){
	const regex = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]`~!@#$%^&*()_+=<>?:"{},.\/;'[\]]/;

	return regex.test(val);
}


export {
	validPhone,
	validCode,
	validEmail,
	validCard,
	validName,
	vailNumber,
	validSpecialKey
}