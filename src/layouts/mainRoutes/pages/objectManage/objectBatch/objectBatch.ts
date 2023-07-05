import { defineComponent, reactive, toRefs, ref } from "vue";
import request from "@/utils/axios";
import { Modal, message } from "ant-design-vue";
import dayjs from 'dayjs'


const columns = [
	{
		dataIndex: "batchNo",
		key: "batchNo",
		align: "center",
		title: "批次编号",
	},
	{
		key: "batchTitle",
		title: "批次标题",
		align: "center",
		dataIndex: "batchTitle",
	},
	{
		key: "batchDate",
		title: "批次日期",
		align: "center",
		dataIndex: "batchDate",
	},
	{
		key: "batchResponorUser",
		title: "负责人",
		align: "center",
		dataIndex: "batchResponorUser",
	},
	{
		key: "boName",
		title: "对象名称",
		align: "center",
		dataIndex: "boName",
	},
	{
		key: "categoryName",
		title: "对象分类",
		align: "center",
		dataIndex: "categoryName",
	},
	{
		key: "warrantyPeriod",
		title: "质保期",
		align: "center",
		dataIndex: "warrantyPeriod",
	},
	{
		key: "remark",
		title: "说明",
		align: "center",
		dataIndex: "remark",
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


const formRules = {
	boId: [
		{ required: true, message: '请输入对象名称', trigger: 'blur' },
	],
	batchNo: [
		{ required: true, message: '请输入批次编号', trigger: 'blur' },
	],
	batchTitle: [
		{ required: true, message: '请输入批次标题', trigger: 'blur' },
	]
}


export default function () {
	const formRef = ref();
	const state = reactive({
		searchData: { name: "" },
		objectOptions: [] as any[],
		formData: {} as any,
		visible: false,
		columns,
		formRules,
		labelCol: { span: 6 },
		wrapperCol: { span: 14 },
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
		const {
			pagination: { current, pageSize },
		} = state;
		request({
			url: import.meta.env.VITE_NODE_URL + "/businessBatchObject/pageQuery",
			type: "json",
			method: "post",
			data: { ...state.searchData, pageNum: current, pageSize },
		})
			.then((res) => {
				state.dataSource = res.rows as any;
				state.pagination = {
					total: res.total,
					current,
					pageSize,
				};
			})
			.catch(() => {
				state.dataSource = [];
			});
	};

	const getObjectOptions = () => {
		request({
			url: import.meta.env.VITE_NODE_URL + "/businessObject/pageQuery",
			type: "json",
			method: "post",
			data: { pageSize: 999 },
		}).then((res) => {
			console.log(res);
			state.objectOptions = res.rows.map((item: any) => {
				return {
					label: item.name,
					value: item.id,
				};
			});
		});
	};

	getTableList();
	getObjectOptions();

	/**
	 * 新增/编辑弹框点击确定事件
	 * @param
	 * @return
	 */
	const handleSubmit = () => {
		formRef.value.validate().then((formData: any) => {
			const paramsData = { ...formData };
			if (paramsData.batchDate) {
				paramsData.batchDate = dayjs(paramsData.batchDate).format("YYYY-MM-DD");
			}
			if (Array.isArray(paramsData.dates) && paramsData.dates.length) {
				paramsData.warrantyPeriod = `${dayjs(paramsData.dates[0]).format(
					"YYYY-MM-DD"
				)} - ${dayjs(paramsData.dates[1]).format("YYYY-MM-DD")}`;
				delete paramsData.dates;
			}
			// 编辑
			if (state.formData.id) {
				paramsData.id = state.formData.id;
				request({
					url: import.meta.env.VITE_NODE_URL + "/businessBatchObject/edit",
					type: "json",
					method: "post",
					data: paramsData,
				}).then((res) => {
					message.success("编辑对象批次成功");
					getTableList();
					handleCancel();
				});
			} else {
				// 新增
				request({
					url: import.meta.env.VITE_NODE_URL + "/businessBatchObject/add",
					type: "json",
					method: "post",
					data: paramsData,
				}).then((res) => {
					message.success("新增对象批次成功");
					getTableList();
					handleCancel();
				});
			}
		});
	};

	/**
	 * 新增/编辑弹框点击取消事件
	 * @param
	 * @return
	 */
	const handleCancel = () => {
		formRef.value.resetFields();
		state.visible = false;
	};

	/**
	 * 点击列表编辑按钮时触发
	 * @param { Object } record
	 * @return
	 */
	const handleEdit = (record: any) => {
		const { batchDate, productionDate, beyondShelfLifeDate } = record;
		state.formData.id = record.id;
		state.formData.boId = record.boId;
		state.formData.batchNo = record.batchNo;
		state.formData.batchTitle = record.batchTitle;
		state.formData.batchResponorUser = record.batchResponorUser;
		if (record.batchDate) {
			state.formData.batchDate = ref(dayjs(batchDate));
		}
		if (productionDate && beyondShelfLifeDate) {
			state.formData.dates = ref([
				dayjs(productionDate),
				dayjs(beyondShelfLifeDate),
			]);
		}
		state.formData.remark = record.remark;
		state.visible = true;
	};

	/**
	 * 点击列表删除按钮时触发
	 * @param { Object } record
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
						url: import.meta.env.VITE_NODE_URL + "/businessBatchObject/del",
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
		handleSubmit,
		handleDelete,
		handleCancel,
		handleEdit,
		handleSearch,
		handleFresh,
		paginationChange,
	};
}