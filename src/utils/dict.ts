/**
 * 是否可溯源说明
 */
export const sourceFlagDict: any = {
	can: 0,
	cannot: -1,
	'0': '是',
	'-1': '否'
}

/**
 * 对象的同步状态说明
 */
export const syncStatusDict: any = {
	notSync: 10,
	synchronized: 20,
	syncError: 30,
	'10': '未同步',
	'20': '已同步',
	'30': '同步错误'
}

/**
 * 所属平台说明
 */
export const platformTypeDict: any = {
	'1': "Saas",
	'2': "硒茶",
	'saas': 1,
	'xicha': 2
}

/**
 * 终端类型说明
 */
export const terminalTypeDict: any = {
	'1': 'PC',
	'2': 'H5',
	'pc': 1,
	'h5': 2
}

/**
 * 茶园确权状态说明
 */
export const teaConfirmStatusDict = {
	/**
	 * 未确权
	 */
	unconfirmed: '0',
	/**
	 * 待审核
	 */
	wait: "1",
	/**
	 * 已确权
	 */
	complate: '2',
	/**
	 * 已驳回
	 */
	reject: '3',
	/**
	 * 
	 */
	'0': '未确权',
	/**
	 * 申请中
	 */
	'1': '申请中',
	/**
	 * 已确权
	 */
	'2': '已确权',
	/**
	 * 已驳回
	 */
	'3': '已驳回'
}

/**
 * 防伪模板类型的说明
 */
export const antiFakeTypeDict = {
	'custom': '自定义',
	'system': '系统'
}

/**
 * 防伪模板审核状态的说明
 */
export const antiFakeAuditStatusDict = {
	"pass": "审核通过",
	"reject": "审核未通过",
	"submitted": "待审核",
}

export const antiFakeScenarioDict = {
	'1': '首次查询',
	'2': '多次查询',
	'first': 1,
	'many': 2
}

/**
 * 对象和产品的数据类型
 */
export const objectAndProductDataTypeDict = {
	object: 0,
	product: 1
}

