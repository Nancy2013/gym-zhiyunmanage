import { RenderFormItem } from '@/components/tsx/form'
import { Rules } from '@/shims'

export const formRules: Rules = {
	name: [
		{ required: true, message: '请输入对象名称', trigger: 'blur' },
	],
	categoryId: [
		{ required: true, message: '请选择产品分类', trigger: 'blur' },
	],
	productNo: [
		{ required: true, message: '请输入产品编号', trigger: 'blur' },
	]
}

export const renderFormList: RenderFormItem[] = [
	{
		label: '产品名称',
		type: 'input',
		key: 'name',
		placeholder: '请输入产品名称',
		maxlength: 30,
		inputType: 'word'
	},
	{
		label: '产品编号',
		type: 'input',
		key: 'productNo',
		placeholder: '请输入产品编号',
		maxlength: 30,
		inputType: 'word'
	},
	{
		label: '产品分类',
		type: 'cascader',
		key: 'categoryId',
		placeholder: '请选择产品分类',
		options: []
	},
	{
		label: '品牌',
		type: 'select',
		key: 'brandId',
		placeholder: '请选择品牌',
		options: []
	},
	{
		label: '产品条码',
		type: 'input',
		key: 'barCode',
		placeholder: '请输入产品条码',
		maxlength: 30
	},
	{
		label: '产品单位',
		type: 'input',
		key: 'unit',
		placeholder: '请输入产品单位',
		maxlength: 20
	},
	{
		label: '产品单价',
		type: 'input',
		key: 'price',
		placeholder: '请输入产品单价',
		inputType: 'float',
		maxlength: 20
	},
	{
		label: '产品简介',
		type: 'textarea',
		key: 'remark',
		placeholder: '请输入产品简介',
		maxlength: 1000
	},
	
]