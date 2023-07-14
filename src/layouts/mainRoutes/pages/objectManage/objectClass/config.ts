export const tableColumns = [
	{
		dataIndex: "tableIndex",
		key: "tableIndex",
		align: "center",
		title: "序号",
	},
	{
		dataIndex: "parentCategoryName",
		key: "parentCategoryName",
		align: "center",
		title: "一级对象分类",
	},
	{
		dataIndex: "categoryName",
		key: "categoryName",
		align: "center",
		title: "二级对象分类",
	},
	{
		dataIndex: "enterpriseName",
		key: "enterpriseName",
		align: "center",
		title: "所属机构",
	},
	{
		key: "boCount",
		title: "对象数",
		align: "center",
		dataIndex: "boCount",
	},
	{
		key: "creator",
		title: "创建人",
		align: "center",
		dataIndex: "creator",
	},
	{
		key: "createdTime",
		title: "创建时间",
		align: "center",
		dataIndex: "createdTime",
	},
	{
		key: "action",
		title: "操作",
		align: "center",
		dataIndex: "action",
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