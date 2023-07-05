

/**
 * 隐私类型可选数据
 */
export const attrTypeOptions: Option[] = [
	{
		label: "公有",
		value: 10
	},
	{
		label: "私有",
		value: 20
	}
]

/**
 * 所属平台可选数据
 */

export const platformTypeOptions: Option[] = [
	{
		label: 'Saas平台',
		value: 1
	},
	{
		label: '硒茶平台',
		value: 2
	}
]

/**
 * Saas平台时终端可选项
 */
export const sassTerminalTypeOptions: Option[] = [
	{
		label: 'PC',
		value: 1
	}
]

/**
 * Saas平台时终端可选项
 */
export const xcTerminalTypeOptions: Option[] = [
	{
		label: 'PC',
		value: 1
	},
	{
		label: 'H5',
		value: 2
	}
]

export const teaConfirmStatusOptions: Option[] = [
	{
		label: '审核状态',
		value: ""
	},
	{
		label: '待审核',
		value: 1
	},
	{
		label: '已确权',
		value: 2
	},
	{
		label: '已驳回',
		value: 3
	}
]

/**
 * 防伪模板审核状态选项
 */
export const antiFakeTemplateAuditStatusOptions: Option[] = [
	{
		label: '待审核',
		value: 'submitted'
	},
	{
		label: '审核通过',
		value: 'pass'
	},
	{
		label: '审核未通过',
		value: 'reject'
	}
]

/**
 * 防伪模板类型选项
 */
export const antiFakeTemplateTypeOptions: Option[] = [
	{
		label: '系统',
		value: 'submitted'
	},
	{
		label: '自定义',
		value: 'pass'
	},
]

export const antiFakeTemplateScenarioOptions: Option[] = [
	{
		label: '首次查询',
		value: '1'
	},
	{
		label: '多次查询',
		value: '2'
	}
]