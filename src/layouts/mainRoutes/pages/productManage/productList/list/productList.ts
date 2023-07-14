import { reactive, toRefs, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import request from "@/utils/axios";
import { Modal, message } from "ant-design-vue";
import { sourceFlagDict, syncStatusDict } from "@/utils/dict"
import { tableColumns } from './config'
import { objectAndProductDataTypeDict } from '@/utils/dict'



export default function () {
	const dataType = objectAndProductDataTypeDict.product
	const formRef = ref();
	const router = useRouter();
	const state = reactive({
		searchData: {} as any,
		formData: { fieldA: "", fieldB: null },
		objectClassOptions: [] as any,
		visible: false,
		columns: tableColumns,
		labelCol: { span: 6 },
		wrapperCol: { span: 14 },
		dataSource: [],
		pagination: {
			total: 0,
			current: 1,
			pageSize: 10,
		},
		syncStatusColor: {
			[syncStatusDict.notSync]: 'processing',
			[syncStatusDict.synchronized]: "success",
			[syncStatusDict.syncError]: "error"
		}
	});

	onMounted(() => {
		getObjectClassList().then((options) => {
			state.objectClassOptions = options
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
			state.dataSource = res.rows as any;
			state.pagination = {
				total: res.total,
				current,
				pageSize,
			};
		});
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
		router.push({
			path: "/productManage/addProduct",
			query: {
				id: column.id
			},
			title: '编辑对象'
		} as any);
	};

	/**
	 * 点击添加按钮时触发
	 * @param
	 * @return
	 */
	const handleAdd = () => {
		router.push({ path: "/productManage/addProduct" });
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
			console.log(res)
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

	return {
		...toRefs(state),
		sourceFlagDict,
		syncStatusDict,
		handleDelete,
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