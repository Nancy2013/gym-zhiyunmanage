/**
 * 石台硒茶分支
 */
import { RouteRecordRaw, _RouteRecordBase } from "vue-router";
import report from './report'; // 报表总览模块
export const stAuthority: any[] = [
	{
		level: 0,
		path: "/stLogin",
		name: "stLogin",
		component: () => import("@/layouts/stRoutes/stLogin.vue"),
	},
	{
		// 石台硒生态公共服务平台
		level: 0,
		path: "/stPublic",
		name: "stPublic",
		component: () => import("@/layouts/stRoutes/stPublic.vue"),
		children: [
			{
				level: 1,
				icon: "home",
				path: "/stPublic/dashboard",
				name: "dashboard",
				title: "首页",
				meta: { title: "首页" },
				component: () => import("@/layouts/stRoutes/pages/dashboard/index.vue"),
			},
			{
				level: 1,
				icon: "dashboard",
				path: "/stPublic/application",
				name: "application",
				title: "应用中心",
				meta: { title: "应用中心" },
				component: () =>
					import("@/layouts/stRoutes/pages/application/index.vue"),
			},
			{
				level: 2,
				path: "/stPublic/application/authorizationReview",
				name: "authorizationReview",
				title: "授权审核",
				meta: { title: "授权审核" },
				component: () =>
					import("@/layouts/stRoutes/pages/authorizationReview/index.vue"),
			},
			{
				level: 2,
				path: "/stPublic/application/brandManagement",
				name: "brandManagement",
				title: "品牌管理",
				meta: { title: "品牌管理" },
				component: () =>
					import("@/layouts/stRoutes/pages/brandManagement/index.vue"),
			},
			{
				level: 2,
				path: "/stPublic/application/certificationAudit",
				name: "certificationAudit",
				title: "认证审核",
				meta: { title: "认证审核" },
				component: () =>
					import("@/layouts/stRoutes/pages/certificationAudit/list/index.vue"),
			},
			{
				level: 3,
				path: '/stPublic/application/certificationAudit/detail',
				name: 'detail',
				title: '详情',
				meta: { title: '详情' },
				component: () => import("@/layouts/stRoutes/pages/certificationAudit/detail/index.vue")
			},
			{
				level: 2,
				path: "/stPublic/application/laborEmployment",
				name: "laborEmployment",
				title: "劳务用工",
				meta: { title: "劳务用工" },
				component: () =>
					import("@/layouts/stRoutes/pages/laborEmployment/index.vue"),
			},
			{
				level: 2,
				path: "/stPublic/application/policyRelease",
				name: "policyRelease",
				title: "政策发布",
				meta: { title: "政策发布" },
				component: () =>
					import("@/layouts/stRoutes/pages/policyRelease/index.vue"),
			},
			{
				level: 2,
				path: "/stPublic/application/productManagement",
				name: "productManagement",
				title: "产品管理",
				meta: { title: "产品管理" },
				component: () =>
					import("@/layouts/stRoutes/pages/productManagement/index.vue"),
			},
			{
				level: 2,
				path: "/stPublic/application/teaGardenProperty",
				name: "teaGardenProperty",
				title: "茶园确权",
				meta: { title: "茶园确权" },
				component: () =>
					import("@/layouts/stRoutes/pages/teaGardenProperty/list/index.vue"),
			},
			{
				level: 2,
				path: "/stPublic/application/teaGardenProperty/detail",
				name: "teaGardenPropertyDetail",
				title: "详情",
				meta: { title: "详情" },
				component: () =>
					import("@/layouts/stRoutes/pages/teaGardenProperty/detail/detail.vue"),
			},
			{
				level: 2,
				path: "/stPublic/application/traceabilityAnalysis",
				name: "traceabilityAnalysis",
				title: "溯源分析",
				meta: { title: "溯源分析" },
				component: () =>
					import("@/layouts/stRoutes/pages/traceabilityAnalysis/index.vue"),
			},
			{
				level: 2,
				path: "/stPublic/application/videoMonitor",
				name: "videoMonitor",
				title: "视频监控",
				meta: { title: "视频监控" },
				component: () =>
					import("@/layouts/stRoutes/pages/videoMonitor/index.vue"),
			},
			{
				level: 2,
				path: '/stPublic/application/message',
				name: 'message',
				title: '消息中心',
				meta: { title: '消息中心' },
				component: () => import("@/layouts/stRoutes/pages/message/index.vue")
			},
			{
				level: 2,
				path: "/stPublic/application/codeAuthorize",
				name: "codeAuthorize",
				title: "码量授权",
				meta: { title: "码量授权" },
				component: () =>
					import("@/layouts/stRoutes/pages/codeAuthorize/list/index.vue"),
			},
			{
				level: 2,
				path: "/stPublic/application/enterprise/codeAuthorize",
				name: "enterpriseCodeAuthorize",
				title: "码量授权",
				meta: { title: "码量授权" },
				component: () =>
					import("@/layouts/stRoutes/pages/enterprise/codeAuthorize/list/index.vue"),
			},
			...report,
		],
	},
];
