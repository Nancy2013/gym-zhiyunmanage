<template>
    <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <a-form layout="inline" :model="searchData">
            <a-form-item label="">
                <a-input v-model:value="searchData.name" @pressEnter="handleSearch" placeholder="对象名称" />
            </a-form-item>
            <a-form-item label="">
                <!-- <a-select style="width: 194px;" v-model:value="searchData.categoryId" placeholder="对象分类名称" allowClear>
					<a-select-option v-for="(item, key) in objectClassOptions" :key="key" :value="item.value">{{ item.label }}</a-select-option>
				</a-select> -->
                <Cascader style="width: 194px;" :options="objectClassOptions" :load-data="loadData" v-model:value="searchData.categoryId" placeholder="对象分类名称" change-on-select allowClear></Cascader>
            </a-form-item>
            <a-form-item>
                <a-button type="primary" @click="handleSearch">查询</a-button>
            </a-form-item>
        </a-form>
    </div>
    <config-table :configColumns="{
      tableModules: {
        columns,
        dataSource,
        rowKey: 'id',
        bordered: true,
        loading: false,
        pagination,
        onChange: paginationChange
      },
      actionModules: {
        isAdd: false,
        isSearch: false,
        isAction: true,
        receive:handleFresh,
      },
    }">

        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
                <a-space>
                    <a-button type="link" size="small" @click="handleView(record)">查看</a-button>
                </a-space>
            </template>
            <template v-if="column.key === 'categoryName'">
                <div v-if="record.firstCategoryName">{{ record.firstCategoryName }} > </div>
                <div>{{ record.categoryName }}</div>
            </template>
        </template>
    </config-table>

    <a-modal width="640px" v-model:visible="visible" :title="`${objectInfo.name}的对象详情`">
        <Descriptions :column="2">
            <a-descriptions-item :label="item.attrNameCn" v-for="(item, key) in objectInfo.businessObjectAttrBOList" :key="key">
                {{ item.attrValue }}
            </a-descriptions-item>
            <!-- <Descriptions-item ></Descriptions-item> -->
        </Descriptions>
        <template #footer>
            <a-button type="primary" @click="visible = false">确定</a-button>
        </template>
    </a-modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Main from "./objectList";
import { Cascader, Descriptions } from "ant-design-vue";
export default defineComponent({
    components: {
        Cascader,
        Descriptions,
    },
    setup() {
        return {
            ...Main(),
        };
    },
});
</script>

<style lang="less" scoped>

</style>
