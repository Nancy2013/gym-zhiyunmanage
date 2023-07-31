
export const tableColumns = [
	{
		dataIndex: "tableIndex",
		key: "tableIndex",
		title: "序号",
		width: 80
	},
	{
		dataIndex: "name",
		key: "name",
		title: "产品名称",
		width: 140
	},
	{
		dataIndex: "categoryName",
		key: "categoryName",
		title: "产品分类",
		width: 180
	},
	{
		dataIndex: "productNo",
		key: "productNo",
		title: "产品编号",
		width: 120
	},
	{
		dataIndex: "barCode",
		key: "barCode",
		title: "产品条码",
		width: 120
	},
	{
		dataIndex: "unit",
		key: "unit",
		title: "产品单位",
		width: 90
	},
	{
		dataIndex: "price",
		key: "price",
		title: "产品单价(元)",
		width: 100,
		align: 'right'
	},
	{
		key: "syncStatus",
		title: "同步状态",
		dataIndex: "syncStatus",
		widh: 100
	},
	{
		key: "creator",
		title: "创建人",
		dataIndex: "creator",
		width: 90
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
		align: "left",
		dataIndex: "action",
		width: 120
	},
]