export interface detailRenderItem {
	label: String
	key: string
	type: 'text' | 'img'
	require?: boolean,
	width?: string
}

export const baseInfoRenderList: detailRenderItem[] = [
	{
		label: '茶园名称：',
		key: 'teaGardenName',
		type: 'text',
		require: true
	},
	{
		label: '经纬度：',
		key: 'latitudeLongitude',
		type: 'text'
	},
	{
		label: '海拔：',
		key: 'altitude',
		type: 'text'
	},
	{
		label: '含硒量：',
		key: 'selenium',
		type: 'text'
	},
	{
		label: '茶园面积：',
		key: 'teaGardenArea',
		type: 'text',
		require: true
	},
	{
		label: '茶园介绍：',
		key: 'introduce',
		type: 'text',
		width: '75%'
	},
	{
		label: '茶园地址：',
		key: 'teaGardenAddress',
		type: 'text',
		width: '100%',
		require: true
	},
	{
		label: '茶园图片：',
		key: 'imageUrl',
		type: 'img',
		width: '100%'
	}
]

export const breedRenderData: detailRenderItem = {
	label: '茶树品种数量：',
	key: 'teaCategoryNum',
	type: 'text',
	width: '100%'
}

export const coreInfoRenderList: detailRenderItem[] = [
	{
		label: '品种：',
		key: 'teaTreeCategory',
		type: 'text',
		width: '25%'
	},
	{
		label: '茶龄：',
		key: 'age',
		type: 'text',
		width: '25%'
	},
	{
		label: '年产量：',
		key: 'production',
		type: 'text',
		width: '50%'
	}
]

export const contactInfoRenderList: detailRenderItem[] = [
	{
		label: '负责人：',
		key: 'head',
		type: 'text'
	},
	{
		label: '联系电话：',
		key: 'headPhone',
		type: 'text'
	},
]