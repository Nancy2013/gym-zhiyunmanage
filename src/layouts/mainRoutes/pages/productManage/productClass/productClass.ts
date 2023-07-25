import { defineComponent, reactive, toRefs, ref, onMounted, nextTick } from "vue";
import request from "@/utils/axios";
import { tableColumns, formRules, renderFormList, searchRenderList } from './config'
import { Modal, message } from "ant-design-vue";
import { objectAndProductDataTypeDict } from '@/utils/dict'
import filterInputHook from '@/hooks/useFilterInput'
import { isEmpty } from '@/utils/common'




export default function () {
	const dataType = objectAndProductDataTypeDict.product
	const formRef = ref();
	const state = reactive({
		searchData: {} as any,
		formData: { categoryNameType: '1' } as any,
		visible: false,
		columns: tableColumns,
		rules: formRules,
		ruleOptions: [] as any,
		renderFormList: renderFormList,
		searchRenderList,
		pagination: {
			pageSize: 10,
			pageNum: 1,
			total: 0,
		},
		loading: true,
		dataSource: [],
		tableKey: Math.random(),
		expandedRowKeys: [] as any[],
		parentName: '',
		currentRecord: null as any
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
	 * 获取产品分类列表
	 * @param
	 * @return
	 */
	const getTableList = () => {
		state.loading = true
		const { searchData, pagination: { pageNum, pageSize } } = state
		request({
			url: import.meta.env.VITE_NODE_URL + "/businessObjectCategory/pageQueryProduct",
			type: "json",
			method: "post",
			data: { ...searchData, pageNum, pageSize, dataType }
		}).then(async (res) => {
			state.loading = false
			state.dataSource = res.rows.map((item: any, key: number) => {
				item.tableIndex = (pageNum - 1) * pageSize + key + 1
				item.pageIndex = key
				item.children = []
				return item
			}) as any
			state.expandedRowKeys = []
			state.pagination.total = res.total
		}).catch(() => {
			state.loading = false
			state.dataSource = []
		})
	}

	/**
	 * 点击对象分类名称时触发
	 * @param
	 * @return
	 */
	const handleSearch = () => {
		state.pagination.pageNum = 1
		getTableList()
	}

	/**
	 * 点击新增按钮时触发
	 * @param 
	 * @return
	 */
	const handleAddFirst = () => {
		state.renderFormList[0].isHide = true
		state.formData = {
			treeLevel: 1
		}
		state.visible = true
	}

	/**
	 * 点击新增子类按钮时触发
	 * @param 
	 * @return
	 */
	const handleAddChild = (record: any) => {
		state.renderFormList[0].isHide = false
		state.formData = {
			treeLevel: record.treeLevel + 1,
			parentId: record.id,
			parentName: record.categoryName
		}
		state.currentRecord = record
		state.visible = true
	}

	/**
	 * 新增/编辑弹框点击确定事件
	 * @param
	 * @return
	 */
	const handleSubmit = () => {
		formRef.value.validate().then((params: any) => {
			const paramsData = { ...state.formData }
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
					if (paramsData.treeLevel == 1) {
						getTableList()
					} else {
						state.currentRecord.categoryName = paramsData.categoryName
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
					if (paramsData.treeLevel == 1) {
						getTableList()
					} else {
						handleAddChildCallback()
					}
				})
			}
		})
	}

	/**
	 * 添加子类后刷新子类数据
	 * @param
	 * @return
	 */
	const handleAddChildCallback = () => {
		getChildList(state.currentRecord).then((res) => {
			state.currentRecord.children = res
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
				parentName: column.parentName,
				categoryName: res.data.categoryName
			}
			state.currentRecord = column
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
						const deteleItem = (list: any[], id: string) => {
							for (let i = 0; i < list.length; i++) {
								const item = list[i]
								if (item.id === id) {
									console.log(id)
									list.splice(i, 1)
									return
								}
								if (Array.isArray(item.children) && item.children.length) {
									deteleItem(item.children, id)
								}
							}
						}
						deteleItem(state.dataSource, column.id)
					}).catch(() => {
						reject()
					})
				})
			}
		})
	}

	/**
	 * 处理分页改变事件
	 * @param
	 * @return
	 */
	const paginationChange = (pagination: any) => {
		state.pagination.pageNum = pagination.current
		state.pagination.pageSize = pagination.pageSize
		getTableList()
	}


	/**
	 * 表格展开时触发 
	 * @param { Boolean } expandedRows 是否展开
	 * @return
	 */
	const handleExpand = (expandedRows: any, record: any) => {
		const { children } = record
		if (expandedRows && isEmpty(children)) {
			getChildList(record).then((list) => {
				record.children = list
			})
		}
	}

	/**
	 * 获取子分类数据 
	 * @param { Object } record 表格行数据 
	 * @return
	 */
	const getChildList = (record: any) => {
		return new Promise((resolve, reject) => {
			request({
				url: import.meta.env.VITE_NODE_URL + "/businessObjectCategory/getProductCategoryByPid",
				params: { parentId: record.id, dataType }
			}).then((res) => {
				if (Array.isArray(res.data) && res.data.length) {
					console.log(res.data)
					resolve(res.data.map((item) => {
						item.parentName = record.categoryName
						if (record.treeLevel <= 1) {
							item.children = []
						}
						return item
					}))
				} else {
					reject([])
				}
			})
		})
	}

	/**
	 * 处理展开行改变事件 
	 * @param { String } keys 分类id 
	 * @return
	 */
	const handleExpandedRowsChange = (keys: any[]) => {
		state.expandedRowKeys = keys
	}

	return {
		...toRefs(state),
		formRef,
		handleSubmit,
		handleAddFirst,
		handleAddChild,
		handleCancel,
		handleEdit,
		handleSearch,
		handleDelete,
		paginationChange,
		handleExpand,
		handleExpandedRowsChange,
		filterInputCategoryName
	};
}