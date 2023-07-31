import { RenderFormItem } from '@/components/tsx/form'
import { antiFakeTemplateAuditStatusOptions } from '@/utils/config'

export const searchRenderList: RenderFormItem[] = [
	{
		label: '模板/企业名称',
		key: 'condition',
		type: 'input',
		placeholder: '模板名称/企业名称'
	},
	{
		label: '审核状态',
		key: 'reviewStatus',
		type: 'select',
		placeholder: '审核状态',
		options: antiFakeTemplateAuditStatusOptions
	}
]



export const columns = [
	{
		key: "tableIndex",
		dataIndex: "tableIndex",
		title: "序号",
		width: 80
	},
	{
		key: "tenantName",
		dataIndex: "tenantName",
		title: "企业名称",
		width: 160
	},
	{
		key: "name",
		dataIndex: "name",
		title: "模板名称",
		width: 160
	},
	{
		key: "text",
		dataIndex: "text",
		title: "防伪文字内容",
		width: 320
	},
	{
		key: "type",
		dataIndex: "type",
		title: "类型",
		width: 100
	},
	{
		key: "scenario",
		dataIndex: "scenario",
		title: "显示场景",
		width: 100
	},
	{
		key: "reviewStatus",
		dataIndex: "reviewStatus",
		title: "审核状态",
		width: 120
	},
	{
		key: "reviewComment",
		dataIndex: "reviewComment",
		title: "审核说明",
		width: 120
	},
	{
		key: "createdTime",
		dataIndex: "createdTime",
		
		title: "创建时间",
		width: 140
	},
	{
		key: "action",
		title: "操作",
		
		dataIndex: "action",
		width: 100,
		fixed: 'right',
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