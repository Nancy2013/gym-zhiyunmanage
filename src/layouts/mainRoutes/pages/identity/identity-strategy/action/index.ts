import request from "@/utils/axios";
import { message } from "ant-design-vue";
import { useRouter, useRoute } from "vue-router";
import { multiNumber, uniqueArr } from "@/utils/function";
import { defineComponent, onMounted, reactive, ref, toRefs, watch } from "vue";
import { setBreamubTitle } from "@/utils/setBreamubTitle";
import service from "@/service/mainRoutes";
import { objectAndProductDataTypeDict } from "@/utils/dict";
import {getPopupContainer} from '@/hooks'
interface DataItem {
  sort: number;
  itemType: string | undefined;
  keyEn: string;
  keyCn: string;
  itemDigit: string;
  defaultValue: string;
  description: string;
}

const columns = [
  {
    key: "sort",
    dataIndex: "sort",
    align: "center",
    title: "序号",
    width: 80,
  },
  {
    key: "itemType",
    dataIndex: "itemType",
    align: "center",
    title: "分类",
  },
  {
    key: "keyEn",
    dataIndex: "keyEn",
    align: "center",
    title: "英文名称",
  },
  {
    key: "keyCn",
    dataIndex: "keyCn",
    align: "center",
    title: "中文名称",
  },
  {
    key: "itemDigit",
    dataIndex: "itemDigit",
    align: "center",
    title: "序号位位数",
  },
  {
    key: "defaultValue",
    dataIndex: "defaultValue",
    align: "center",
    title: "默认值",
  },
  {
    key: "description",
    dataIndex: "description",
    align: "center",
    title: "备注说明",
  },
  {
    key: "action",
    dataIndex: "action",
    align: "center",
    title: "操作",
  },
]; // 表格列

const typeOptions = [
  {
    value: 2,
    label: "自动生码",
  },
  {
    value: 1,
    label: "手动生码",
  },
]; // 生码类型数据

const dateOptions = [
  {
    value: "",
    label: "请选择默认格式",
  },
  {
    value: "yyyy",
    label: "yyyy",
  },
  {
    value: "yyMMdd",
    label: "yyMMdd",
  },
  {
    value: "yyyyMMdd",
    label: "yyyyMMdd",
  },
  {
    value: "yyyy-MM-dd",
    label: "yyyy-MM-dd",
  },
  {
    value: "MMdd",
    label: "MMdd",
  },
  {
    value: "MM-dd",
    label: "MM-dd",
  },
  {
    value: "ddMM",
    label: "ddMM",
  },
  {
    value: "yyMM",
    label: "yyMM",
  },
  {
    value: "yyyyMM",
    label: "yyyyMM",
  },
  {
    value: "yyyy-MM",
    label: "yyyy-MM",
  },
  {
    value: "yy-MM-dd",
    label: "yy-MM-dd",
  },
  {
    value: "ddMMyy",
    label: "ddMMyy",
  },
]; // 日期格式数据

