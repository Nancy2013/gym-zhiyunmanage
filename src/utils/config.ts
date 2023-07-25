

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
		value: 'system'
	},
	{
		label: '自定义',
		value: 'custom'
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

/**
 * 标识码状态
 */
export const identityCodeStatusOptions: Option[] = [
	{
	  value: 1,
	  label: "生码中",
	},
	{
	  value: 2,
	  label: "已生码",
	},
	{
	  value: 3,
	  label: "同步中",
	},
	{
	  value: 4,
	  label: "已同步",
	},
	{
	  value: 5,
	  label: "同步失败",
	},
	{
	  value: 6,
	  label: "生码失败",
	},
]
  
/**
 * 升码类型选项
 */
export const ruleTypeoptions = [
	{
	  value: 1,
	  label: "手动生码",
	},
	{
	  value: 2,
	  label: "自动生码",
	},
  ];