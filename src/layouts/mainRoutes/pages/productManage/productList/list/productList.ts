import { reactive, toRefs, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import request from "@/utils/axios";
import { Modal, message } from "ant-design-vue";
import { sourceFlagDict, syncStatusDict } from "@/utils/dict"
import { tableColumns } from './config'
import { objectAndProductDataTypeDict } from '@/utils/dict'
import { RenderFormItem } from '@/components/form/form'



export default function () {
	const dataType = objectAndProductDataTypeDict.product
	const formRef = ref();
	const router = useRouter();
	const state = reactive({
		searchData: {} as any,
		visible: false,
		columns: tableColumns,
		dataSource: [],
		loading: true,
		pagination: {
			total: 0,
			current: 1,
			pageSize: 10,
		},
		syncStatusColor: {
			[syncStatusDict.notSync]: 'default',
			[syncStatusDict.synchronized]: "success",
			[syncStatusDict.syncError]: "error"
		}
	});

	onMounted(() => {
		getObjectClassList().then((options: any) => {
			searchRenderList.value[1].options = options
		});
		getTableList();
	});

	/**
	 * 加载数据
	 * @param { Array } selectedOptions
	 * @return
	 */
	const loadData = (selectedOptions: any) => {
		const targetOption = selectedOptions[selectedOptions.length - 1];
		targetOption.loading = true;
		getObjectClassList(targetOption.value).then((options) => {
			targetOption.loading = false
			targetOption.children = options
		}).catch(() => {
			targetOption.children = []
		})
	}

	const getObjectClassList = (parentId = 0) => {
		return new Promise((resolve, reject) => {
			request({
				url: import.meta.env.VITE_NODE_URL + "/businessObjectCategory/getProductCategoryByPid",
				params: { parentId },
			}).then((res) => {
				if (Array.isArray(res.data) && res.data.length) {
					resolve(res.data.map((item: any) => {
						return {
							label: item.categoryName,
							value: item.id,
							isLeaf: item.treeLevel >= 3
						};
					}))
				} else {
					reject([])
				}
			}).catch(() => {
				reject([])
			})
		})
	};



	/**
	 * 获取对象列表
	 * @param
	 * @return
	 */
	const getTableList = () => {
		state.loading = true
		const { pagination: { current, pageSize } } = state;
		const paramsData = { ...state.searchData }
		if (Array.isArray(paramsData.categoryId) && paramsData.categoryId.length) {
			paramsData.treeLevel = paramsData.categoryId.length
			paramsData.categoryId = paramsData.categoryId[paramsData.categoryId.length - 1]
		}
		request({
			url: import.meta.env.VITE_NODE_URL + "/businessObject/pageQueryProduct",
			type: "json",
			method: "post",
			data: { ...paramsData, pageNum: current, pageSize, dataType },
		}).then((res) => {
			state.loading = false
			state.dataSource = res.rows.map((item: any, key: number) => {
				item.tableIndex = (current - 1) * pageSize + key + 1
				return item
			}) as any;
			state.pagination = {
				total: res.total,
				current,
				pageSize,
			};
		}).catch(() => {
			state.loading = false
		})
	};

	/**
	 *重置分页
	 *
	 */
	const initPagination = () => {
		state.pagination = {
			total: 0,
			current: 1,
			pageSize: 10,
		};
	};

	/**
	 * 点击对象分类名称时触发
	 * @param
	 * @return
	 */
	const handleSearch = () => {
		initPagination();
		getTableList();
	};
	/**
	 * 新增/编辑弹框点击确定事件
	 * @param
	 * @return
	 */
	const handleSubmit = () => {
		formRef.value.validate().then((params: any) => { });
	};

	/**
	 * 新增/编辑弹框点击取消事件
	 * @param
	 * @return
	 */
	const handleCancel = () => {
		formRef.value.resetFields();
	};

	/**
	 * 点击列表编辑按钮时触发
	 * @param
	 * @return
	 */
	const handleEdit = (column: any) => {
		router.push({ name: 'addProduct', params: { type: 'edit' }, query: { id: column.id }, });
	};

	/**
	 * 点击添加按钮时触发
	 * @param
	 * @return
	 */
	const handleAdd = () => {
		router.push({ name: 'addProduct', params: { type: 'add' } });
	};

	/**
	 * 点击下载excel模板时触发
	 * @param
	 * @return
	 */
	const handleDownload = () => {
		let aEle: any = document.createElement("a");
		aEle.href = '/productTemplate.xlsx';
		aEle.download = "productTemplate.xlsx";
		aEle.click();
	}

	/**
	 * 上传excel时触发
	 * @param
	 * @return
	 */
	const handleUpload = (event: any) => {
		let formData = new FormData()
		formData.append('file', event.target.files[0])
		event.srcElement.value = ""
		request({
			url: `${import.meta.env.VITE_NODE_URL}/businessObject/excel-import`,
			data: formData,
			method: 'post',
			headers: {
				'Content-Type': 'multipart/form-data'
			},
		}).then((res) => {
			getTableList()
		})
	}

	/**
	 * 点击批量导入时触发
	 * @param
	 * @return
	 */
	const handleImport = () => {
		const element = document.getElementById('download')
		element?.click()
	}

	/**
	 * 点击删除按钮时触发
	 * @param { Object } record 删除的列表项
	 * @return
	 */
	const handleDelete = (record: any) => {
		Modal.confirm({
			title: "提示",
			content: "确认要删除该条数据",
			centered: true,
			onOk() {
				return new Promise((resolve, reject) => {
					request({
						url: import.meta.env.VITE_NODE_URL + "/businessObject/del",
						type: "json",
						method: "get",
						params: { id: record.id },
					})
						.then(() => {
							resolve(true);
							message.success("删除成功");
							getTableList();
						})
						.catch(() => {
							reject();
						});
				});
			},
		});
	};

	/**
	 *分页
	 *
	 * @param {*} pagination
	 */
	const paginationChange = (pagination: any) => {
		let { current, pageSize, total } = pagination;
		state.pagination = { current, pageSize, total };
		getTableList();
	};

	/**
	 *表格刷新
	 *
	 */
	const handleFresh = () => {
		initPagination();
		getTableList();
	};

	const searchRenderList = ref<RenderFormItem[]>([
		{
			label: '产品编号/名称',
			key: 'name',
			type: 'input',
			placeholder: '产品编号/名称'
		},
		{
			label: '产品分类',
			key: 'categoryId',
			type: 'cascader',
			options: [],
			placeholder: '选择产品分类',
			loadData: loadData
		}
	])

	return {
		...toRefs(state),
		sourceFlagDict,
		syncStatusDict,
		handleDelete,
		searchRenderList,
		formRef,
		loadData,
		handleSubmit,
		handleCancel,
		handleEdit,
		handleAdd,
		handleDownload,
		handleUpload,
		handleImport,
		handleSearch,
		paginationChange,
		handleFresh,
	};
}