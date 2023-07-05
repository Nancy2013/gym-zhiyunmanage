export const columns = [
	{
		key: "tableIndex",
		dataIndex: "tableIndex",
		align: "center",
		title: "序号",
	},
	{
		key: "name",
		dataIndex: "name",
		align: "center",
		title: "模板名称",
	},
	{
		key: "text",
		dataIndex: "text",
		align: "center",
		title: "防伪文字内容",
	},
	{
		key: "type",
		dataIndex: "type",
		align: "center",
		title: "类型",
	},
	{
		key: "scenario",
		dataIndex: "scenario",
		align: "center",
		title: "显示场景",
	},
	{
		key: "reviewStatus",
		dataIndex: "reviewStatus",
		align: "center",
		title: "审核状态",
	},
	{
		key: "reviewComment",
		dataIndex: "reviewComment",
		align: "center",
		title: "审核说明",
	},
	{
		key: "createTime",
		dataIndex: "createTime",
		align: "center",
		title: "创建时间",
	},
	{
		key: "action",
		title: "操作",
		align: "center",
		dataIndex: "action",
		width: 140,
	},
];

export const formRules = {
	scenario: [
		{ required: true, message: '请选择显示场景', trigger: 'blur' },
	],
	name: [
		{ required: true, message: '请输入模板名称', trigger: 'blur' },
	],
	text: [
		{ required: true, message: '请输入防伪内容', trigger: 'blur' },
	]
}

export const antiFakeContentRenderList = [
	{
		label: '查询次数',
		key: 'count'
	},
	{
		label: '标识码',
		key: 'code'
	},
	{
		label: '产品名称',
		key: 'product'
	},
	{
		label: '首次查询时间',
		key: 'firstQueryTime'
	},
	{
		label: '最后查询时间',
		key: 'lastQueryTime'
	},
	{
		label: '企业名称',
		key: 'company'
	},
	{
		label: '输入的查询码',
		key: 'validateCode'
	}
]