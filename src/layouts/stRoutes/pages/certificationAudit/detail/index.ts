import {
  defineComponent,
  onMounted,
  reactive,
  toRefs,
} from "vue";
import request from "@/utils/axios";
import { useRoute, useRouter } from "vue-router";
import Panel from "./../components/panel/index.vue";
import baseIcon from "@/assets/image/baseIcon.png";
import coreIcon from "@/assets/image/coreIcon.png";
import contactIcon from "@/assets/image/contactIcon.png";

export default defineComponent({
  components: {
    Panel,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const state = reactive({
      info: "" as any,
      id: "" as any,
      loading: true,
      dataSource: {} as any,
      dicts: {} as any,
    });

    onMounted(async () => {
      state.id = route.query.id;
      await queryDicts();
      detail();
    });

    // 详情
    const detail = () => {
      const params = {
        id: state.id,
      };

      request({
        url: `${import.meta.env.VITE_XICHA_URL}/auth/query`,
        type: "json",
        method: "post",
        data: params,
      })
        .then((res) => {
          console.log("res.data", res);
          const { code, data } = res;
          if (code == 200) {
            state.info = data;
            formatData(state.info);
          }
          state.loading = false;
        })
        .catch((e) => {
          console.error(e);
          state.loading = false;
        });
    };

    // 查询企业类型 获取某个字典类型下的所有字典
    const queryDicts = async () => {
      const params = {
        dictTypeCode: "COMPANY_TYPE",
      };
      const { code, data } = await request({
        url: `${import.meta.env.VITE_BASE_URL}/dict/listDictsByCode`,
        type: "json",
        method: "get",
        params,
      });      
      if (code == 200) {
        (data as any).forEach((item: any) => {
          state.dicts[item.code] = item.name;
        });
      }
    };

    /**
     *格式化展示数据
     *
     * @param {*} info
     */
    const formatData = (info: any) => {
      const {
        tenantName,
        shortName,
        orgType,
        address,
        frontImg,
        reverseImg,
        businessLicense,
        permitUrl,
        seleniumContent,
      } = info;
      const {
        provinceName = "",
        cityName = "",
        districtName = "",
        detailAddress = "",
      } = address;
      const registerAddress = `${provinceName}${cityName}${districtName}${detailAddress}`;

      // 企业基本信息
      const baseInfo = [
        {
          label: "企业名称",
          value: tenantName,
          required: true,
        },
        {
          label: "企业简称",
          value: shortName,
          required: true,
        },
        {
          label: "组织类型",
          value: state.dicts[orgType] || orgType,
          required: true,
        },
        {
          label: "注册地址",
          value: registerAddress,
        },
        {
          label: "法人身份证",
          value: [frontImg, reverseImg],
          required: true,
          type: "img",
        },
        {
          label: "营业执照",
          value: [businessLicense],
          required: true,
          type: "img",
        },
        {
          label: "硒含量检测报告",
          value: [seleniumContent],
          required: true,
          type: "img",
          key: "report",
        },
        {
          label: "生产许可证",
          value: [permitUrl],
          type: "img",
        },
      ];

      const {
        teaGardenSelf,
        plantArea = '',
        productNum,
        brandSelf,
        brandUrl = "",
        brandName = "",
        workerNum,
        annualOutput,
      } = info;
      const teaGardenSelfValue =
        teaGardenSelf === 1 ? `种植面积 ${plantArea?plantArea:'  '} 亩` : "否";

      const brand = brandName ? `品牌名称 ${brandName}` : "";
      const brandText = brandSelf === 1 ? brand : "否";
      // 核心信息
      const coreInfo = [
        {
          label: "是否自有茶园",
          value: teaGardenSelfValue,
        },
        {
          label: "年产量",
          value: `${annualOutput} kg`,
        },
        {
          label: "产线数",
          value: productNum,
        },
        {
          label: "工人数",
          value: workerNum,
        },
        {
          label: "是否自有品牌",
          value: brandSelf === 1 ? [brandUrl] : brandText,
          text: brandText,
          type: brandSelf === 1 ? "img" : "",
          key: "brandUrl",
        },
      ];

      const { contact, contactPhone, wechatId } = info;
      // 联系信息
      const contactInfo = [
        {
          label: "联系人",
          value: contact,
          required: true,
        },
        {
          label: "联系电话",
          value: contactPhone,
          required: true,
        },
        {
          label: "微信号",
          value: wechatId,
        },
      ];

      const dataSource = {
        baseInfo: {
          title: "企业基本信息",
          img: baseIcon,
          data: baseInfo,
        },
        coreInfo: {
          title: "核心信息",
          img: coreIcon,
          data: coreInfo,
        },
        contactInfo: {
          title: "联系信息",
          img: contactIcon,
          data: contactInfo,
        },
      };

      state.dataSource = dataSource;
    };

    /**
     *返回
     *
     */
    const back = () => {
      router.back();
    };


    return {
      ...toRefs(state),
      back,
    };
  },
});
