import { reactive, toRefs, ref, toRef, onMounted } from "vue";
import request from "@/utils/axios";
import { Modal, message } from "ant-design-vue";
import { attrTypeOptions } from "@/utils/config"
import { useRouter, useRoute } from "vue-router";
import { filterFileSize } from "@/utils/filter"
import { sourceFlagDict } from "@/utils/dict"
import filterInputHook from '@/hooks/useFilterInput'
import { setBreamubTitle } from '@/utils/setBreamubTitle'

import { filterFloatInput, filterNumInput, filterWordInput } from '@/utils/input'
import { objectAndProductDataTypeDict } from '@/utils/dict'
import { renderFormList, formRules } from './config'


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
	const dataType = objectAndProductDataTypeDict.product
	const state = reactive({
		attributeTableKey: 0,
		formData: { name: "", categoryId: null, sourceFlag: 0 } as any,
		renderFormList: renderFormList,
		visible: false,
		objectClassOptions: [] as any,
		formRules,
		imageFormRules,
		attributeColumns,
		imageColumns,
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
			params: { id: route.query.id, dataType }
		}).then((res: any) => {
			const { name, categoryId, productNo, barCode, unit, price, remark, id, firstCategoryId, secondCategoryId } = res.data
			state.formData = { name, categoryId, productNo, barCode, unit, price, remark, id }
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
			const categoryList: any = []
			new Promise((resolve, reject) => {
				getObjectClassList().then((firstOptions: any) => {
					if (firstCategoryId) {
						categoryList.push(firstCategoryId)
						for (let i = 0; i < firstOptions.length; i++) {
							if (firstOptions[i].value == firstCategoryId) {
								getObjectClassList(firstCategoryId).then((secondOptions: any) => {
									firstOptions[i].children = secondOptions
									if (secondCategoryId) {
										for (let j = 0; j < secondOptions.length; j++) {
											if (secondOptions[j].value == secondCategoryId) {
												getObjectClassList(secondCategoryId).then((options) => {
													secondOptions[j].children = options
													categoryList.push(categoryId)
													resolve(firstOptions)
												})
											}
										}
										categoryList.push(secondCategoryId)
									} else {
										categoryList.push(categoryId)
										resolve(firstOptions)
									}
								})
							}
						}
					} else {
						categoryList.push(categoryId)
						resolve(firstOptions)
					}
				})
			}).then((result: any) => {
				state.renderFormList[2].options = result
				//state.objectClassOptions = result
				state.formData.categoryId = categoryList
			})
		})
	}

	/**
	 * 获取产品分类
	 * @param { String } parentId 上级分类的id
	 * @return
	 */
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

	if (route.query.id) {
		setBreamubTitle("编辑产品")
		getObjectDetail()
	} else {
		getObjectClassList().then((options: any) => {
			state.renderFormList[2].options = options
		});
	}




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

	state.renderFormList[2].loadData = loadData

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
			const params = { ...result[0], dataType, brandId: 1, brandName: '正力新能' }, attributeData: any = {}, categoryId = params.categoryId
			params.categoryId = categoryId[categoryId.length - 1]
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
			console.log(params)
			//return
			// 编辑
			if (state.formData.id) {
				params.id = state.formData.id
				request({
					url: import.meta.env.VITE_NODE_URL + "/businessObject/edit",
					type: "json",
					method: "post",
					data: params
				}).then((res) => {
					message.success('编辑产品成功')
					router.go(-1)
				})
			} else {   // 新增
				request({
					url: import.meta.env.VITE_NODE_URL + "/businessObject/add",
					type: "json",
					method: "post",
					data: params
				}).then((res) => {
					message.success('新增产品成功')
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
		filterFloatInput,
		filterNumInput,
		filterWordInput,
		addFormRef,
		loadData,
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