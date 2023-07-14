import request from "@/utils/axios";

const formatData=(url:string,method:string,params:any,system:string='VITE_NODE_URL')=>{
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
    // 查看列表
    queryCode: (params:any) => request(formatData('/codeAuthorize/list','post',params)),
    // 查看详情
    detailCode: (params:any) => request(formatData('/codeAuthorize/getDetail','get',params)),
    // 添加码量授权
    addCode: (params:any) => request(formatData('/codeAuthorize/add','post',params)),
    // 审核码量授权
    updateCode: (params:any) => request(formatData('//codeAuthorize/update','post',params)),
    // 查询品牌
    queryBrand: (params:any) => request(formatData('/codeAuthorize/getDetail','get',params)),
};