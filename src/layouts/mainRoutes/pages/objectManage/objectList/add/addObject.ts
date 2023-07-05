import { reactive, toRefs, ref, toRef, onMounted } from "vue";
import request from "@/utils/axios";
import { Modal, message } from "ant-design-vue";
import { attrTypeOptions } from "@/utils/config"
import { useRouter, useRoute } from "vue-router";
import { filterFileSize } from "@/utils/filter"
import { sourceFlagDict } from "@/utils/dict"
import filterInputHook from '@/hooks/useFilterInput'
import { setBreamubTitle } from '@/utils/setBreamubTitle'

const formRules = {
	name: [
		{ required: true, message: '请输入对象名称', trigger: 'blur' },
	],
	categoryId: [
		{ required: true, message: '请选择对象分类名称', trigger: 'blur' },
	],
	sourceFlag: [
		{ required: true, message: '请选择是否可溯源', trigger: 'blur' },
	]
}

const imageFormRules = {
	imgPath: [
		{ required: true, message: '请上传对象分类图片', trigger: 'blur' },
	],
}


const attributeColumns = [
	{
		dataIndex: "index",
		key: "index",
		align: "center",
		title: "序号",
	},
	{
		dataIndex: "attrNameCn",
		key: "attrNameCn",
		align: "center",
		title: "属性名",
	},
	{
		key: "attrNameEn",
		title: "属性英文名",
		align: "center",
		dataIndex: "attrNameEn",
	},
	{
		key: "attrIndex",
		title: "属性排序",
		align: "center",
		dataIndex: "attrIndex",
	},
	{
		key: "attrValue",
		title: "属性值",
		align: "center",
		dataIndex: "attrValue",
	},
	{
		key: "attrType",
		title: "隐私类型",
		align: "left",
		width: '160px',
		dataIndex: "attrType",
	},
	{
		key: "action",
		title: "操作",
		align: "center",
		dataIndex: "action",
	},
];

const imageColumns = [
	{
		dataIndex: "index",
		key: "index",
		align: "center",
		title: "序号",
	},
	{
		dataIndex: "imgPath",
		key: "imgPath",
		align: "center",
		title: "产品图片",
	},
	{
		key: "fileSize",
		title: "文件大小",
		align: "center",
		dataIndex: "fileSize",
	},
	{
		key: "remark",
		title: "说明",
		align: "center",
		dataIndex: "remark",
	},
	{
		key: "action",
		title: "操作",
		align: "center",
		dataIndex: "action",
	},
];


