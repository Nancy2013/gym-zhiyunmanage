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
        <!-- 条件区域111 -->
        <div :class="`table-search-area ${showMore ? 'table-search-area-showMore' : ''}`" :style="{ height: `${tableSearchAreaHeight}px` }">
            <div class="table-search-area-search">
                <div ref="searchAreaRef">
                    <slot name="searchArea">
                        <FcForm :renderList="searchRenderList" :formData="searchData" boxType="search" @unifyEvent="handleSearch"></FcForm>
                    </slot>
                </div>
            </div>

            <div class="table-search-area-btn">
                <slot name="headerBtnArea"></slot>
                <div v-if="showDropdown" class="table-search-area-btn-dropdown" @click="handleDropdown">
                    <a-button type="link">{{ showMore ? "收起" : "展开" }}</a-button>
                    <CaretDownOutlined />
                </div>
            </div>
        </div>
        <!-- 按钮区域 -->
        <div class="table-header">
            <div class="table-header-left">
				<slot name="headerLeft"></slot>
            </div>
            <!-- 便捷区域 -->
            <div class="table-header-tools" v-if="!hideTable">
                <a-tooltip>
                    <template #title>{{ fullScreen ? "退出全屏" : "全屏显示" }}</template>
                    <config-icon :name="fullScreen ? 'outScreen' : 'screen'" @click="switchScreenDisplay" />
                </a-tooltip>
                <a-popover placement="bottom" trigger="click">
                    <template #content>
                        <a-checkbox-group style="width: 100%" v-model:value="filterTableColumnKeys">
                            <p v-for="(item, index) in columns" :key="'row' + index">
                                <a-checkbox :value="item.dataIndex">{{item.title}}</a-checkbox>
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

        <div class="fcTable-content" ref="fcTableContent">
            <a-table v-if="!hideTable" :rowKey="rowKey" :loading="loading" class="tableViewer" :class="needStriped && 'ant-table-striped'" :row-class-name="needStriped ? (_record: any, index: number) => (index % 2 === 1 ? 'table-striped' : null) : null
      " size="middle" :scroll="{ x: 'max-content', y: `calc(100vh - ${tableSearchAreaHeight}px - 336px)` }" :pagination="false" :columns="columns" :data-source="dataSource" :row-selection="needRowSelection ? rowSelection : null" v-model:expandedRowKeys="innerExpandedRowKeys" @expand="handleExpand" @expandedRowsChange="handleExpandedRowsChange">
                <template #emptyText>
                    <!-- emptyIcon -->
                    <a-empty :image="emptyIcon" description="" />
                </template>
                <template #bodyCell="{ column, text, record, index }">
                    <slot :name="column.dataIndex" :record="record" :text="text" :index="index">
                        <div :style="{ maxWidth: `${column.width}px` }" class="fcTable-table-cell">
                            <a-tooltip placement="top">
                                <template #title>
                                    <span>{{ record[column.dataIndex] }}</span>
                                </template>
                                {{ record[column.dataIndex] }}
                            </a-tooltip>
                        </div>
                    </slot>
                </template>
            </a-table>
			<slot name="content"></slot>
        </div>

        <!-- 分页区域 -->
        <div class="pageArea" v-if="!hideTable">
            <span class="count">共 {{ paginationConfig.total }} 项数据</span>
            <div class="pageArea-content">
                <a-pagination :current="paginationConfig.current" :total="paginationConfig.total" :showSizeChanger="true" @change="handleChangePage" :responsive="true" />
                <div class="pageArea-quick-jumper">
                    <span>跳至</span>
                    <FcInput input-type="int" @blur="handlePaginationBlur" v-model:value="jumperNum"></FcInput>
                    <span>/{{totalPage}} 页</span>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import emptyIcon from "@/assets/image/emptyIcon.png";
import { ref, PropType, computed, onMounted, watch } from "vue";
import {
    ColumnItem,
    PageNationFace,
    rowSelectionType,
} from "@/types/mainInterface";
import { CaretDownOutlined } from "@ant-design/icons-vue";
import { RenderFormItem } from "../form/form";
import FcInput from "../input/input";
// 传入组件的props数据
const props = defineProps({
    columns: {
        // 列表需要的column同ant-design-vue table
        type: Array as PropType<ColumnItem[]>,
        default: () => [],
        required: true,
    },
    loading: {
        // 列表loading效果
        type: Boolean,
        default: false,
    },
    dataSource: {
        // 列表显示的数据
        type: Object as PropType<unknown>,
        required: true,
    },
    needStriped: {
        // 显示斑马纹
        type: Boolean,
        default: true,
    },
    paginationConfig: {
        // 分页配置
        type: Object as PropType<PageNationFace>,
        required: true,
    },
    moreSearch: {
        // 页面存在更多搜索
        type: Boolean,
        default: false,
    },
    needRowSelection: {
        // 列表是否可选择
        type: Boolean,
        default: false,
    },
    rowKey: {
        //表格行 keyKey 的取值 同 ant-design-vue table
        type: String,
        default: "id",
    },
    searchRenderList: {
        type: Array as PropType<RenderFormItem[]>,
        default: () => {
            return [];
        },
    },
    searchData: {
        type: Object,
        default: () => {
            return {};
        },
	},
	hideTable: {
		type: Boolean,
		default: false
	},
	expandedRowKeys: {
		type: Array
	}
});

const emits = defineEmits([
    "pageChange",
    "reloadData",
    "selectedRowChange",
	"search",
	"expand",
	"handleExpandedRowsChange"
]); // emit事件
//const { columns } = props;

