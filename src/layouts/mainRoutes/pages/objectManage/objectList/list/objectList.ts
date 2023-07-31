import { reactive, toRefs, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import request from "@/utils/axios";
import { Modal, message } from "ant-design-vue";
import { sourceFlagDict, syncStatusDict, objectAndProductDataTypeDict } from "@/utils/dict"
import { tableColumns } from './config'
import { RenderFormItem } from '@/components/tsx/form'





const rules = {
	fieldA: [
		{ required: true, message: '请输入对象分类名称', trigger: 'blur' },
	]
}

export default function () {
	const dataType = objectAndProductDataTypeDict.object
	const formRef = ref();
	const router = useRouter();
	const state = reactive({
		searchData: {  } as any,
		formData: { fieldA: "", fieldB: null },
		visible: false,
		columns: tableColumns,
		rules,
		loading: true,
		labelCol: { span: 6 },
		wrapperCol: { span: 14 },
		dataSource: [],
		pagination: {
			total: 0,
			current: 1,
			pageSize: 10,
		},
		objectInfo: {} as any,
		syncStatusColor: {
			[syncStatusDict.notSync]: 'processing',
			[syncStatusDict.synchronized]: "success",
			[syncStatusDict.syncError]: "error"
		}
	});

	onMounted(() => {
		getObjectClassList().then((options: any) => {
			searchRenderList.value[1].options = options
		}).catch(() => {
			searchRenderList.value[1].options = []
		})
		getTableList();
	});

	/**
	 * 获取对象分类
	 * @param { String } parentId 分类id
	 * @return
	 */
	const getObjectClassList = (parentId = 0) => {
		return new Promise((resolve, reject) => {
			request({
				url: import.meta.env.VITE_NODE_URL + "/businessObjectCategory/getByParentId",
				params: { parentId, dataType },
			}).then((res) => {
				if (Array.isArray(res.data) && res.data.length) {
					resolve(res.data.map((item: any) => {
						return {
							label: item.categoryName,
							value: item.id,
							isLeaf: Boolean(parentId)
						};
					}))
				} else {
					reject([])
				}

			});
		})

	};

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
			url: import.meta.env.VITE_NODE_URL + "/businessObject/pageQueryBO",
			type: "json",
			method: "post",
			data: { ...paramsData, pageNum: current, pageSize },
		}).then((res) => {
			state.loading = false
			state.dataSource = res.rows as any;
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
	const handleView = (column: any) => {
		request({
			url: import.meta.env.VITE_NODE_URL + "/businessObject/detail",
			params: { id: column.id, dataType }
		}).then((res: any) => {
			if (Array.isArray(res.data.businessObjectAttrBOList) && res.data.businessObjectAttrBOList.length) {
				state.objectInfo = res.data
				state.visible = true
			} else {
				message.warning('暂无对象详情数据')
			}
			
		})
	};

	/**
	 * 点击添加按钮时触发
	 * @param
	 * @return
	 */
	const handleAdd = () => {
		router.push({ path: "/objectManage/addObject" });
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
			label: '对象名称',
			key: 'name',
			type: 'input',
			placeholder: '对象名称'
		},
		{
			label: '对象分类名称',
			key: 'categoryId',
			type: 'cascader',
			loadData: loadData,
			placeholder: '对象分类名称',
			options: []
		},
	])

	return {
		...toRefs(state),
		sourceFlagDict,
		syncStatusDict,
		formRef,
		handleSubmit,
		handleCancel,
		searchRenderList,
		handleView,
		loadData,
		handleAdd,
		handleSearch,
		paginationChange,
		handleFresh,
	};
}