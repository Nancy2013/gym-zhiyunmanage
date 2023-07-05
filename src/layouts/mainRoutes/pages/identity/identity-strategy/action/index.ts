import request from "@/utils/axios";
import { message } from "ant-design-vue";
import { useRouter, useRoute } from "vue-router";
import { multiNumber, uniqueArr } from "@/utils/function";
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import { setBreamubTitle } from '@/utils/setBreamubTitle'
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
  }
] // 生码类型数据

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
  }
] // 日期格式数据

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
  }
] // 标识分类数据

export default defineComponent({
  setup() {
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      judgeType: false,
      id: "",
      titleType: "",
      columns,
      dataSource: ref<DataItem[]>([]),
      itemTypeOptions,
      dateOptions,
      typeOptions,
      formState: {
        ruleName: "",
        ruleType: undefined,
        generateNode: 1,
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
      },
    });

    // 标题设置
    switch(route.query.type) {
       case 'add': setBreamubTitle("添加标识策略"); break;
       case 'edit': setBreamubTitle("编辑标识策略"); break;
       case 'copy': setBreamubTitle("复制标识策略"); break;
    }

    onMounted(() => {
      state.titleType = route.query.type as unknown as string;
      if (["edit", "copy"].includes(state.titleType))
        getRuleInfo(route.query.id, state.titleType);
    });

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
      state.itemTypeOptions = Object.is(value, 2) ? itemTypeOptions.filter(item => item.value != 2) : itemTypeOptions
    };


    /**
     * 标识分类回调
     * @param { Number } sort 
     * @return
     */
    const formTypeChange = (sort: number) => {
      state.dataSource = uniqueArr(state.dataSource.map((item) => {
        if (item.sort == sort) {
          item.defaultValue = '';
        }
        return item;
      }), 'itemType');
    }


    /**
     * 中文名称回调
     * @param { Number } sort
     * @return 
     */
    const keyCnChange = (sort: number) => {
      state.dataSource = state.dataSource.map((item) => {
        if (item.sort == sort) {
          let keyCn = item.keyCn as any
          if(keyCn.length > 15) {
            message.error({content: '中文名称不能大于15个字符', key: 'keyCn'})
          }
        }
        return item;
      });
    }


    /**
     * 序号位位数回调
     * @param { Number } sort 
     * @return
     */
    const digitChange = (sort: number) => {
      state.dataSource = state.dataSource.map((item) => {
        let type = item.itemType as unknown as number;
        if (item.sort == sort) {
          let digitNum = item.itemDigit as any
          if(digitNum <= 10) {
            type == 4 && (item.defaultValue = digitNum ? multiNumber(digitNum) : '');
          } else {
            item.defaultValue = '';
            message.error({content: '序号位数不能大于10位', key: 'digitNum'})
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
    }


    /**
     * 清空数据
     * @return
     */
    const removeInfo = () => {
      state.titleType = "";
      state.dataSource = [];
      state.formState = { generateNode: 1, ruleName: "", ruleType: undefined };
    };


    /**
     * 查询生码规则详情
     * @param { Number | undefined } id 
     * @param { String | undefined } title
     * @return 
     */
    const getRuleInfo = async (id: any, titleType: any) => {
      let res: any = await request({
        url: import.meta.env.VITE_NODE_URL + `/rule/getRuleInfo/${id}`,
        type: "json",
        method: "get",
      });
      if (res.code == 200) {
        let { id, generateNode, ruleName, ruleType, ruleItemDTOS } = res.data;
        state.id = id;
        state.dataSource = state.dataSource.concat(ruleItemDTOS);
        if (Object.is(titleType, "edit")) {
          state.formState = {
            ruleName,
            ruleType,
            generateNode,
          };
          state.judgeType = Object.is(ruleType, 2) ? true : false;
        } else {
          state.formState = {
            ruleName: "",
            ruleType: undefined,
            generateNode: 1,
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
        formState: { ruleName, ruleType, generateNode },
        dataSource,
        id,
      } = state;
      switch (state.titleType) {
        case "add":
          addRule({
            ruleName,
            ruleType,
            generateNode: ruleType == 1 ? undefined : generateNode,
            ruleItemDTOS: dataSource,
          });
          break;
        case "copy":
          addRule({
            ruleName,
            ruleType,
            generateNode,
            ruleItemDTOS: dataSource,
          });
          break;
        case "edit":
          updateRule({
            ruleName,
            ruleType,
            generateNode,
            ruleItemDTOS: dataSource,
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
    };


  },
});
