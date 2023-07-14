import request from "@/utils/axios";

const formatData=(url:string,method:string,params:any,env?:string)=>{
    const data={
        url:import.meta.env[env||'VITE_NODE_URL'] +url,
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
    // 根据ParentID获取二级对象分类列表
    queryCategoryByParentId: (params:any) => request(formatData('/businessObjectCategory/getByParentId','get',params)),
    // 获取某个字典类型下的所有字典
    queryDicts: (params:any) => request(formatData('/dict/listDictsByCode','get',params,'VITE_BASE_URL')),
    // 产品分页查询
    queryProduct: (params:any) => request(formatData('/businessObject/pageQueryProduct','post',params)),
    // 获取企业剩余码量
    queryRemainCode: (params:any) => request(formatData('/tenant/remain/count','get',params)),
};