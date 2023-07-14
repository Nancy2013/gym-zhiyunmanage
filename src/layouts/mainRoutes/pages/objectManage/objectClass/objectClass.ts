import { defineComponent, reactive, toRefs, ref, onMounted } from "vue";
import request from "@/utils/axios";
import { Modal, message } from "ant-design-vue";
import filterInputHook from '@/hooks/useFilterInput'
import { tableColumns, formRules } from './config'
import { objectAndProductDataTypeDict } from '@/utils/dict'




export default function () {
	const dataType = objectAndProductDataTypeDict.object
	const formRef = ref();
	const state = reactive({
		searchData: {} as any,
		formData: { treeLevel: 1 } as any,
		visible: false,
		columns: tableColumns,
		formRules,
		ruleOptions: [] as any,
		pageSize: 10,
		pageNum: 1,
		total: 0,
		dataSource: [],
		IdNameOptions: [] as any
	});

	const filterInputCategoryName = filterInputHook(state.formData, 'categoryName', { type: 'notSymbol' })

	onMounted(() => {
		getObjectClassLevel1List()
		getTableList()
	})

	/**
	 * 获取机构列表
	 * @param
	 * @return
	 */
	const getIdNameMap = () => {
		request({
			url: import.meta.env.VITE_BASE_URL + "/enterprise/getIdNameMap",
			
		}).then((res: any) => {
			state.IdNameOptions = Object.keys(res.data).map((item) => {
				return {
					label: res.data[item],
					value: item
				}
			})
		})
	}

	getIdNameMap()

	/**
	 * 获取一级分类列表
	 * @param
	 * @return
	 */
	const getObjectClassLevel1List = () => {
		request({
			url: import.meta.env.VITE_NODE_URL + "/businessObjectCategory/getByParentId",
			params: { parentId: 0, dataType }
		}).then((res) => {
			if (Array.isArray(res.data) && res.data.length) {
				state.ruleOptions = res.data.map((item) => {
					return {
						label: item.categoryName,
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
		const { searchData, pageNum, pageSize } = state
		request({
			url: import.meta.env.VITE_NODE_URL + "/businessObjectCategory/pageQuery",
			type: "json",
			method: "post",
			data: { ...searchData, pageNum, pageSize, dataType }
		}).then((res) => {
			state.dataSource = res.rows.map((item: any, key: number) => {
				item.tableIndex = (pageNum - 1) * pageSize + key + 1
				return item
			}) as any
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
			const paramsData = { ...params }
			if (paramsData.treeLevel == 1) {
				paramsData.parentId = 0
			}
			// 编辑
			if (state.formData.id) {
				request({
					url: import.meta.env.VITE_NODE_URL + "/businessObjectCategory/update",
					type: "json",
					method: "post",
					data: { ...paramsData, id: state.formData.id, dataType }
				}).then((res) => {
					message.success("编辑对象分类成功")
					state.visible = false
					handleCancel()
					getTableList()
					if (paramsData.parentId == 0) {
						getObjectClassLevel1List()
					}

				})
			} else {   // 新增
				request({
					url: import.meta.env.VITE_NODE_URL + "/businessObjectCategory/add",
					type: "json",
					method: "post",
					data: { ...paramsData, dataType }
				}).then((res) => {
					message.success("创建对象分类成功")
					state.visible = false
					handleCancel()
					getTableList()
					if (paramsData.parentId == 0) {
						getObjectClassLevel1List()
					}
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
		state.formData = {
			treeLevel: 1
		} as any
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
			const { categoryName, parentId } = res.data
			state.formData = {
				id: column.id,
				categoryName,
				parentId,
				treeLevel: parentId == 0 ? 1 : 2
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
						if (column.parentId == 0) {
							getObjectClassLevel1List()
						}
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