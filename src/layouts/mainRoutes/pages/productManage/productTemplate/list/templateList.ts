import { reactive, toRefs, ref } from "vue";
import { useRouter } from "vue-router";
import request from "@/utils/axios";
import { Modal, message } from "ant-design-vue";

const columns = [
	{
		dataIndex: "name",
		key: "name",
		align: "center",
		title: "模板名称",
	},
	{
		dataIndex: "boName",
		key: "boName",
		align: "center",
		title: "关联对象",
	},
	{
		key: "categoryName",
		title: "对象分类名称",
		align: "center",
		dataIndex: "categoryName",
	},
	{
		key: "createUserName",
		title: "创建人",
		align: "center",
		dataIndex: "createUserName",
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


export default function () {
	const formRef = ref();
	const router = useRouter();
	const state = reactive({
		searchData: { name: "" },
		formData: { fieldA: "", fieldB: null },
		columns,
		dataSource: [],
		pagination: {
			total: 0,
			current: 1,
			pageSize: 10,
		},
	});

	/**
	 * 获取对象列表
	 * @param
	 * @return
	 */
	const getTableList = () => {
		const { pagination: { current, pageSize } } = state;
		request({
			url: import.meta.env.VITE_NODE_URL + "/businessObjectTemplate/list",
			type: "json",
			method: "post",
			data: { ...state.searchData, pageNum: current, pageSize },
		}).then((res) => {
			state.dataSource = res.rows as any;
			state.pagination = {
				total: res.total,
				current,
				pageSize
			}
		});
	};

	getTableList();

	/**
	 * 点击列表编辑按钮时触发
	 * @param { Object } record 模板数据
	 * @return
	 */
	const handleEdit = (record: any) => {
		router.push({
			path: "/productManage/addTemplate",
			query: { id: record.id },
		});
	};

	/**
	 * 点击列表复制按钮时触发
	 * @param { Object } record 模板数据
	 * @return
	 */
	const handleCopy = (record: any) => {
		router.push({
			path: "/productManage/addTemplate",
			query: { id: record.id, copy: 1, title: '复制对象模板' },
		});
	};

	/**
	 * 点击添加按钮时触发
	 * @param
	 * @return
	 */
	const handleAdd = () => {
		router.push({ path: "/productManage/addTemplate" });
	};

	/**
	 * 点击列表删除按钮时触发
	 * @param { Object } record 模板数据
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
						url:
							import.meta.env.VITE_NODE_URL +
							"/businessObjectTemplate/deleteTemplate",
						type: "json",
						method: "post",
						data: { id: record.id },
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
	 *重置分页
	 *
	 */
	const initPagination = () => {
		state.pagination = {
			total: 0,
			current: 1,
			pageSize: 10,
		};
	}

	/**
	 *
	 *查询按钮
	 */
	const handleSearch = () => {
		initPagination();
		getTableList();
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
		formRef,
		handleEdit,
		handleCopy,
		handleAdd,
		handleDelete,
		handleSearch,
		paginationChange,
		handleFresh,
	};
}