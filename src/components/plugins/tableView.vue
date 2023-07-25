<!--
 * @Description: 列表页面组件
 * @Author: zhang zhen
 * @Date: 2023-07-10 11:32:48
 * @LastEditors: zhang zhen
 * @LastEditTime: 2023-07-17 11:38:57
 * @FilePath: /zhiyun-outsource-web/src/components/plugins/tableView.vue
-->
<template>
  <div class="table-card">
    <!-- 条件区域 -->
    <div class="table-search-area">
      <slot name="searchArea"></slot>
    </div>
    <!-- 按钮区域 -->
    <div class="table-header">
      <div class="table-header-left">
        <slot name="headerBtnArea"></slot>
      </div>
      <!-- 便捷区域 -->
      <div class="table-header-tools">
        <a-tooltip>
          <template #title>{{ fullScreen ? "退出全屏" : "全屏显示" }}</template>
          <config-icon
            :name="fullScreen ? 'outScreen' : 'screen'"
            @click="switchScreenDisplay"
          />
        </a-tooltip>
        <a-popover placement="bottom" trigger="click">
          <template #content>
            <a-checkbox-group
              style="width: 100%"
              v-model:value="filterTableColumnKeys"
            >
              <p v-for="(item, index) in columns" :key="'row' + index">
                <a-checkbox :value="item.dataIndex">{{
                  item.title
                }}</a-checkbox>
              </p>
            </a-checkbox-group>
          </template>
          <config-icon name="filter" />
        </a-popover>
        <a-tooltip>
          <template #title>刷新</template>
          <config-icon name="reset" style="margin-right: 0" @click="handleRoad" />
        </a-tooltip>
      </div>
    </div>
    <a-table
      :rowKey="rowKey"
      :loading="loading"
      class="tableViewer"
      :class="needStriped && 'ant-table-striped'"
      :row-class-name="
        needStriped ? (_record: any, index: number) => (index % 2 === 1 ? 'table-striped' : null) : null
      "
      size="middle"
      :scroll="{ x: 'max-content', y: !moreSearch ? 'calc(100vh - 438px)' : 'calc(100vh - 498px)' }"
      :pagination="false"
      :columns="tableColumns"
      :data-source="dataSource"
      :row-selection="needRowSelection ? rowSelection : null"
    >
        <template #emptyText>
          <!-- emptyIcon -->
          <a-empty :image="emptyIcon" description="" />
        </template>
        <template #bodyCell="{ column, text, record, index }">
            <!-- 单元格显示自定义 -->
            <!-- needCustomRender: true 时候可以自定义渲染 -->
            <template v-if="column.needCustomRender">
                <slot :name="column.dataIndex" :record="record" :text="text" :index="index"></slot>
            </template>
            <!-- 操作按钮区域 -->
            <template v-if="column.dataIndex === 'operation'">
                <slot name="operation" :record="record" :text="text"></slot>
            </template>
        </template>
    </a-table>
    <!-- 分页区域 -->
    <div class="pageArea">
        <span class="count">共 {{ paginationConfig.total }} 项数据</span>
        <a-pagination :current="paginationConfig.current" show-quick-jumper :total="paginationConfig.total" :showSizeChanger="true" @change="handleChangePage" :responsive="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import emptyIcon from '@/assets/image/emptyIcon.png'
import { ref, PropType, computed } from "vue";
import { ColumnItem, PageNationFace, rowSelectionType } from "@/types/mainInterface";
// 传入组件的props数据
const props = defineProps({
  columns: { // 列表需要的column同ant-design-vue table
    type: Array as PropType<ColumnItem[]>,
    default: () => [],
    required: true,
  },
  loading: { // 列表loading效果
    type: Boolean,
    default: false
  },
  dataSource: { // 列表显示的数据
    type: Object as PropType<unknown>,
    required: true,
  },
  needStriped: { // 显示斑马纹
    type: Boolean,
    default: false,
  },
  paginationConfig: { // 分页配置
    type: Object as PropType<PageNationFace>,
    required: true,
  },
  moreSearch: { // 页面存在更多搜索
    type: Boolean,
    default: false
  },
  needRowSelection: { // 列表是否可选择
    type: Boolean,
    default: false
  },
  rowKey: { //表格行 keyKey 的取值 同 ant-design-vue table
    type: String,
    default: 'id'
  },
});
const emits = defineEmits(['pageChange', 'reloadData', 'selectedRowChange']) // emit事件
const { columns } = props;

// 是否是全屏
const fullScreen = ref<boolean>(false);
// 表头过滤的keys
const filterTableColumnKeys = ref<Array<any>>(
  [...columns].map((i: ColumnItem) => i.dataIndex)
);
// 动态显示用的表头
const tableColumns = computed(() => {
  return [...columns].filter((ele: ColumnItem) =>
    filterTableColumnKeys.value.includes(ele.dataIndex)
  );
});

// 需要rowSelection 时候的选项选择
const rowSelection = ref<rowSelectionType>({
  checkStrictly: false,
  selectedRowKeys: [],
  onChange: (selectedRowKeys: Array<string>, selectedRows: any) => {
    rowSelection.value.selectedRowKeys = selectedRowKeys
    emits('selectedRowChange', selectedRowKeys)
  },
  fixed: true
});

/**
 * @description: 全屏幕显示切换
 * @return {*}
 */
const switchScreenDisplay = () => {
  if (fullScreen.value) {
    // 退出全屏
    document.exitFullscreen();
    fullScreen.value = false;
  } else {
    // 全屏显示
    let element = document.getElementById("app");
    element?.requestFullscreen();
    fullScreen.value = true;
  }
};

/**
 * @description: 分页数据切换区域
 * @param {Number} page - 当前页数
 * @param {Number} pageSize - 分页的页码
 * @return {*}
 */
const handleChangePage = (page: number, pageSize: number) => {
    emits('pageChange', {
        current: page,
        pageSize
    })
}

/**
 * @description: 快捷方式刷新数据
 * @return {*}
 */
const handleRoad = () => emits('reloadData')
</script>

<style lang="less" scoped>
.table-card {
  width: 100%;
  height: 100%;
  border-radius: 6px;
  background: #fff;
  padding: 8px 40px 0 8px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .table-search-area {
    margin-bottom: 11px;
  }
  .table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    &-left {
      display: flex;
      align-items: center;
    }
  }
}

:deep(.ant-table) {
    color: rgba(0,0,0,0.9);
}
:deep(.ant-table-thead > tr > th) {
    background-color: #fff;
    color: rgba(0,0,0,0.4);
    font-weight: 400;
    &::before {
        display: none;
    }
}
// 斑马纹列表样式
.ant-table-striped :deep(.table-striped) td {
  background-color: #F0F5F8;
}

.pageArea {
    padding: 16px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    span.count {
        color: rgba(0,0,0,0.6);
    }
}
.tableViewer {
    flex: 1 0 0;
    min-height: 0;
}
:deep(.ant-empty-image) {
  height: 250px;
}
</style>
