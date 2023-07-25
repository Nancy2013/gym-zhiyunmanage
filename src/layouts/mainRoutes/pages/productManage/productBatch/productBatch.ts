import { defineComponent, reactive, toRefs, ref } from "vue";
import request from "@/utils/axios";
import { Modal, message } from "ant-design-vue";
import dayjs from 'dayjs'
import { tableColumns, formRules, renderList, searchRenderList } from './config'


export default function () {
	const formRef = ref();
	const state = reactive({
		searchData: { name: "" },
		objectOptions: [] as any[],
		formData: {} as any,
		visible: false,
		columns: tableColumns,
		formRules,
		searchRenderList,
		loading: true,
		renderList: renderList,
		dataSource: [],
		pagination: {
			total: 0,
			current: 1,
			pageSize: 10,
		},
	});

	/**
	 * 获取产品批次列表
	 * @param
	 * @return
	 */
	const getTableList = () => {
		state.loading = true
		const {
			pagination: { current, pageSize },
		} = state;
		request({
			url: import.meta.env.VITE_NODE_URL + "/businessBatchObject/pageQuery",
			type: "json",
			method: "post",
			data: { ...state.searchData, pageNum: current, pageSize },
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
			state.dataSource = [];
		});
	};


	/**
	 * 获取产品列表
	 * @param
	 * @return
	 */
	const getObjectOptions = () => {
		request({
			url: import.meta.env.VITE_NODE_URL + "/businessObject/pageQueryProduct",
			type: "json",
			method: "post",
			data: { pageSize: 999 },
		}).then((res) => {
			state.renderList[0].options = res.rows.map((item: any) => {
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
		state.formData = {}
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