import { defineComponent, reactive, toRefs, ref, onMounted } from "vue";
import request from "@/utils/axios";
import { Modal, message } from "ant-design-vue";
import filterInputHook from '@/hooks/useFilterInput'
const columns = [
	{
		dataIndex: "categoryName",
		key: "categoryName",
		align: "center",
		title: "对象分类名称",
	},
	{
		key: "boCount",
		title: "对象数",
		align: "center",
		dataIndex: "boCount",
	},
	{
		key: "ruleName",
		title: "标识策略",
		align: "center",
		dataIndex: "ruleName",
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
];


const rules = {
	categoryName: [
		{ required: true, message: '请输入对象分类名称', trigger: 'blur' },
	]
}

export default function () {
	const formRef = ref();
	const state = reactive({
		searchData: { name: "" },
		formData: { categoryName: "", idisPolicy: null, id: null },
		visible: false,
		columns,
		rules,
		ruleOptions: [] as any,
		pageSize: 10,
		pageNum: 1,
		total: 0,
		labelCol: { span: 6 },
		wrapperCol: { span: 14 },
		dataSource: [],
		
	});

	const filterInputCategoryName = filterInputHook(state.formData, 'categoryName', { type: 'notSymbol' })

	onMounted(() => {
		getRuleList()
		getTableList()
	})

	/**
	 * 获取标识策略列表
	 * @param
	 * @return
	 */
	const getRuleList = () => {
		request({
			url: import.meta.env.VITE_NODE_URL + "/rule/pageQuery",
			type: "json",
			method: "post",
			data: { pageSize: 9999, ruleType: 2 }
		}).then((res) => {
			if (Array.isArray(res.rows) && res.rows.length) {
				state.ruleOptions = res.rows.map((item) => {
					return {
						label: item.ruleName,
						value: item.id
					}
				})
			}
		})
	}


	/**
	 * 获取对象分类列表
	 * @param
	 * @return
	 */
	const getTableList = () => {
		request({
			url: import.meta.env.VITE_NODE_URL + "/businessObjectCategory/pageQuery",
			type: "json",
			method: "post",
			data: { ...state.searchData, pageNum: state.pageNum, pageSize: state.pageSize }
		}).then((res) => {
			state.dataSource = res.rows as any
			state.total = res.total
		}).catch(() => {
			state.dataSource = []
		})
	}

	/**
	 * 点击对象分类名称时触发
	 * @param
	 * @return
	 */
	const handleSearch = () => {
		state.pageNum = 1
		getTableList()
	}

	/**
	 * 新增/编辑弹框点击确定事件
	 * @param
	 * @return
	 */
	const handleSubmit = () => {
		formRef.value.validate().then((params: any) => {
			// 编辑
			if (state.formData.id) {
				request({
					url: import.meta.env.VITE_NODE_URL + "/businessObjectCategory/update",
					type: "json",
					method: "post",
					data: { ...params, id: state.formData.id }
				}).then((res) => {
					message.success("编辑对象分类成功")
					state.visible = false
					handleCancel()
					getTableList()

				})
			} else {   // 新增
				request({
					url: import.meta.env.VITE_NODE_URL + "/businessObjectCategory/add",
					type: "json",
					method: "post",
					data: { ...params }
				}).then((res) => {
					message.success("创建对象分类成功")
					state.visible = false
					handleCancel()
					getTableList()
				})
			}

		})
	}

	/**
	 * 新增/编辑弹框点击取消事件
	 * @param
	 * @return
	 */
	const handleCancel = () => {
		state.formData = {} as any
		formRef.value.resetFields()
	}

	/**
	 * 点击列表编辑按钮时触发
	 * @param
	 * @return
	 */
	const handleEdit = (column: any) => {
		request({
			url: import.meta.env.VITE_NODE_URL + "/businessObjectCategory/getById",
			type: "json",
			method: "get",
			params: { id: column.id }
		}).then((res: any) => {
			state.formData = {
				id: column.id,
				categoryName: res.data.categoryName,
				idisPolicy: res.data.idisPolicy
			}
			state.visible = true
		})
	}

	/**
	 * 点击列表删除按钮时触发
	 * @param
	 * @return
	 */
	const handleDelete = (column: any) => {
		Modal.confirm({
			title: '提示',
			content: '确认要删除该条数据',
			centered: true,
			onOk() {
				return new Promise((resolve, reject) => {
					request({
						url: import.meta.env.VITE_NODE_URL + "/businessObjectCategory/del",
						type: "json",
						method: "post",
						data: { id: column.id }
					}).then(() => {
						resolve(true)
						message.success("删除成功")
						state.visible = false
						getTableList()
					}).catch(() => {
						reject()
					})
				})
			}
		})
	}

	const handlePageChange = (pagination: any) => {
		state.pageNum = pagination.current
		state.pageSize = pagination.pageSize
		getTableList()
		// let { current, pageSize, total } = pagination
		// state.pagination = { current, pageSize, total };
		// codeRecord(state.convertInterface);
	}

	return {
		...toRefs(state),
		formRef,
		handleSubmit,
		handleCancel,
		handleEdit,
		handleSearch,
		handleDelete,
		handlePageChange,
		filterInputCategoryName
	};
}