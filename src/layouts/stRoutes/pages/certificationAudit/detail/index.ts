import { defineComponent, onMounted,onBeforeUnmount, reactive, toRefs } from "vue";
import request from "@/utils/axios";
import { useRoute,useRouter } from "vue-router";
import Panel from './../components/panel/index.vue';
import baseIcon from '@/assets/image/baseIcon.png';
import coreIcon from '@/assets/image/coreIcon.png';
import contactIcon from '@/assets/image/contactIcon.png';
import {approvalStatusOptions} from '../list/config'
import { useAction, useState } from '@/hooks';

export default defineComponent({
  components:{
    Panel,
  },
  setup() {
    const route = useRoute();
    const router = useRouter()
    const storeAction = useAction('stModule',['asyncUpdateApprovalStatus', 'asyncUpdateReason'])
    const state = reactive({
      info: "" as any,
      id:'' as any,
      loading:true,
      dataSource:{} as any,
      approvalStatusOptions,
    });

    onMounted(() => {
      state.id = route.query.id;
      detail();
    });

    // 详情
    const detail = () => {
      const params={
        id:state.id,
      }
      
      request({
        url: `${import.meta.env.VITE_XICHA_URL}/query`,
        type: "json",
        method: "post",
        data:params,
      }).then(res=>{
        console.log("res.data", res);
        const {code,data}=res;
      if (code == 200) {
        state.info = data;
        formatData(state.info);
        const {approvalStatus,reason=''}=data as any;
        const { asyncUpdateApprovalStatus, asyncUpdateReason } = storeAction
        asyncUpdateApprovalStatus({approvalStatus})
        asyncUpdateReason({reason,})

      }
      state.loading=false;
      }).catch(e=>{
        state.loading=false;
      });
    };

    /**
     *格式化展示数据
     *
     * @param {*} info
     */
    const formatData=(info:any)=>{
      const {companyName,shortName,organizeType,address,identityPortraitUrl,nationalEmblemUrl,businessLicense,permitUrl,seleniumContentReport}=info;
      const {provinceName='',cityName='',districtName='',detailAddress=''}=address;
      const registerAddress=`${provinceName}${cityName}${districtName}${detailAddress}`;
      
      // 企业基本信息
      const baseInfo=[
        {
          label:'企业名称',
          value:companyName,
          required: true,
        },
        {
          label:'企业简称',
          value:shortName,
          required: true,
        },
        {
          label:'组织类型',
          value:organizeType,
          required: true,
        },
        {
          label:'注册地址',
          value:registerAddress,

        },
        {
          label:'法人身份证',
          value:[identityPortraitUrl,nationalEmblemUrl],
          required: true,
          type:'img',
        },
        {
          label:'营业执照',
          value:[businessLicense],
          required: true,
          type:'img',
        },
        {
          label:'硒含量检测报告',
          value:[seleniumContentReport],
          required: true,
          type:'img',
          key:'report',
        },
        {
          label:'生产许可证',
          value:[permitUrl],
          type:'img',
        },
      ];

      const {teaGardenSelf,plantingArea=0,productionLineNum,brandSelf,brandUrl='',brandName='',staffNum}=info;
      const teaGardenSelfValue=teaGardenSelf===1?`种植面积 ${plantingArea} 亩`:'否';
      
      const brand=brandName?`品牌名称 ${brandName}`:'';
      const brandText=brandSelf===1?brand:'否';
      // 核心信息
      const coreInfo=[
        {
          label:'是否自有茶园',
          value:teaGardenSelfValue,
        },
        {
          label:'年产量',
          value:`${plantingArea} kg`,
          required: true,
        },
        {
          label:'产线数',
          value:productionLineNum,
          required: true,
        },
        {
          label:'工人数',
          value:staffNum,
          required: true,
        },
        {
          label:'是否自有品牌',
          value:brandSelf===1?[brandUrl]:brandText,
          text:brandText,
          type:brandSelf===1?'img':'',
          key:'brandUrl',
        },
      ];

      const {contactsName,contactsPhone,wechatId}=info;
      // 联系信息
      const contactInfo=[
        {
          label:'联系人',
          value:contactsName,
          required: true,
        },
        {
          label:'联系电话',
          value:contactsPhone,
          required: true,
        },
        {
          label:'微信号',
          value:wechatId,
        },
      ];

      const dataSource={
        baseInfo:{
          title:'企业基本信息',
          img:baseIcon,
          data:baseInfo,
        },
        coreInfo:{
          title:'核心信息',
          img:coreIcon,
          data:coreInfo,
        },
        contactInfo:{
          title:'联系信息',
          img:contactIcon,
          data:contactInfo,
        },
      };

      state.dataSource=dataSource;
    }

    /**
     *返回
     *
     */
    const back=()=>{
      router.back();
    };

    onBeforeUnmount(()=>{
      // 重置审核状态
      const { asyncUpdateApprovalStatus, asyncUpdateReason } = storeAction
      asyncUpdateApprovalStatus({approvalStatus:-1})
      asyncUpdateReason({reason:''})
    });

    return {
      ...toRefs(state),
      back,
    };
  },
});
