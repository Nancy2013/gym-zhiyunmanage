import { defineComponent, reactive, toRefs, ref } from "vue";
import request from "@/utils/axios";
import { Modal, message } from "ant-design-vue";
import { PlusOutlined } from '@ant-design/icons-vue'
import { antiFakeTypeDict, antiFakeAuditStatusDict, antiFakeScenarioDict } from '@/utils/dict'
import { formRules, columns, antiFakeContentRenderList } from './config'
import { antiFakeTemplateAuditStatusOptions, antiFakeTemplateTypeOptions, antiFakeTemplateScenarioOptions } from '@/utils/config'
import dayjs from 'dayjs'





export default defineComponent({
	components: {
		PlusOutlined
	},
	setup() {
		const formRef = ref()
		const state = reactive({
			columns: columns,
			query: {} as any,
			visible: false,
			dataSource: [],
			formRules,
			formData: {
				scenario: '1'
			} as any,
			loading: true,
			pagination: {
				total: 0,
				current: 1,
				pageSize: 10,
			},
		})

		const getTableList = async () => {
			state.loading = true;
			let { pagination: { current, pageSize }, query: { name, type, scenario, reviewStatus } } = state;
			let res: any = await request({
				url: import.meta.env.VITE_NODE_URL + "/securityTemplate/list",
				type: "json",
				method: "post",
				data: {
					pageNum: current,
					pageSize,
					name,
					type,
					scenario,
					reviewStatus
				},
			});
			if (res.code == 200) {
				state.loading = false;
				state.dataSource = res.rows.map((item: any, key: number) => {
					item.tableIndex = (current - 1) * pageSize + key + 1
					return item
				});
				state.pagination = {
					total: res.total,
					current,
					pageSize,
				};
			} else {
				state.loading = false;
			}
		}

		getTableList()

		/**
		 * 获取对象列表
		 * @param
		 * @return
		 */
		const handleSearch = () => {
			state.pagination.current = 1
			getTableList();
		}

		/**
		 * 点击提交按钮时触发
		 * @param
		 * @return
		 */
		const handleSubmit = () => {
			formRef.value.validate().then((formData: any) => {
				const url = state.formData.id ? '/securityTemplate/editItem' : '/securityTemplate/addItem'
				const params = { ...formData }
				if (state.formData.id) {
					params.id = state.formData.id
				}
				request({
					url: import.meta.env.VITE_NODE_URL + url,
					method: "post",
					data: params
				}).then((res) => {

					message.success(state.formData.id ? '修改防伪模板成功' : '新增防伪模板成功')
					getTableList()
					handleCancel()
				})
			})
		}

		/**
		 * 点击取消按钮时触发
		 * @param
		 * @return
		 */
		const handleCancel = () => {
			state.visible = false
		}

		/**
		 * 点击添加按钮时触发
		 * @param
		 * @return
		 */
		const handleAdd = () => {
			state.formData = {
				scenario: '1'
			}
			state.visible = true
		}

		/**
		 * 点击编辑按钮时触发
		 * @param { Object } record 列表项
		 * @return
		 */
		const handleEdit = (record: any) => {
			console.log(record)
			const { name, text, scenario, id } = record
			state.formData = {
				name, text, scenario, id
			}
			state.visible = true
		}

		/**
		 * 点击删除按钮时触发
		 * @param { Object } record 列表项
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
							url: import.meta.env.VITE_NODE_URL + "/securityTemplate/delete",
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
		}

		/**
		 * 处理点击添加防伪内容事件
		 * @param { Object } antiFakeData 防伪内容选项
		 * @return
		 */
		const handleAddAntiFakeContent = (antiFakeData: any) => {
			console.log(antiFakeData)
			if (!state.formData.text) {
				state.formData.text = `{${antiFakeData.key}}`
			} else {
				state.formData.text += `{${antiFakeData.key}}`
			}
		}

		/**
		 * 列表重置
		 * @return
		 */
		const reset = () => {
			state.query = {};
			getTableList()
		};

		/**
		 * 分页查询
		 * @param { Object } pagination
		 * @return
		 */
		const paginationChange = (pagination: any) => {
			let { current, pageSize, total } = pagination;
			state.pagination = { current, pageSize, total };
			getTableList()
		};



		return {
			...toRefs(state),
			formRef,
			columns,
			handleAdd,
			handleSearch,
			handleEdit,
			handleDelete,
			reset,
			getTableList,
			paginationChange,
			handleSubmit,
			handleCancel,
			handleAddAntiFakeContent,
			antiFakeTypeDict,
			antiFakeAuditStatusDict,
			antiFakeScenarioDict,
			antiFakeContentRenderList,
			antiFakeTemplateTypeOptions,
			antiFakeTemplateScenarioOptions,
			antiFakeTemplateAuditStatusOptions
		}
	}
})
