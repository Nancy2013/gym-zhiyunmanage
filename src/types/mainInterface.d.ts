/*
 * @Description: 通用的interface定义
 * @FilePath: /zhiyun-outsource-web/src/types/mainInterface.d.ts
 */

// 列表接口返回的result数据结构
export type Result = {
  rows: Array<any>;
  total: number;
  pageSize?: number;
  pageNum: number;
}

// 接口返回的结构
export interface Response <T = Result> {
  code?: number;
  msg: string;
  data?: Array<any>;
  rows: any[]; 
  total: number
}

// 表头对象声明
export interface ColumnItem {
  title: string;
  dataIndex: string;
  width?: number;
  align?: string;
  ellipsis?: Boolean;
  key?: string;
  customRender?: Function;
  fixed?: string,
  needCustomRender?: boolean;
}

// 分页对象的声明
export interface PageNationFace {
    current: number,
    pageSize: number,
    total: number
}

// 返回数据任意类型
export interface DataRowItem {
  [key: string]: string | number | boolean | Date | null;
}

// 表单布局
export interface FormCol {
  labelCol: object;
  wrapperCol: object;
  longLabelCol?: object;
  longWrapperCol?: object;
}

// 选中的rowSelection 的type
export interface rowSelectionType {
  checkStrictly: Boolean;
  selectedRowKeys: Array<String>;
  onChange: Function;
  onSelect?: Function;
  fixed?: Boolean
}