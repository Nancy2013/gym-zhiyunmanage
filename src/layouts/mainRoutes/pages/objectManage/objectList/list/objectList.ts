import { reactive, toRefs, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import request from "@/utils/axios";
import { Modal, message } from "ant-design-vue";
import { sourceFlagDict, syncStatusDict } from "@/utils/dict"


const columns = [
	{
		dataIndex: "name",
		key: "name",
		align: "center",
		title: "对象名称",
	},
	{
		dataIndex: "categoryName",
		key: "categoryName",
		align: "center",
		title: "对象分类名称",
	},
	{
		key: "sourceFlag",
		title: "是否可溯源",
		align: "center",
		dataIndex: "sourceFlag",
	},
	{
		key: "syncStatus",
		title: "同步状态",
		align: "center",
		dataIndex: "syncStatus",
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
	fieldA: [
		{ required: true, message: '请输入对象分类名称', trigger: 'blur' },
	]
}

export default function () {
	const formRef = ref();
	const router = useRouter();
	const state = reactive({
		searchData: { name: "", categoryId: null },
		formData: { fieldA: "", fieldB: null },
		objectClassOptions: [] as any,
		visible: false,
		columns,
		rules,
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
		getObjectClassList();
		getTableList();
	});

	const getObjectClassList = () => {
		request({
			url: import.meta.env.VITE_NODE_URL + "/businessObjectCategory/pageQuery",
			type: "json",
			method: "post",
			data: { pageSize: 9999 },
		}).then((res) => {
			state.objectClassOptions = res.rows.map((item: any) => {
				return {
					label: item.categoryName,
					value: item.id,
				};
			});
		});
	};

	/**
	 * 获取对象列表
	 * @param
	 * @return
	 */
	const getTableList = () => {
		const {
			pagination: { current, pageSize },
		} = state;
		request({
			url: import.meta.env.VITE_NODE_URL + "/businessObject/pageQuery",
			type: "json",
			method: "post",
			data: { ...state.searchData, pageNum: current, pageSize },
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
			path: "/objectManage/addObject",
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
		router.push({ path: "/objectManage/addObject" });
	};

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
		handleSubmit,
		handleCancel,
		handleEdit,
		handleAdd,
		handleSearch,
		paginationChange,
		handleFresh,
	};
}