const searchAreaRef = ref();
const showMore = ref<boolean>(false);
const tableSearchAreaHeight = ref<number>(56);
const jumperNum = ref<string>();
const showDropdown = ref<boolean>(false)
const innerExpandedRowKeys = ref<any>([])

onMounted(() => {
	const formHeight = searchAreaRef.value.clientHeight || 56;
	if (formHeight > 56) {
		showDropdown.value = true
	}
})

// 是否是全屏
const fullScreen = ref<boolean>(false);
// 表头过滤的keys
const filterTableColumnKeys = ref<Array<any>>([]);
// 动态显示用的表头
const tableColumns = ref<Array<any>>([]);

watch(() => props.expandedRowKeys, (value) => {
	innerExpandedRowKeys.value = value
}, {
	immediate: true,
})

const totalPage = computed(() => {
    if (props.paginationConfig.total && props.paginationConfig.pageSize) {
        return Math.ceil(
            props.paginationConfig.total / props.paginationConfig.pageSize
        );
    } else {
        return 1;
    }
});

// 需要rowSelection 时候的选项选择
const rowSelection = ref<rowSelectionType>({
    checkStrictly: false,
    selectedRowKeys: [],
    onChange: (selectedRowKeys: Array<string>, selectedRows: any) => {
        rowSelection.value.selectedRowKeys = selectedRowKeys;
        emits("selectedRowChange", selectedRowKeys);
    },
    fixed: true,
});


/**
 * 点击列表行展开图标时触发
 * @param { Object } expanded 事件参数
 * @param { Object } record 事件参数
 * @return
 */
const handleExpand = (expanded: any, record: any) => {
	emits("expand", expanded, record)
}

/**
 * 展开的行变化时触发
 * @param { Array } expandedRows 事件参数
 * @return
 */
const handleExpandedRowsChange = (expandedRows: any[]) => {
	emits("handleExpandedRowsChange", expandedRows)
}

/**
 * 处理点击搜索事件
 * @param { Object } event 事件参数
 * @return
 */
const handleSearch = (event: any) => {
    const { type } = event;
    if (type === "pressEnter") {
        emits("search");
    }
};

/**
 * 处理点击收起展开事件
 * @param
 * @return
 */
const handleDropdown = () => {
    if (!showMore.value) {
        const formHeight = searchAreaRef.value.clientHeight || 56;
        tableSearchAreaHeight.value = formHeight;
    } else {
        tableSearchAreaHeight.value = 56;
    }
    showMore.value = !showMore.value;
};

/**
 * 处理分页器输入框失焦事件
 * @param
 * @return
 */
const handlePaginationBlur = () => {
    if (!Number(jumperNum.value)) {
        jumperNum.value = "1";
    }
    if (Number(jumperNum.value) > totalPage.value) {
        jumperNum.value = totalPage.value.toString();
    }
    emits("pageChange", {
        current: Number(jumperNum.value),
		pageSize: props.paginationConfig.pageSize,
		total: props.paginationConfig.total
    });
};

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
    emits("pageChange", {
        current: page,
		pageSize,
		total: props.paginationConfig.total
    });
};

/**
 * @description: 快捷方式刷新数据
 * @return {*}
 */
const handleRoad = () => emits("reloadData");
</script>

<style lang="less" scoped>
.table-card {
    width: 100%;
    height: 100%;
    border-radius: 6px;
    background: #fff;
    padding: 8px 0px 0 8px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    .table-search-area {
        display: flex;
        flex-direction: row;
        overflow: hidden;
        //margin-bottom: -(@space-lg);
        transition: height 0.3s;
        .table-search-area-search {
            flex: 1;
            overflow: hidden;
        }

        .table-search-area-btn {
            //align-items: center;

            .table-search-area-btn-dropdown {
                display: inline;
                vertical-align: middle;
                margin-left: @space-md;
            }
            :deep(.ant-btn) {
                margin-left: @space-md;
            }
            :deep(.ant-btn-link) {
                padding-left: 0;
                padding-right: @space-sm;
                margin-left: 0;
            }
            :deep(.anticon) {
                transition: transform 0.15s;
            }
        }
    }

    .table-search-area-showMore {
        .table-search-area-btn {
            :deep(.anticon) {
                transform: rotate(180deg);
            }
        }
    }
    .table-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: @space-md;
        &-left {
            display: flex;
            align-items: center;
        }
    }

    .fcTable-content {
        flex: 1;
        overflow: hidden;
    }

    .fcTable-table-cell {
        overflow: hidden;
        white-space: nowrap;
        word-wrap: normal;
        text-overflow: ellipsis;
    }
}

:deep(.ant-table) {
    color: rgba(0, 0, 0, 0.9);
}
:deep(.ant-table-thead > tr > th) {
    background-color: #fff;
    color: rgba(0, 0, 0, 0.4);
    font-weight: 400;
    &::before {
        display: none;
    }
}
// 斑马纹列表样式
.ant-table-striped :deep(.table-striped) td {
    background-color: #f6fafb;
}

.pageArea {
    padding: @space-md 0 @space-sm;
    display: flex;
    align-items: center;
    justify-content: space-between;
    span.count {
        float: left;
        color: rgba(0, 0, 0, 0.6);
    }
    :deep(.ant-pagination-item-active) {
        background-color: @primary-color;
        a {
            color: #fff;
        }
    }
    .pageArea-content {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .pageArea-quick-jumper {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-left: @space-md;
        padding: 2px @space-sm;
        border-radius: @border-radius-base;
        background-color: @layout-body-background;
        :deep(.ant-input) {
            text-align: center;
        }
        :deep(.ant-input-affix-wrapper) {
            width: 57px;
            height: 28px;
            margin: 0 @space-sm;
        }
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