const itemTypeOptions = [
  {
    value: 1,
    label: "固定标识",
  },
  {
    value: 2,
    label: "自定参数",
  },
  {
    value: 3,
    label: "日期格式",
  },
  {
    value: 4,
    label: "自增流水",
  },
]; // 标识分类数据
// 级联选择
const fieldCategoryNames = {
  label: "categoryName",
  value: "id",
  children: "children",
};
const fieldModuleNames = {
  label: "name",
  value: "code",
};
export default defineComponent({
  setup() {
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      judgeType: false,
      id: 0,
      titleType: "",
      columns,
      dataSource: ref<DataItem[]>([]),
      itemTypeOptions,
      dateOptions,
      typeOptions,
      formState: {
        ruleName: "",
        ruleType: undefined,
        generateNode: 0,
        categoryId: [] as any,
        generateTypeId: null,
      },
      rules: {
        ruleName: [
          { required: true, message: "必填项不能为空", trigger: "blur" },
        ],
        ruleType: [
          { required: true, message: "必填项不能为空", trigger: "change" },
        ],
        generateNode: [
          { required: true, message: "必填项不能为空", trigger: "change" },
        ],
        categoryId: [
          { required: true, message: "必填项不能为空", trigger: "change" },
        ],
        generateTypeId: [
          { required: true, message: "必填项不能为空", trigger: "change" },
        ],
      },
      categoryOptions: [],
      fieldCategoryNames,
      moduleOptions: [],
      categoryArr: [],
      fieldModuleNames,
      loading:false,
    });

    // 标题设置
    switch (route.query.type) {
      case "add":
        setBreamubTitle("添加标识策略");
        break;
      case "edit":
        setBreamubTitle("编辑标识策略");
        break;
      case "copy":
        setBreamubTitle("复制标识策略");
        break;
    }

    onMounted(() => {
      state.titleType = route.query.type as unknown as string;
      init();
    });

    const init = async () => {
      if (["edit", "copy"].includes(state.titleType)) {
        getRuleInfo(route.query.id, state.titleType);
      }
    };

    /**
     * 添加属性
     * @return
     */
    const handleAdd = () => {
      const newData = {
        sort: 0,
        itemType: undefined,
        keyEn: "",
        keyCn: "",
        itemDigit: "",
        defaultValue: "",
        description: "",
      };
      state.dataSource.push(newData);
      state.dataSource = state.dataSource.map((item, index) =>
        Object.assign({}, item, { sort: index + 1 })
      );
    };

    /**
     * 删除属性
     * @param { Number } key
     * @return
     */
    const handleDelete = (key: number) => {
      state.dataSource = state.dataSource.filter((item) => item.sort !== key);
    };

    /**
     * 生码类型回调
     * @param { String } value
     * @return
     */
    const typeChange = (value: string) => {
      state.judgeType = Object.is(value, 2) ? true : false;
      state.itemTypeOptions = Object.is(value, 2)
        ? itemTypeOptions.filter((item) => item.value != 2)
        : itemTypeOptions;
      if(state.judgeType){
        // 自动生码
        reset();
      }
    };

    /**
     * 重置下拉框
     */
    const reset=()=>{
      const {generateNode } = state.formState;
      state.formState={
        ...state.formState,
        generateNode:generateNode||1,
        categoryId:[],
        generateTypeId:null,
      }
    }

    /**
     * 标识分类回调
     * @param { Number } sort
     * @return
     */
    const formTypeChange = (sort: number) => {
      state.dataSource = uniqueArr(
        state.dataSource.map((item) => {
          if (item.sort == sort) {
            item.defaultValue = "";
          }
          return item;
        }),
        "itemType"
      );
    };

    /**
     * 中文名称回调
     * @param { Number } sort
     * @return
     */
    const keyCnChange = (sort: number) => {
      state.dataSource = state.dataSource.map((item) => {
        if (item.sort == sort) {
          let keyCn = item.keyCn as any;
          if (keyCn.length > 15) {
            message.error({
              content: "中文名称不能大于15个字符",
              key: "keyCn",
            });
          }
        }
        return item;
      });
    };

    /**
     * 序号位位数回调
     * @param { Number } sort
     * @return
     */
    const digitChange = (sort: number) => {
      state.dataSource = state.dataSource.map((item) => {
        let type = item.itemType as unknown as number;
        if (item.sort == sort) {
          let digitNum = item.itemDigit as any;
          if (digitNum <= 10) {
            type == 4 &&
              (item.defaultValue = digitNum ? multiNumber(digitNum) : "");
          } else {
            item.defaultValue = "";
            message.error({ content: "序号位数不能大于10位", key: "digitNum" });
          }
        }
        return item;
      });
    };

    /**
     * 日期格式回调
     * @param { Number } sort
     * @return
     */
    const formdateChange = (sort: number) => {
      state.dataSource = state.dataSource.map((item) => {
        if (item.sort == sort) {
          item.itemDigit = item.defaultValue.length as unknown as string;
        }
        return item;
      });
    };

    /**
     * 清空数据
     * @return
     */
    const removeInfo = () => {
      state.titleType = "";
      state.dataSource = [];
      state.formState = {
        generateNode: 0, 
        ruleName: "",
        ruleType: undefined,
        categoryId: [],
        generateTypeId: null,
      };
    };

    /**
     * 查询生码规则详情
     * @param { Number | undefined } id
     * @param { String | undefined } title
     * @return
     */
    const getRuleInfo = async (id: any, titleType: any) => {
      state.loading=true;
      let res: any = await request({
        url: import.meta.env.VITE_NODE_URL + `/rule/getRuleInfo/${id}`,
        type: "json",
        method: "get",
      });
      state.loading=false;
      const {code,data}=res;
      if (code == 200) {
        let {
          id,
          generateNode,
          ruleName,
          ruleType,
          ruleItemDTOS,
          generateTypeId,
          businessObjectCategoryId,
        } =data ;
        state.id = id;
        state.dataSource = state.dataSource.concat(ruleItemDTOS);
        if (Object.is(titleType, "edit")) {
          state.formState = {
            ruleName,
            ruleType,
            generateNode,
            categoryId:[],
            generateTypeId:null,
          };
          state.judgeType = Object.is(ruleType, 2) ? true : false;
          if(state.judgeType){
            // 自动生码
            if(generateNode===1){
              // 添加完成时
              state.formState.categoryId=[businessObjectCategoryId,generateTypeId].filter((item:any)=>item);
            }else{
              // 认证通过时
              state.formState.generateTypeId=generateTypeId;
            }
          }
        } else {
          // 复制
          state.formState = {
            ruleName: "",
            ruleType: undefined,
            generateNode: 0,
            categoryId: [],
            generateTypeId: null,
          };
          state.dataSource = state.dataSource.map((item) =>
            Object.assign({}, item, { id: "" })
          );
        }
      }
    };

    /**
     * 添加生码规则
     * @param { Object } data
     * @return
     */
    const addRule = async (data: any) => { 
      if (data.ruleItemDTOS.some((elem: any) => elem.itemType == 4)) {
        let res: any = await request({
          url: import.meta.env.VITE_NODE_URL + "/rule/addRule",
          type: "json",
          method: "post",
          data,
        });
        if (res.code == 200) {
          message.success(res.msg);
          router.go(-1);
          removeInfo();
        } else {
          message.error(res.msg);
        }
        console.log("添加生码规则", res);
      } else {
        message.error("标识规则需包含自增流水类型!");
      }
    };

    /**
     * 更新生码规则
     * @param { Object } data
     * @return
     */
    const updateRule = async (data: any) => {      
      if (data.ruleItemDTOS.some((elem: any) => elem.itemType == 4)) {
        let res: any = await request({
          url: import.meta.env.VITE_NODE_URL + "/rule/updateRule",
          type: "json",
          method: "post",
          data,
        });
        if (res.code == 200) {
          message.success(res.msg);
          router.go(-1);
          removeInfo();
        } else {
          message.error(res.msg);
        }
        console.log("更新生码规则", res);
      } else {
        message.error("标识规则需包含自增流水类型!");
      }
    };

    /**
     * 提交
     * @return
     */
    const submit = () => {
      let {
        formState: { ruleName, ruleType, generateNode, categoryId },
        dataSource,
        id,
      } = state;
      const { formState } = state;
      const generateTypeId =
        formState.generateNode === 1
          ? categoryId[categoryId.length - 1]
          : formState.generateTypeId;
      console.log('-----submit--categoryId-----',formState);
      const params ={
        ruleName,
        ruleType,
        generateNode: ruleType === 1 ? undefined : generateNode,
        ruleItemDTOS: dataSource,
        generateTypeId: ruleType === 1 ? undefined : generateTypeId,
      }
      
      switch (state.titleType) {
        case "add":
        case "copy":
          addRule(params);
          break;
        case "edit":
          updateRule({
           ...params,
            id,
          });
          break;
        default:
          break;
      }
    };

    /**
     * 取消
     * @return
     */
    const cancel = () => {
      router.go(-1);
      removeInfo();
    };

    /**
     * 初始化对象分类选择 TODO优化分类查询
     */
    const initCategory = async (ids?:any) => {
      const {code,data}=await queryCategory();
      let categoryOptions:any=[];
      if (code === 200) {
        // 一级分类
        categoryOptions = data.map((item: any) => ({
          ...item,
          isLeaf: false,
        }));
        
        const [firId,SecId]=ids;
        if(SecId){
          // 二级分类
          const {code,data}=await queryCategory(firId);
          if(code===200){
            const parent=categoryOptions.filter((item:any)=>item.id===firId)[0];
            if(parent){
              parent.children=data;
            }
          }
        }
      }
      state.categoryOptions=categoryOptions; 
    };

    /**
     * 查询对象分类
     * @param id 上级对象分类id
     */
    const queryCategory = (id?: number) => {
      const { queryCategoryByParentId } = service.identity;
      const params = {
        parentId:id || 0, // 0：查一级，非0：查二级子分类
        dataType:objectAndProductDataTypeDict.object,
      };
      return queryCategoryByParentId(params);
    };

    /**
     * 动态加载子对象分类
     * @param selectedOptions
     */
    const loadData = (selectedOptions: any) => {
      const targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true;
      console.log("-----loadData-----", selectedOptions);
      const len=selectedOptions.length;
      const {id}=selectedOptions[len-1];
      queryCategory(id)
        .then((res: any) => {
          const { code, data } = res;
          if (code === 200) {
            targetOption.children = data.map((item:any)=>({
              ...item,
            }));
          }
          targetOption.loading = false;
        })
        .catch((e: any) => {
          targetOption.loading = false;
          console.error(e);
        });

      state.categoryOptions = [...state.categoryOptions];
    };

    /** 
     * 选择对象分类
    */
    const handleCategoryChange = (value: any, selectedOptions: any) => {
      state.categoryArr =
        selectedOptions &&
        selectedOptions.map((item: any) => ({
          categoryId: item.id,
          categoryName: item.categoryName,
        }));
    };

    // 选择生码节点
    watch(()=>state.formState.generateNode,(newVal,oldVal)=>{
      const {categoryOptions,moduleOptions}=state;
      const {ruleType,categoryId}=state.formState;
      console.log('-----watch--ruleType---',newVal);
      if(ruleType===2){
        if(newVal===1){
          // 对象添加完成时
          if(categoryOptions.length<=0){
            console.log('------initCategory------',categoryId);
            initCategory(categoryId);
          }
        }

        if(newVal===2){
          // 对象认证通过时
          if(moduleOptions.length<=0){
            queryDicts();
          }
        }
      }
    },{ immediate: true });

    // 查询企业类型 获取某个字典类型下的所有字典
    const queryDicts = () => {
      const params = {
        dictTypeCode: "VERIFY_AUTO_GENERATE_CODE_MODULE",
      };
      const { queryDicts } = service.identity;
      queryDicts(params).then((res: any) => {
        const { code, data } = res;
        if (code == 200) {
          state.moduleOptions = data.map((item:any)=>({
            ...item,
            code:parseInt(item.code)
          }));
        }
      });
    };

    return {
      ...toRefs(state),
      handleAdd,
      handleDelete,
      typeChange,
      keyCnChange,
      digitChange,
      formTypeChange,
      formdateChange,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      submit,
      cancel,
      loadData,
      handleCategoryChange,
      getPopupContainer,
    };
  },
});
