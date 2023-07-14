import { RenderFormItem } from '@/components/form/form'
import { Rules } from '@/shims'

export const tableColumns = [
	// {
	// 	dataIndex: "tableIndex",
	// 	key: "tableIndex",
	// 	align: "left",
	// 	title: "序号",
	// },
	{
		dataIndex: "categoryName",
		key: "categoryName",
		align: "left",
		title: "产品分类",
	},
	{
		key: "boCount",
		title: "产品数",
		align: "left",
		dataIndex: "boCount",
	},
	{
		key: "creator",
		title: "创建人",
		align: "left",
		dataIndex: "creator",
	},
	{
		key: "createdTime",
		title: "创建时间",
		align: "left",
		dataIndex: "createdTime",
	},
	{
		key: "action",
		title: "操作",
		align: "left",
		dataIndex: "action",
	},
]

export const formRules: Rules = {
	parentName: [
		{ required: true, message: '请选择上级分类名称', trigger: 'blur' }
	],
	categoryName: [
		{ required: true, message: '请输入对象分类名称', trigger: 'blur' },
	]
}

export const renderFormList: RenderFormItem[] = [
	{
		label: '上级分类名称',
		key: 'parentName',
		type: 'input',
		disabled: true,
		placeholder: '请选择上级分类名称',
		width: '100%'
	},
	{
		label: '分类名称',
		key: 'categoryName',
		type: 'input',
		inputType: 'word',
		maxlength: 30,
		width: '100%',
		placeholder: '请输入产品分类名称'
	}
]