export default function () {
	const state = reactive({
		attributeTableKey: 0,
		formData: { name: "", categoryId: null, sourceFlag: 0 } as any,
		visible: false,
		objectClassOptions: [] as any,
		labelCol: { xxl: { span: 2 }, xl: { span: 3 }, lg: { span: 4 }, md: { span: 5 }, sm: { span: 6 }, xs: { span: 8 }, },
		formRules,
		imageFormRules,
		attributeColumns,
		imageColumns,
		wrapperCol: { xxl: { span: 4 }, xl: { span: 6 }, lg: { span: 8 }, md: { span: 10 }, sm: { span: 12 }, xs: { span: 14 } }
	});

	const formRef = ref()
	const addFormRef = ref();
	const router = useRouter();
	const route = useRoute()
	const filterInputName = filterInputHook(state.formData, 'name', { type: 'notSymbol' })
	const attributeTableFormRef = ref()
	const attributeTableList = reactive<any[]>([])

	const imageTableList = reactive<any[]>([])

	const attributeFormData = reactive<any>({})

	const imageFormData = reactive<any>({
		imgPath: [],
		remark: ""
	})


	onMounted(() => {
		getObjectClassList()
	})

	/**
	 * 获取对象详情
	 * @param
	 * @return
	 */
	const getObjectDetail = () => {
		request({
			url: import.meta.env.VITE_NODE_URL + "/businessObject/detail",
			type: "json",
			method: "get",
			params: { id: route.query.id }
		}).then((res: any) => {
			state.formData = {
				name: res.data.name,
				categoryId: res.data.categoryId,
				sourceFlag: res.data.sourceFlag,
				id: res.data.id
			}
			for (let i = 0; i < res.data.businessObjectAttrBOList.length; i++) {
				const attributeItem = res.data.businessObjectAttrBOList[i]
				Object.keys(attributeItem).map((key) => {
					attributeFormData[`${state.attributeTableKey}-${key}`] = attributeItem[key]
				})
				attributeTableList.push({
					attributeTableKey: state.attributeTableKey++
				})
			}
			for (let i = 0; i < res.data.businessObjectImgBOList.length; i++) {
				const { imgPath, fileSize, remark } = res.data.businessObjectImgBOList[i]
				imageTableList.push({ imgPath, fileSize, remark })
			}
		})
	}

	if (route.query.id) {
		setBreamubTitle("编辑对象")
		getObjectDetail()
	}


	/**
	 * 获取对象分类名称可选项
	 * @param
	 * @return
	 */
	const getObjectClassList = () => {
		request({
			url: import.meta.env.VITE_NODE_URL + "/businessObjectCategory/pageQuery",
			type: "json",
			method: "post",
			data: { pageSize: 9999 }
		}).then((res) => {
			state.objectClassOptions = res.rows.map((item: any) => {
				return {
					label: item.categoryName,
					value: item.id
				}
			})

		})
	}

	/**
	 * 点击添加属性时触发
	 * @param
	 * @return
	 */
	const handleAddAttribute = () => {
		attributeTableList.push({
			attributeTableKey: state.attributeTableKey++
		})
	}

	/**
	 * 点击添加图片时触发
	 * @param
	 * @return
	 */
	const handleAddImage = () => {
		state.visible = true
	}

	/**
	 * 提交添加图片
	 * @param
	 * @return
	 */
	const submitAddImage = () => {
		addFormRef.value.validate().then((params: any) => {
			console.log(params)
			imageTableList.push({
				imgPath: params.imgPath[0].response.data,
				fileSize: params.imgPath[0].size,
				remark: params.remark
			})
			cancelAddImage()
		})
	}

	/**
	 * 添加图片弹框点击取消事件
	 * @param
	 * @return
	 */
	const cancelAddImage = () => {
		addFormRef.value.resetFields()
		imageFormData.remark = ""
		state.visible = false
	}

	/**
	 * 点击删除属性表格列时触发
	 * @param
	 * @return
	 */
	const deleteAttributeRow = (index: number, tableKey: any) => {
		Object.keys(attributeFormData).forEach((key) => {
			if (parseInt(key) == tableKey) {
				delete attributeFormData[key]
			}
		})
		attributeTableList.splice(index, 1)
	}

	/**
	 * 点击删除图片表格列时触发
	 * @param
	 * @return
	 */
	const deleteImageRow = (index: number) => {
		imageTableList.splice(index, 1)
	}

	/**
	 * 点击提交按钮时触发
	 * @param
	 * @return
	 */
	const handleSubmit = () => {
		Promise.all([formRef.value.validate(), attributeTableFormRef.value.validate()]).then((result) => {
			const params = { ...result[0] }, attributeData: any = {}
			Object.keys(result[1]).map((item) => {
				const index = item.split('-')[0], key = item.split('-')[1]
				if (!attributeData[index]) {
					attributeData[index] = {}
				}
				attributeData[index][key] = result[1][item]
			})
			params.businessObjectAttrReqList = Object.keys(attributeData).map((attributeKey) => {
				return attributeData[attributeKey]
			})
			params.businessObjectImgReqList = imageTableList.map((imageTableItem) => {
				return {
					...imageTableItem
				}
			})
			// 编辑
			if (state.formData.id) {
				params.id = state.formData.id
				request({
					url: import.meta.env.VITE_NODE_URL + "/businessObject/edit",
					type: "json",
					method: "post",
					data: params
				}).then((res) => {
					message.success('编辑对象成功')
					router.go(-1)
				})
			} else {   // 新增
				request({
					url: import.meta.env.VITE_NODE_URL + "/businessObject/add",
					type: "json",
					method: "post",
					data: params
				}).then((res) => {
					message.success('新增对象成功')
					router.go(-1)
				})
			}

		})
	}

	/**
	 * 点击取消按钮时触发
	 * @param
	 * @return
	 */
	const handleCancel = () => {
		router.go(-1)
	}

	/**
	 * 是否可溯源switch改变时触发
	 * @param
	 * @return
	 */
	const handleChangeSourceFlag = (value: any) => {

		if (value === sourceFlagDict.can) {
			message.warning("若对象可溯源，在对象模板中则可添加溯源入口，C端角色可实现对象溯源", 5)
		} else if (value === sourceFlagDict.cannot) {
			message.warning("若对象不可溯源，在对象模板中无法添加溯源入口，任何C端角色都不可溯源", 5)
		}
	}

	return {
		...toRefs(state),
		formRef,
		filterInputName: filterInputName.filterInput,
		handleSubmit,
		handleCancel,
		addFormRef,
		attributeTableFormRef,
		attrTypeOptions,
		attributeTableList,
		imageTableList,
		attributeFormData,
		imageFormData,
		handleAddAttribute,
		deleteAttributeRow,
		deleteImageRow,
		handleAddImage,
		submitAddImage,
		cancelAddImage,
		filterFileSize,
		handleChangeSourceFlag
	}
}