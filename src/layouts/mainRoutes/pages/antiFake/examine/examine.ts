import { defineComponent, reactive, toRefs, ref } from "vue";
import request from "@/utils/axios";
import { columns, formRules } from './config'
import { Modal, message } from "ant-design-vue";
import { antiFakeTypeDict, antiFakeAuditStatusDict, antiFakeScenarioDict } from '@/utils/dict'
import { antiFakeTemplateAuditStatusOptions, antiFakeTemplateTypeOptions } from '@/utils/config'
import dayjs from 'dayjs'
import { isEmpty } from "@/utils/common";

export default defineComponent({
	setup() {

		const state = reactive({
			columns: columns,
			query: {} as any,
			visible: false,
			dataSource: [],
			validateStatus: "",
			formData: {} as any,
			loading: true,
			pagination: {
				total: 0,
				current: 1,
				pageSize: 10,
			},
		})


		/**
		 * 获取表格数据
		 * @param
		 * @return
		 */
		const getTableList = async () => {
			state.loading = true;
			let { pagination: { current, pageSize }, query: { name, reviewStatus } } = state;
			let res: any = await request({
				url: import.meta.env.VITE_NODE_URL + "/securityTemplate/list",
				type: "json",
				method: "post",
				data: {
					pageNum: current,
					pageSize,
					name,
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
			getTableList()
		}

		/**
		 * 显示审核弹框
		 * @param { Object } record 列表项
		 * @return
		 */
		const showExamineModal = (record: any) => {
			const { id, scenario, name, text } = record
			state.formData = { id, scenario, name, text }
			state.visible = true
		}

		/**
		 * 处理审核操作
		 * @param { String } type 操作类型
		 * @return
		 */
		const handleExamine = (type: string) => {
			const { formData: { id, reviewComment } } = state, params: any = { id, reviewComment }
			if (type === 'noPass') {
				if (isEmpty(reviewComment)) {
					state.validateStatus = 'error'
					return
				}
				params.reviewStatus = "reject"
			} else if (type === 'pass') {
				params.reviewStatus = "pass"
			}
			request({
				url: import.meta.env.VITE_NODE_URL + "/securityTemplate/editItemByCheck",
				method: "post",
				data: params,
			}).then((res) => {
				message.success('操作成功')
				state.visible = false
				getTableList()
			})
		}

		/**
		 * 弹出框关闭事件
		 * @param 
		 * @return
		 */
		const handleCancel = () => {
			state.validateStatus = ""
		}

		/**
		 * 反馈内容获取焦点事件
		 * @param { String } type 操作类型
		 * @return
		 */
		const handleFocus = () => {
			state.validateStatus = ""
		}

		/**
		 * 列表重置
		 * @return
		 */
		const reset = () => {
			state.query = {};
			state.pagination.current = 1
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
			columns,
			formRules,
			handleSearch,
			antiFakeTypeDict,
			antiFakeAuditStatusDict,
			antiFakeScenarioDict,
			reset,
			showExamineModal,
			handleExamine,
			handleFocus,
			handleCancel,
			paginationChange,
			antiFakeTemplateTypeOptions,
			antiFakeTemplateAuditStatusOptions
		}
	}
})
