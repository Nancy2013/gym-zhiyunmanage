import request from "@/utils/axios";

const formatData=(url:string,method:string,params:any)=>{
    const data={
        url:import.meta.env.VITE_NODE_URL +url,
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
    // 区域配置
    // 查询区域分配数据
    queryRegion: (params:any) => request(formatData('/region/list','post',params)),
    // 新增区域配置接口
    addRegion:(params:any) => request(formatData('/region/addItem','post',params)),
    // 修改区域配置接口
    editRegion:(params:any) => request(formatData('/region/editItem','post',params)),
    // 删除区域接口
    delRegion:(params:any) => request(formatData('/region/delete','get',params)),
    // 根据关联区域名称id查询区域详情
    detailRegion:(params:any) => request(formatData('/region/detail','get',params)),
    // 获取地区接口
    getAddressTree: (params:any)  =>request(formatData('/geo/getAddressTree','get',params)),
    

    // 批次分配
    // 查询批次列表
    queryBatch:(params:any) => request(formatData('/deployBatch/deployList','post',params)),
    // 新增批次配置
    addBatch:(params:any) => request(formatData('/deployBatch/addDeployBatch','post',params)),
    // 修改批次配置
    editBatch:(params:any) => request(formatData('/deployBatch/updateDeployBatch','post',params)),
    // 删除批次分配订单
    delBatch:(params:any) => request(formatData('/deployBatch/delete','get',params)),
    // 查询批次配置详情接口
    detailBatch:(params:any) => request(formatData('/deployBatch/detail','get',params)),
    // 根据配置id查询未分配批次
    queryUndeployBatch:(params:any) => request(formatData('/deployBatch/getEditProductBatch','get',params)),
    // 获取区域list
    queryRegionList:(params:any) => request(formatData('/deployBatch/regionList','post',params)),
    // 查询对象列表（批次配置页，产品下拉框）
    queryProductList:(params:any) => request(formatData('/businessObject/getProductList','get',params)),
    // 获取批次list （批次配置页，选择批次下拉框）
    queryBatchList:(params:any) => request(formatData('/businessBatchObject/batchList','get',params)),

    // 防窜查询
    // 查询防窜记录
    queryRecord:(params:any) => request(formatData('/securityRecord/thermalList','post',params)),
    // 获取防窜坐标数组
    queryRecordCoord:(params:any) => request(formatData('/securityRecord/getInfo','post',params)),
    // 根据id 查询查验记录详情(防窜查验图)
    detailRecord:(params:any) => request(formatData('/securityRecord/getSecurityRecordInfoDetail','get',params)),
    // 处理防窜记录
    handleRecord:(params:any) => request(formatData('/securityRecord/handleRecord','post',params)),
};