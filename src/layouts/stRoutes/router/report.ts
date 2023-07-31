const report=[
    {
        level: 1,
        icon: "",
        path: "/stPublic/report",
        name: "report",
        title: "报表总览",
        meta: { title: "报表总览" },
        // component: () =>
        // 	import("@/layouts/stRoutes/pages/report/index.vue"),
    },
    { // 品牌管理
        level: 2,
        icon: "",
        path: "/stPublic/report/brandManage",
        name: "brandManageReport",
        title: "码量授权趋势",
        meta: { title: "码量授权趋势" },
        component: () =>
            import("@/layouts/stRoutes/pages/report/brandManage/index.vue"),
    },
    { // 企业认证
        level: 2,
        icon: "",
        path: "/stPublic/report/certificationAudit",
        name: "certificationAuditReport",
        title: "企业经营分析",
        meta: { title: "企业经营分析" },
        component: () =>
            import("@/layouts/stRoutes/pages/report/certificationAudit/index.vue"),
    },
    { // 茶青交易
        level: 2,
        icon: "",
        path: "/stPublic/report/teaWork",
        name: "teaWorkReport",
        title: "茶青产能分析",
        meta: { title: "茶青产能分析" },
        component: () =>
            import("@/layouts/stRoutes/pages/report/teaWork/index.vue"),
    },
    { // 订单管理-销售订单分析
        level: 2,
        icon: "",
        path: "/stPublic/report/orderManage/orderAnalyse",
        name: "orderAnalyseReport",
        title: "销售订单分析",
        meta: { title: "销售订单分析" },
        component: () =>
            import("@/layouts/stRoutes/pages/report/orderManage/orderAnalyse.vue"),
    },
    { // 订单管理-产品销量排行
        level: 2,
        icon: "",
        path: "/stPublic/report/orderManage/saleRank",
        name: "saleRankReport",
        title: "产品销量排行",
        meta: { title: "产品销量排行" },
        component: () =>
            import("@/layouts/stRoutes/pages/report/orderManage/saleRank.vue"),
    },
    { // 员工管理
        level: 2,
        icon: "",
        path: "/stPublic/report/staffManage",
        name: "staffReport",
        title: "用户数量分析",
        meta: { title: "用户数量分析" },
        component: () =>
            import("@/layouts/stRoutes/pages/report/staffManage/index.vue"),
    },
    { // 工单管理-产量分析
        level: 2,
        icon: "",
        path: "/stPublic/report/workOrderManage/produceAnalysis",
        name: "produceAnalysisReport",
        title: "产量分析",
        meta: { title: "产量分析" },
        component: () =>
            import("@/layouts/stRoutes/pages/report/workOrderManage/produceAnalysis.vue"),
    },
    { // 工单管理-农事分析
        level: 2,
        icon: "",
        path: "/stPublic/report/workOrderManage/farmingAnalysis",
        name: "farmingAnalysisReport",
        title: "农事分析报表",
        meta: { title: "农事分析报表" },
        component: () =>
            import("@/layouts/stRoutes/pages/report/workOrderManage/farmingAnalysis.vue"),
    },
    { // 溯源管理
        level: 2,
        icon: "",
        path: "/stPublic/report/traceManage",
        name: "traceReport",
        title: "产品流通分析",
        meta: { title: "产品流通分析" },
        component: () =>
            import("@/layouts/stRoutes/pages/report/traceManage/index.vue"),
    },		
    { // 防伪验证
        level: 2,
        icon: "",
        path: "/stPublic/report/antiFake",
        name: "antiFakeReport",
        title: "防伪验证排行",
        meta: { title: "防伪验证排行" },
        component: () =>
            import("@/layouts/stRoutes/pages/report/antiFake/index.vue"),
    },
    { // 窜货预警
        level: 2,
        icon: "",
        path: "/stPublic/report/securityAlarm",
        name: "alarmReport",
        title: "窜货预警分析",
        meta: { title: "窜货预警分析" },
        component: () =>
            import("@/layouts/stRoutes/pages/report/securityAlarm/index.vue"),
    },
    { // 品牌活动
        level: 2,
        icon: "",
        path: "/stPublic/report/brandActivity",
        name: "activityReport",
        title: "品牌活动报表",
        meta: { title: "品牌活动报表" },
        component: () =>
            import("@/layouts/stRoutes/pages/report/brandActivity/index.vue"),
    },
    { // 账户管理
        level: 2,
        icon: "",
        path: "/stPublic/report/accountManage",
        name: "accountReport",
        title: "账户登录分析",
        meta: { title: "账户登录分析" },
        component: () =>
            import("@/layouts/stRoutes/pages/report/accountManage/index.vue"),
    },
    { // 劳务供需
        level: 2,
        icon: "",
        path: "/stPublic/report/labourService",
        name: "labourReport",
        title: "劳务供需报表",
        meta: { title: "劳务供需报表" },
        component: () =>
            import("@/layouts/stRoutes/pages/report/labourService/index.vue"),
    },
    { // 分销管理-分销商采购分析
        level: 2,
        icon: "",
        path: "/stPublic/report/saleManage/purchaseAnalyse",
        name: "purchaseAnalyseReport",
        title: "分销商采购分析",
        meta: { title: "分销商采购分析" },
        component: () =>
            import("@/layouts/stRoutes/pages/report/saleManage/purchaseAnalyse.vue"),
    },
    { // 分销管理-分销商排行分析
        level: 2,
        icon: "",
        path: "/stPublic/report/saleManage/rankAnalyse",
        name: "rankAnalyseReport",
        title: "分销商排行分析",
        meta: { title: "分销商排行分析" },
        component: () =>
            import("@/layouts/stRoutes/pages/report/saleManage/rankAnalyse.vue"),
    },
    { // 码上营销
        level: 2,
        icon: "",
        path: "/stPublic/report/codeMarket",
        name: "marketReport",
        title: "码上营销分析",
        meta: { title: "码上营销分析" },
        component: () =>
            import("@/layouts/stRoutes/pages/report/codeMarket/index.vue"),
    },
    { // 仓储管理-出入库统计
        level: 2,
        icon: "",
        path: "/stPublic/report/storageManage/outinStatistics",
        name: "outinStatisticsReport",
        title: "出入库统计",
        meta: { title: "出入库统计" },
        component: () =>
            import("@/layouts/stRoutes/pages/report/storageManage/outinStatistics.vue"),
    },
    { // 仓储管理-出入库明细
        level: 2,
        icon: "",
        path: "/stPublic/report/storageManage/outinDetail",
        name: "outinDetailReport",
        title: "出入库明细",
        meta: { title: "出入库明细" },
        component: () =>
            import("@/layouts/stRoutes/pages/report/storageManage/outinDetail.vue"),
    },
    { // 农资管理
        level: 2,
        icon: "",
        path: "/stPublic/report/agriculturalManage",
        name: "agriculturalReport",
        title: "农资类型分析",
        meta: { title: "农资类型分析" },
        component: () =>
            import("@/layouts/stRoutes/pages/report/agriculturalManage/index.vue"),
    },
    { // 设备管理
        level: 2,
        icon: "",
        path: "/stPublic/report/deviceManage",
        name: "adeviceReport",
        title: "设备使用情况",
        meta: { title: "设备使用情况" },
        component: () =>
            import("@/layouts/stRoutes/pages/report/deviceManage/index.vue"),
    },
    { // 内容管理
        level: 2,
        icon: "",
        path: "/stPublic/report/contentManage",
        name: "contentReport",
        title: "内容数据分析",
        meta: { title: "内容数据分析" },
        component: () =>
            import("@/layouts/stRoutes/pages/report/contentManage/index.vue"),
    },
    { // 实时监控-茶园监控
        level: 2,
        icon: "",
        path: "/stPublic/report/realtimeMonitor/teaGardenMonitor",
        name: "monitorReport",
        title: "示范茶园监控",
        meta: { title: "示范茶园监控" },
        component: () =>
            import("@/layouts/stRoutes/pages/report/realtimeMonitor/teaGardenMonitor.vue"),
    },
    { // 实时监控-茶园四情
        level: 2,
        icon: "",
        path: "/stPublic/report/realtimeMonitor/teaGardenCondition",
        name: "conditionReport",
        title: "示范茶园四情",
        meta: { title: "示范茶园四情" },
        component: () =>
            import("@/layouts/stRoutes/pages/report/realtimeMonitor/teaGardenCondition.vue"),
    },
];

export default report;