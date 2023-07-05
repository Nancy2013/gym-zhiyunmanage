import { useAction, useState } from '@/hooks'
import { useRoute } from "vue-router";
import { defineComponent, reactive, toRefs, onMounted } from "vue"
import rzshIcon from '@/assets/image/rzshIcon.png'
import cyqqIcon from '@/assets/image/cyqqIcon.png'
import sqshIcon from '@/assets/image/sqshIcon.png'
import grayPpglIcon from '@/assets/image/grayPpglIcon.png'
import grayCpglIcon from '@/assets/image/grayCpglIcon.png'
import graysyjxIcon from '@/assets/image/graySyxiIcon.png'
import ssjkIcon from '@/assets/image/ssjkIcon.png'
import lwygIcon from '@/assets/image/lwygIcon.png'
import zcfbIcon from '@/assets/image/zcfbIcon.png'
import dzIcon from '@/assets/image/dzIcon.png'
// 服务数据
const services = {
    rzfw: [
        {
            icon: rzshIcon,
            color: 'rgb(0 220 197 / 30%)',
            title: '认证审核',
            label: '对申请入驻的茶企进行审核',
            path: '/stPublic/application/certificationAudit'
        },
        {
            icon: cyqqIcon,
            color: 'rgb(255 144 63 / 30%)',
            title: '茶园确权',
            label: '对入驻茶企茶园进行审核确权',
            path: '/stPublic/application/teaGardenProperty'
        },
        {
            icon: sqshIcon,
            color: 'rgb(165 174 41 / 30%)',
            title: '授权审核',
            label: '对各角色的码量申请进行审核',
            path: '/stPublic/application/authorizationReview'
        }
    ],
    ppfw: [
        {
            icon: grayPpglIcon,
            color: 'rgb(0 220 197 / 30%)',
            title: '品牌管理',
            label: '对产业品牌的生命周期管理',
            path: '/stPublic/application/brandManagement'
        }
    ],
    cpsy: [
        {
            icon: grayCpglIcon,
            color: 'rgb(0 220 197 / 30%)',
            title: '产品管理',
            label: '查看所有可溯产品',
            path: '/stPublic/application/productManagement'
        },
        {
            icon: graysyjxIcon,
            color: 'rgb(255 144 63 / 30%)',
            title: '溯源解析',
            label: '对可溯产品进行溯源监管',
            path: '/stPublic/application/traceabilityAnalysis'
        }
    ],
    qtfw: [
        {
            icon: ssjkIcon,
            color: 'rgb(0 220 197 / 30%)',
            title: '实时监控',
            label: '查看所有数字化茶园和茶厂',
            path: '/stPublic/application/videoMonitor'
        },
        {
            icon: lwygIcon,
            color: 'rgb(255 144 63 / 30%)',
            title: '劳务用工',
            label: '管控产业内劳务用工情况',
            path: '/stPublic/application/laborEmployment'
        },
        {
            icon: zcfbIcon,
            color: 'rgb(165 174 41 / 30%)',
            title: '政策发布',
            label: '发布最新产业政策',
            path: '/stPublic/application/policyRelease'
        }
    ]
}
export default defineComponent({
    setup() {
        const route = useRoute()
        const storeState = useState('stModule', ['userInfo'])
        const storeAction = useAction('stModule', ['asyncUpdateIsStBreamub', 'asyncUpdateStSelectedKeys'])
        const state = reactive({
            services,
            dzIcon
        })

        onMounted(() => {
            const { asyncUpdateIsStBreamub, asyncUpdateStSelectedKeys } = storeAction
            asyncUpdateIsStBreamub({ isStBreamub: false })
            asyncUpdateStSelectedKeys({ stSelectedKeys: [route.path] })
        })

        return {
            ...toRefs(state),
            ...storeState
        }
    }
})