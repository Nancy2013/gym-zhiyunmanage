import request from "@/utils/axios";

const formatData=(url:string,method:string,params:any,system:string='VITE_REPORT_URL')=>{
    const data={
        url:import.meta.env[`${system}`] +url,
        type: "json",
        method,
    } as any
    if(method==='get'){
        data.params=params;
    }else{
        data.data=params;
    }
    return data;
};

export default {
    // 查询品牌 TODO
    queryBrand:(params:any) => request(formatData('/teaReport/tenantQuery','post',params)),

    // 品牌管理-码量授权趋势
    queryCode: (params:any) => request(formatData('/teaReport/codeAuthorizeRanking','post',params)),

    // 企业经营分析
    queryCertification: (params:any) => request(formatData('/teaReport/tenantQuery','post',params)),

    // 茶青交易
    queryTeaWork: (params:any) => request(formatData('/teaReport/teaWorkAnalysis','post',params)),

    // 订单管理-销售订单分析
    orderAnalyse: (params:any) => request(formatData('/reportView/brandSaleAmountOneYear','post',params)),
    // 订单管理-产品销量排行
    saleRank: (params:any) => request(formatData('/reportView/productSalesVolume','post',params)),

    // 员工管理
    queryStaff: (params:any) => request(formatData('/reportView/staffPageQuery','post',params)),

    // 工单管理-产量分析
    queryProduceAnalysis: (params:any) => request(formatData('/teaReport/actualProduceAnalysis','post',params)),
    // 工单管理-农事分析
    queryFarmingAnalysis: (params:any) => request(formatData('/teaReport/farmingWorkAnalysis','post',params)),
   

    // 溯源管理
    queryTrace:(params:any) => request(formatData('/reportView/scanCodePageQuery','post',params)),

    // 防伪验证
    queryCheckCode: (params:any) => request(formatData('/teaReport/checkCoderanking','post',params)),

    // 窜货预警
    queryAlarm: (params:any) => request(formatData('/teaReport/securityRecordRanking','post',params)),
    // 窜货预警-查询城市
    queryCity: (params:any) => request(formatData('/geo/getAddressTree','get',params,'VITE_NODE_URL')),

    // 品牌活动
    queryBrandActivity: (params:any) => request(formatData('/reportView/brandActivityStatistics','post',params)),

    // 账户管理
    queryAccount: (params:any) => request(formatData('/reportView/getLoginLogByEnterprise','post',params)),

    // 劳务供需
    queryLabour: (params:any) => request(formatData('/reportView/labourStatistics','post',params)),

    // 分销管理-分销商采购
    purchaseAnalyse: (params:any) => request(formatData('/teaReport/dtPurchaseOrders','post',params)),
    // 分销管理-分销商排行
    rankAnalyse: (params:any) => request(formatData('/teaReport/dtPurchaseOrderRanking','post',params)),

    // 码上营销
    queryCodeMarket: (params:any) => request(formatData('/reportView/promotionReprotView','post',params)),
    // 码上营销-活动类型
    queryDicts:(params:any) => request(formatData('/dict/listDictsByCode','get',params,'VITE_BASE_URL')),
    
    // 仓储管理-出入库统计
    storageStatistics: (params:any) => request(formatData('/reportView/warehouseInOutStatistics','post',params)),
    // 仓储管理-出入库明细
    storageDetail: (params:any) => request(formatData('/reportView/warehouseInOutDetails','post',params)),
    // 物料分类 TODO
    queryMaterialClass:(params:any) => request(formatData('/teaReport/tenantQuery','post',params)),

    // 农资管理
    queryAgricultural:(params:any) => request(formatData('/reportView/farmStockStatistics','post',params)),

    // 设备管理 TODO
    queryDevice:(params:any) => request(formatData('/teaReport/tenantQuery','post',params)),

    // 内容管理
    queryContent:(params:any) => request(formatData('/reportView/announcementStatistics','post',params)),

    
    // 导出 TODO
    exportData: (params:any) => request(formatData('/teaReport/codeAuthorizeRanking','post',params)),
};