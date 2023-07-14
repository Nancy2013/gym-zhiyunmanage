import { RenderFormItem } from '@/components/form/form'
import { Rules } from '@/shims'


export const tableColumns = [
	{
		dataIndex: "tableIndex",
		key: "tableIndex",
		align: "center",
		title: "序号",
	},
	{
		dataIndex: "batchNo",
		key: "batchNo",
		align: "center",
		title: "批次编号",
	},
	{
		key: "batchTitle",
		title: "批次标题",
		align: "center",
		dataIndex: "batchTitle",
	},
	{
		key: "categoryName",
		title: "产品分类",
		align: "center",
		dataIndex: "categoryName",
	},
	{
		key: "boName",
		title: "产品名称",
		align: "center",
		dataIndex: "boName",
	},
	{
		key: "boName",
		title: "产品编号",
		align: "center",
		dataIndex: "boName",
	},
	{
		key: "batchDate",
		title: "批次日期",
		align: "center",
		dataIndex: "batchDate",
	},
	{
		key: "warrantyPeriod",
		title: "质保期",
		align: "center",
		dataIndex: "warrantyPeriod",
	},
	{
		key: "batchResponorUser",
		title: "负责人",
		align: "center",
		dataIndex: "batchResponorUser",
	},
	{
		key: "remark",
		title: "说明",
		align: "center",
		dataIndex: "remark",
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
	},
]

export const renderList: RenderFormItem[] = [
	{
		label: '产品名称',
		type: 'select',
		key: 'boId',
		options: [],
		placeholder: '请输入产品名称'
	},
	{
		label: '批次编号',
		type: 'input',
		key: 'batchNo',
		placeholder: '请输入批次编号'
	},
	{
		label: '批次标题',
		type: 'input',
		key: 'batchTitle',
		placeholder: '请输入批次标题'
	},
	{
		label: '负责人',
		type: 'input',
		key: 'batchResponorUser',
		placeholder: '请输入负责人'
	},
	{
		label: '批次日期',
		type: 'datePicker',
		datePickerType: 'datePicker',
		key: 'batchDate',
		placeholder: '请选择批次日期'
	},
	{
		label: '质保期',
		type: 'datePicker',
		datePickerType: 'rangePicker',
		key: 'dates',
		width: '60%',
		placeholder: '请选择质保期'
	},
	{
		label: '说明',
		type: 'textarea',
		key: 'remark',
		placeholder: '请输入说明',
		width: '100%'
	},
]


export const formRules: Rules = {
	boId: [
		{ required: true, message: '请输入产品名称', trigger: 'blur' },
	],
	batchNo: [
		{ required: true, message: '请输入批次编号', trigger: 'blur' },
	],
	batchTitle: [
		{ required: true, message: '请输入批次标题', trigger: 'blur' },
	]
}