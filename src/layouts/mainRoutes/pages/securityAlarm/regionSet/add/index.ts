import {
  defineComponent,
  reactive,
  toRefs,
  ref,
  onMounted,
  computed,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import service from '@/service/mainRoutes'
import { Tree, message } from "ant-design-vue";
const rules = {
  regionName: [{ required: true, message: "请输入区域名称", trigger: "blur" }],
};
const columns = [
  {
    dataIndex: "province",
    key: "province",
    align: "center",
    title: "省",
    width: 200,
  },
  {
    dataIndex: "city",
    key: "city",
    align: "center",
    title: "市",
  },
];
export default defineComponent({
  props: {},
  components: {
    Tree,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const formRef = ref();
    const state = reactive({
      id: route.query.id,
      data: [] as any,
      selectedKeys: [],
      checkedKeys: [],
      loading: false,
      formData: {} as any,
      labelCol: { span: 3 },
      wrapperCol: { span: 14 },
      rules,
      columns,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
      reginList: [] as any,
    });

    onMounted(() => {
      getAddressTree();
      if (state.id) {
        detailRegion();
      }
    });

    const tableData = computed(() => {
      let tableData = formatRegin();
      return tableData;
    });

    /**
     *查询tree
     *
     */
    const getAddressTree = () => {
      const { getAddressTree } = service.securityAlarmReq;
      getAddressTree()
        .then((res: any) => {
          const { code, data } = res;
          if (code === 200) {
            const newData = data.map((item: any) => {
              if (item.cities) {
                item.children = item.cities;
              }
              return item;
            });
            state.data = formatArray(newData);
          }
        })
        .catch((e: any) => {
          console.error(e);
        });
    };

    /**
     *格式化tree数据
     *
     * @param {*} arr
     * @return {*}
     */
    const formatArray = (arr: any) => {
      if (arr) {
        arr.forEach((v: any) => {
          v.title = v.name;
          v.key = `${v.id}`;
          const { children } = v;
          if (children && children.length > 0) {
            formatArray(children);
          }
        });
        return arr;
      }
    };

    /**
     *点击tree复选框
     *
     * @param {*} checkedKeys 已选中的keys
     * @param {{ checked: boolean; checkedNodes: any; node: any; event: any }} e 点击事件
     */
    const handleCheck = (
      checkedKeys: any,
      e: { checked: boolean; checkedNodes: any; node: any; event: any }
    ) => {
      console.log("----checkedKeys---2--", e);
      const { node } = e;
      if (node.parent) {
        // 子节点
        handleChildNode(e);
      } else {
        // 父节点
        handleParentNode(e);
      }
      state.reginList.sort((a:any,b:any)=>a.provinceCode-b.provinceCode);
      updatePagination();
    };

    /**
     *点击父节点
     *
     * @param {{checked: boolean, node:any}} e 点击事件
     */
    const handleParentNode = (e: { checked: boolean; node: any }) => {
      const { reginList } = state;
      const { checked, node } = e;
      const { name, key, children } = node;
      const pos = reginList.findIndex((item: any) => item.provinceCode === key);
      if (checked) {
        // 选中
        const newCitys = children.map((item: any) => ({
          city: item.name,
          cityCode: `${item.id}`,
        }));
        const province = {
          provinceCode: key,
          province: name,
          citys: newCitys,
        };
        if (pos < 0) {
          reginList.push(province);
        } else {
          reginList[pos] = province;
        }
      } else {
        // 取消选中
        if (pos >= 0) {
          reginList.splice(pos, 1);
        }
      }
    };

    /**
     *点击子节点
     *
     * @param {{checked: boolean, node:any}} e 点击事件
     */
    const handleChildNode = (e: { checked: boolean; node: any }) => {
      const { reginList } = state;
      const { checked, node } = e;
      const { name, key, parent } = node;
      const pos = reginList.findIndex(
        (item: any) => item.provinceCode === parent.key
      );
      if (checked) {
        // 选中
        if (pos < 0) {
          const province = {
            provinceCode: parent.key,
            province: parent.node.name,
            citys: [
              {
                city: name,
                cityCode: key,
              },
            ],
          };
          reginList.push(province);
        } else {
          const province = reginList[pos];
          province.citys.push({
            city: name,
            cityCode: key,
          });
          province.citys.sort((a:any,b:any)=>a.cityCode-b.cityCode);
        }
      } else {
        // 取消选中
        const province = reginList[pos];
        const { citys } = province;
        if (citys.length === 1) {
          reginList.splice(pos, 1);
        } else {
          const cityPos = province.citys.findIndex(
            (item: any) => item.cityCode === key
          );
          if (cityPos >= 0) {
            province.citys.splice(cityPos, 1);
          }
          reginList[pos] = province;
        }
      }
    };

    /**
     *初始化界面
     *
     */
    const init = () => {
      const { regionListStr } = state.formData;
      let checkedKeys = [] as any;
      let reginList = [] as any;
      regionListStr.forEach((item: any) => {
        // tree
        const { cityCode, city, provinceCode, province } = item;
        const cityCodes = cityCode.split(",");
        const cityNames = city.split(",");
        checkedKeys = checkedKeys.concat(cityCodes);

        // table
        let citys = [] as any;
        cityCodes.forEach((code: any, index: number) => {
          citys.push({
            cityCode: code,
            city: cityNames[index],
          });
        });
        reginList.push({
          province,
          provinceCode,
          citys,
        });
      });

      state.checkedKeys = checkedKeys;
      state.reginList = reginList;
    };

    /**
     *详情
     *
     */
    const detailRegion = () => {
      const params = { id: state.id };
      const { detailRegion } = service.securityAlarmReq;
      state.loading = true;
      detailRegion(params)
        .then((res: any) => {
          const { code, data } = res;
          if (code === 200) {
            state.formData = data;
            init();
          }
          state.loading = false;
        })
        .catch((e: any) => {
          console.error(e);
          state.loading = false;
        });
    };

    /**
     *格式化表格数据
     *
     * @return {*} 
     */
    const formatRegin = () => {
      const { reginList } = state;
      let tableData = [] as any;
      let cityName = "";
      let cityCode = "";
      reginList.forEach((item: any) => {
        const { citys, province, provinceCode } = item;
        if (citys && citys.length > 0) {
          cityName = citys.reduce(
            (accumulator: any, cur: any, index: number) => {
              let name = accumulator + cur.city;
              if (index < citys.length - 1) {
                name = `${name}` + ",";
              }
              return name;
            },
            ""
          );
          cityCode = citys.reduce(
            (accumulator: any, cur: any, index: number) => {
              let code = accumulator + cur.cityCode;
              if (index < citys.length - 1) {
                code = `${code}` + ",";
              }
              return code;
            },
            ""
          );
        }
        tableData.push({
          provinceCode,
          province,
          city: cityName,
          cityCode,
        });
      });

      console.log("-----computed----", tableData);
      return tableData;
    };

    /**
     *提交
     *
     */
    const submit = () => {
      formRef.value.validate().then((data: any) => {
        if (tableData.value.length <= 0) {
          message.error("区域不能为空！");
          return;
        }
        const { id } = state;
        const operate = id ? "editRegion" : "addRegion"; // 添加区域 | 修改区域
        const params = {
          ...data,
          regionList: tableData.value,
          id,
        };
        state.loading = true;
        const { securityAlarmReq } = service;
        console.log("-----submit---", params);
        securityAlarmReq[operate](params)
          .then((res: any) => {
            const { code } = res;
            if (code === 200) {
              message.success("操作成功！");
              back();
            }
            state.loading = false;
          })
          .catch((e: any) => {
            console.error(e);
            state.loading = false;
          });
      });
    };

    /**
     *分页
     *
     * @param {*} pagination 分页组件
     */
    const paginationChange = (pagination: any) => {      
      let { total, current, pageSize } = pagination;
      state.pagination = { total, current, pageSize };
    };

    /**
     *更新分页
     *
     */
    const updatePagination=()=>{
      let { current, pageSize } = state.pagination;
      const total=state.reginList.length;
      state.pagination = { total, current, pageSize };
    }

    /**
     *返回
     *
     */
    const back = () => {
      router.back();
    };
    return {
      ...toRefs(state),
      formRef,
      tableData,
      back,
      paginationChange,
      submit,
      handleCheck,
    };
  },
});
