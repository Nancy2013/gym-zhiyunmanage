import { RenderFormItem } from '@/components/form/form'
import { Rules } from '@/shims'

export const searchRenderList: RenderFormItem[] = [
	{
		label: '批次标题/产品名称',
		key: 'name',
		type: 'input',
		placeholder: '批次标题/产品名称'
  }
]


export const tableColumns = [
	{
		dataIndex: "tableIndex",
		key: "tableIndex",
		title: "序号",
		width: 80
	},
	{
		dataIndex: "batchNo",
		key: "batchNo",
		title: "批次编号",
	},
	{
		key: "batchTitle",
		title: "批次标题",
		
		dataIndex: "batchTitle",
	},
	{
		key: "categoryName",
		title: "产品分类",
		width: 160,
		dataIndex: "categoryName",
	},
	{
		key: "boName",
		title: "产品名称",
		
		dataIndex: "boName",
	},
	{
		key: "boName",
		title: "产品编号",
		
		dataIndex: "boName",
	},
	{
		key: "batchDate",
		title: "批次日期",
		
		dataIndex: "batchDate",
	},
	{
		key: "warrantyPeriod",
		title: "质保期",
		width: 160,
		dataIndex: "warrantyPeriod",
	},
	{
		key: "batchResponorUser",
		title: "负责人",
		width: 90,
		dataIndex: "batchResponorUser",
	},
	{
		key: "remark",
		title: "说明",
		
		dataIndex: "remark",
	},
	{
		key: "creator",
		title: "创建人",
		width: 90,
		dataIndex: "creator",
	},
	{
		key: "createdTime",
		title: "创建时间",
		width: 140,
		dataIndex: "createdTime",
	},
	{
		key: "action",
		title: "操作",
		width: 120,
		dataIndex: "action",
		fixed: 'right'
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
		maxlength: 30,
		inputType: 'word',
		placeholder: '请输入批次编号'
	},
	{
		label: '批次标题',
		type: 'input',
		key: 'batchTitle',
		maxlength: 30,
		inputType: 'word',
		placeholder: '请输入批次标题'
	},
	{
		label: '负责人',
		type: 'input',
		key: 'batchResponorUser',
		maxlength: 30,
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
		maxlength: 1000,
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