import { reactive, toRefs, ref } from "vue";
import { useRouter } from "vue-router";
import request from "@/utils/axios";
import { Modal, message } from "ant-design-vue";
import { RenderFormItem } from '@/components/form/form'

export const searchRenderList: RenderFormItem[] = [
	{
		label: '模板名称/关联对象',
		key: 'name',
		type: 'input',
		placeholder: '模板名称/关联对象'
  }
]


const columns = [
	{
		dataIndex: "name",
		key: "name",		
		title: "模板名称",
	},
	{
		dataIndex: "boName",
		key: "boName",		
		title: "关联对象",
	},
	{
		key: "categoryName",
		title: "对象分类名称",		
		dataIndex: "categoryName",
	},
	{
		key: "createUserName",
		title: "创建人",
		dataIndex: "createUserName",
	},
	{
		key: "createdTime",
		title: "创建时间",
		dataIndex: "createdTime",
	},
	{
		key: "action",
		title: "操作",		
		dataIndex: "action",
		width: 180
	},
];


export default function () {
	const formRef = ref();
	const router = useRouter();
	const state = reactive({
		searchData: { name: "" },
		columns,
		loading: true,
		dataSource: [],
		searchRenderList,
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
		state.loading = true
		const { pagination: { current, pageSize } } = state;
		request({
			url: import.meta.env.VITE_NODE_URL + "/businessObjectTemplate/list",
			type: "json",
			method: "post",
			data: { ...state.searchData, pageNum: current, pageSize },
		}).then((res) => {
			state.loading = false
			state.dataSource = res.rows as any;
			state.pagination = {
				total: res.total,
				current,
				pageSize
			}
		}).catch(() => {
			state.loading = false
		})
	};

	getTableList();

	/**
	 * 点击列表编辑按钮时触发
	 * @param { Object } record 模板数据
	 * @return
	 */
	const handleEdit = (record: any) => {
		router.push({ name: 'addProductTemplate', params: { type: 'edit' }, query: { id: record.id } })
	};

	/**
	 * 点击列表复制按钮时触发
	 * @param { Object } record 模板数据
	 * @return
	 */
	const handleCopy = (record: any) => {
		router.push({ name: 'addProductTemplate', params: { type: 'copy' }, query: { id: record.id } });
	};

	/**
	 * 点击添加按钮时触发
	 * @param
	 * @return
	 */
	const handleAdd = () => {
		router.push({ name: 'addProductTemplate', params: { type: 'add' } });
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