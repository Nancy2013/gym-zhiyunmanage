<template>
    <FcTitle title="茶园基本信息" :icon="basicInfoImg"></FcTitle>
    <div class="teaGardenProperty-detailBox">
		<DetailItem v-for="(item, key) in baseInfoRenderList" :key="key" :item="item" :value="teaConfirmData[item.key]"></DetailItem>
    </div>
	<div class="teaGardenProperty-space"></div>
	<FcTitle title="核心信息" :icon="coreInfoImg"></FcTitle>
	<div class="teaGardenProperty-detailBox">
		<DetailItem  :item="breedRenderData" :value="teaConfirmData.teaCategoryNum"></DetailItem>
		<div class="teaGardenProperty-detail-row" v-for="(breedItem, breedKey) in teaConfirmData.teaCategoryList" :key="breedKey">
			<DetailItem v-for="(item, key) in coreInfoRenderList" :key="key" :item="item" :value="breedItem[item.key]"></DetailItem>
		</div>
    </div>
	<div class="teaGardenProperty-space"></div>
	<FcTitle title="联系信息" :icon="contactInfoImg"></FcTitle>
	<div class="teaGardenProperty-detailBox">
		<DetailItem v-for="(item, key) in contactInfoRenderList" :key="key" :item="item" :value="teaConfirmData[item.key]"></DetailItem>
    </div>

	<div class="teaGardenProperty-status">
		<div class="teaGardenProperty-cricle" v-if="teaConfirmData.authorizedStatus == teaConfirmStatusDict.reject"></div>
		<div class="teaGardenProperty-reason" v-if="teaConfirmData.authorizedStatus == teaConfirmStatusDict.reject && teaConfirmData.reason">{{ teaConfirmData.reason }}</div>
		<div :class="`teaGardenProperty-tag teaGardenProperty-tag-${teaConfirmData.authorizedStatus}`">{{ teaConfirmData.authorizedStatusName }}</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, ref } from "vue";
import FcTitle from '@/layouts/stRoutes/components/title/title'
import basicInfoImg from '@/assets/image/shitai/teaGardenProperty/basicInfo.png'
import coreInfoImg from '@/assets/image/shitai/teaGardenProperty/coreInfo.png'
import contactInfoImg from '@/assets/image/shitai/teaGardenProperty/contactInfo.png'
import DetailItem from './detailItem'
import { baseInfoRenderList, coreInfoRenderList, contactInfoRenderList, breedRenderData} from './config'
import { Modal, message, Image } from 'ant-design-vue';
import request from '@/utils/axios'
import { useRoute } from "vue-router";
import { teaConfirmStatusDict } from '@/utils/dict'
export default defineComponent({
    components: {
		FcTitle,
		Image,
		DetailItem
    },
	setup() {
		const route = useRoute()

		const teaConfirmId = ref(route.query.id)

		const teaConfirmData = ref<any>({})

		/**
         获取茶园确权详情
         @param { String } id 茶园确权id
         @return
         */
		const getTeaConfirmInfo = (id:any) => {
			request({
                url: `${import.meta.env.VITE_XICHA_URL}/authorized/query`,
                type: "json",
                method: "post",
                data: { id: id },
			}).then((res: any) => {
				if (Array.isArray(res.data.teaCategoryList) && res.data.teaCategoryList.length) {
					res.data.teaCategoryNum = res.data.teaCategoryList.length
				} else {
					res.data.teaCategoryNum = 0
				}
				typeof res.data.imageUrl === 'string' && (res.data.imageUrl = res.data.imageUrl.split(','))
				res.data.authorizedStatusName = teaConfirmStatusDict[res.data.authorizedStatus] || ""
				teaConfirmData.value = res.data
			})
		}

		getTeaConfirmInfo(teaConfirmId.value)
		
		return {
			teaConfirmId,
			teaConfirmData,
			basicInfoImg,
			coreInfoImg,
			contactInfoImg,
            baseInfoRenderList,
			coreInfoRenderList,
			contactInfoRenderList,
			breedRenderData,
			teaConfirmStatusDict
		}

    }
})
</script>

<style scoped lang='less'>
.teaGardenProperty-detailBox {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    padding: 40px 60px;
	border-radius: 2px;
}


.teaGardenProperty-space {
	height: 20px;
	background-color: #F6F8FA;
}

.teaGardenProperty-status {
	position: absolute;
	right: 32px;
	top: -64px;
	height: 32px;
	display: flex;
	flex-direction: row;
	align-items: center;
}

.teaGardenProperty-detail-row {
	width: 100%;
	display: flex;
	flex-direction: row;
	align-items: center;
}

.teaGardenProperty-tag {
	height: 32px;
	width: 66px;
	line-height: 32px;
	text-align: center;
	border-radius: 2px;
}

.teaGardenProperty-cricle {
	width: 6px;
	height: 6px;
	margin-right: 10px;
	border-radius: 50%;
	background-color: #D81E06;
}

.teaGardenProperty-reason {
	margin-right: 30px;
}

.teaGardenProperty-tag-3 {
	background-color: #FDE6E6;
	color: #D81E06;
}

.teaGardenProperty-tag-2 {
	background-color: #E6ECFC;
	color: #185EF0;
}

.teaGardenProperty-tag-1 {
	background-color: #FBEBD0;
	color: #FF8814;
}

.teaGardenProperty-tag-0 {
	color: #999;
	background-color: #f0f2f5;
}
</style>