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

/**
 * 企业认证状态
 */
export const certificationStatus={
	1:'待审核',
    2:'已认证',
    3:'已驳回',
	'wait':1,
	'complate':2,
	'reject':3,
};

/**
 * 码量授权状态
 */
export const codeStatus={
	0:'待审核',
	1:'已审核',
	2:'已驳回',
};

/**
 * 工单类型的说明
 */
export const workTypeDict = {
	/**
	 * 农事工单
	 */
	farming: 1,
	/**
	 * 采摘工单
	 */
	pick: 2,
	/**
	 * 生产工单
	 */
	production: 3,
	/**
	 * 质量检验
	 */
	qualityTesting: 4,
	/**
	 * 产品包装
	 */
	productPackaging: 5,
	/**
	 * 二次包装
	 */
	secondaryPackaging: 6,
	/**
	 * 入库
	 */
	warehousing: 7,
	/**
	 * 出库
	 */
	outbound: 8,
	/**
	 * 农事工单
	 */
	'1': '农事工单',
	/**
	 * 采摘工单
	 */
	'2': '采摘工单',
	/**
	 * 生产工单
	 */
	'3': '生产工单',
	/**
	 * 质量检验
	 */
	'4': '质量检验',
	/**
	 * 产品包装
	 */
	'5': '产品包装',
	/**
	 * 二次包装
	 */
	'6': '二次包装',
	/**
	 * 入库
	 */
	'7': '入库',
	/**
	 * 出库
	 */
	'8': '出库'
}

/**
 *品牌活动方式
 */
export const activityMode={
	1:'线上',
	2:'线下',
};

/**
 * 终端类型
 */
export const terminalType={
	1:'PC端',
	2:'小程序端',
	// 3:'H5端',
};

/**
 * 字典查询参数
 */
export const dictTypeCode={
	activityCategory:'activity_category', // 品牌活动，活动类型
	contentCategory:'msg_category', // 内容管理，内容类型
	activityWay:'activity_way', // 活动方式
	codeActivityCategory:'promotionTempType', // 码上营销，活动类型
	farmType:'farm_stock_type', // 农资管理，农资类型
}

