import { RenderFormItem } from '@/components/form/form'
import { antiFakeTemplateAuditStatusOptions } from '@/utils/config'

export const searchRenderList: RenderFormItem[] = [
	{
		label: '工业标识',
		key: 'idisCode',
		type: 'input',
		placeholder: '工业标识'
	},
	{
		label: '时间区间',
		key: 'dates',
		type: 'datePicker',
		datePickerType: 'rangePicker'
	}
]

export const tableColumns = [
	{
		key: "idisCode",
		dataIndex: "idisCode",
		title: "工业标识",
		width: 240
	},
	{
		key: "objectName",
		dataIndex: "objectName",
		title: "产品名称",
		width: 140
	},
	{
		key: "objectBatch",
		dataIndex: "objectBatch",
		title: "产品批次",
		width: 140
	},
	{
		key: "wxNickName",
		dataIndex: "wxNickName",
		title: "微信昵称",
		width: 120
	},
	{
		key: "accessAddress",
		dataIndex: "accessAddress",
		title: "查验地址",
		width: 400
	},
	{
		key: "accessIp",
		dataIndex: "accessIp",
		title: "IP地址",
		width: 140
	},
	{
		key: "createdTime",
		dataIndex: "createdTime",
		title: "查验时间",
		width: 140
	}
]