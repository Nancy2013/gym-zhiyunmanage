import {
  defineComponent,
  onMounted,
  reactive,
  toRefs,
  ref,
  watch,
  computed,
} from "vue";
import { Modal, message } from "ant-design-vue";
import service from "@/service/stRoutes";
import { usePage } from "@/layouts/stRoutes/pages/codeAuthorize/composables/usePage";
import {showTime} from '@/utils/function'
const columns = [
  {
    key: "index",
    dataIndex: "index",
    align: "center",
    title: "序号",
    width: 100,
  },
  {
    key: "brandName",
    dataIndex: "brandName",
    align: "center",
    title: "品牌名称",
    width: 200,
  },
  {
    key: "applyCodeNum",
    dataIndex: "applyCodeNum",
    align: "center",
    title: "申请码量",
    width: 200,
  },
  {
    key: "brandEndTime",
    dataIndex: "brandEndTime",
    align: "center",
    title: "品牌授权有效期",
    width: 200,
  },
  {
    key: "createdTime",
    dataIndex: "createdTime",
    align: "center",
    title: "申请时间",
    width: 200,
    defaultSortOrder: 'descend',
    sorter: (a: any, b: any) => {
      if(a.createdTime > b.createdTime){
        return 1;
      }
      if(a.createdTime < b.createdTime){
        return -1;
      }
      return 0;
    },
  },
  {
    key: "status",
    dataIndex: "status",
    align: "center",
    title: "审核状态",
    width: 200,
  },
  {
    key: "grantCodeNum",
    dataIndex: "grantCodeNum",
    align: "center",
    title: "发放码量",
    width: 200,
  },
  {
    key: "grantTime",
    dataIndex: "grantTime",
    align: "center",
    title: "发放时间",
    width: 200,
  },
  {
    key: "action",
    title: "操作",
    align: "center",
    dataIndex: "action",
    fixed: "right",
    width: 200,
  },
];
const TEMP_BRAND = [
  {
    brandId: 1,
    brandName: "品牌A",
  },
  {
    brandId: 2,
    brandName: "品牌B",
  },
  {
    brandId: 3,
    brandName: "品牌C",
  },
];
export default defineComponent({
  setup() {
    const formRef = ref();
    const state = reactive({
      columns,
      visible: false,
      formData: {
        id: 0,
        tenantName: "",
        brandName: "",
        applyCodeNum: "",
        createdTime: "",
        status: null as any,
        grantCodeNum: "",
        grantTime: "",
        grantRemark: "",
        applyRemark:'',
        brandId: null as any,
      },
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
      brandOptions: [] as any,
    });
    const {
      loading,
      pagination,
      status,
      statusOptions,
      search,
      dataSource,
      query,
      paginationChange,
      handleSearch,
      reset,
    } = usePage({});

    onMounted(() => {});

    // Form表单rules
    const rules = reactive({
      brandId: [{ required: true, message: "请选择品牌名称", trigger: "change" }],
      applyCodeNum: [
        { required: true, message: "请输入申请码量", trigger: "blur" },
      ],
    });

    /**
     * 关闭弹窗
     */
    const handleClose = () => {
      formRef.value && formRef.value.resetFields();
      state.formData = {} as any;
    };

    // 弹窗标题
    const title = computed(() => {
      const { id } = state.formData;
      const title = id ? "详情" : "新增";
      return title;
    });

    /**
     *查看 | 新增
     *
     * @param {*} item
     */
    const showModal = (item?: any) => {
      state.visible = true;
      state.formData = {
        ...item,
      };

      if (!item.id) {
        // 新增
        queryBrand();
      }
    };

    /**
     *隐藏弹窗
     *
     */
    const hideModal = () => {
      state.visible = false;
    };

    /**
     *提交
     *
     */
    const submit = () => {
      formRef.value.validate().then((formData: any) => {
        const { addCode } = service.codeAuthorize;
        const params = {
          ...formData,
        };
        console.log('-----submit-----',formData);
        const brand=state.brandOptions.filter((item:any)=>item.value===formData.brandId)[0];
        if(brand){
          params.brandName=brand.label;
        }
        addCode(params)
          .then((res: any) => {
            const { code } = res;
            if (code === 200) {
              message.success(`新增成功`);
              hideModal();
              query();
            }
          })
          .catch((e: any) => {
            console.error(e);
          });
      });
    };

    /**
     *查询品牌 TODO
     *
     */
    const queryBrand = () => {
      const { queryBrand } = service.codeAuthorize;
      const params = {
        id: 7,
      };
      queryBrand(params)
        .then((res: any) => {
          const { code, data } = res;
          if (code === 200) {
            state.brandOptions = TEMP_BRAND.map((item: any) => ({
              label: item.brandName,
              value: item.brandId,
            }));
          }
        })
        .catch((e: any) => {
          console.error(e);
        });
    };

    return {
      ...toRefs(state),
      formRef,
      rules,
      status,
      statusOptions,
      title,
      showModal,
      hideModal,
      handleClose,
      handleSearch,
      paginationChange,
      reset,
      submit,
      loading,
      columns,
      pagination,
      search,
      dataSource,
      showTime,
    };
  },
});
