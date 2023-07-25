

export const tableColumns = [
	{
		dataIndex: "tableIndex",
		key: "tableIndex",
		title: "序号",
		width: 80
	},
	{
		dataIndex: "parentCategoryName",
		key: "parentCategoryName",
		title: "一级对象分类",
		width: 180
	},
	{
		dataIndex: "categoryName",
		key: "categoryName",
		title: "二级对象分类",
		width: 180
	},
	{
		dataIndex: "enterpriseName",
		key: "enterpriseName",
		title: "所属机构",
		width: 120
	},
	{
		key: "boCount",
		title: "对象数",
		align: "right",
		dataIndex: "boCount",
		width: 100
	},
	{
		key: "creator",
		title: "创建人",
		dataIndex: "creator",
		width: 120
	},
	{
		key: "createdTime",
		title: "创建时间",
		dataIndex: "createdTime",
		width: 140
	},
	{
		key: "action",
		title: "操作",
		dataIndex: "action",
		width: 140
	}
]

export const formRules = {
	treeLevel: [
		{ required: true, message: '请选择对象分类', trigger: 'blur' },
	],
	parentId: [
		{ required: true, message: '请选择一级对象分类', trigger: 'blur' },
	],
	categoryName: [
		{ required: true, message: '请输入一级对象分类名称', trigger: 'blur' },
	]
}