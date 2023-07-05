<template>
    <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <a-form layout="inline" :model="searchData">
            <a-form-item label="">
                <a-input v-model:value="searchData.name" @pressEnter="handleSearch" placeholder="对象名称" />
            </a-form-item>
			<a-form-item label="">
				<a-select style="width: 194px;" v-model:value="searchData.categoryId" placeholder="对象分类名称" allowClear>
					<a-select-option v-for="(item, key) in objectClassOptions" :key="key" :value="item.value">{{ item.label }}</a-select-option>
				</a-select>
            </a-form-item>
            <a-form-item>
                <a-button type="primary" @click="handleSearch">查询</a-button>
            </a-form-item>
        </a-form>
        <div>
            <a-button type="primary" @click="handleAdd">添加</a-button>
        </div>
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
                    <a-button type="link" size="small" @click="handleEdit(record)"> 编辑 </a-button>
                    <a-divider type="vertical" />
                    <a-button type="link" danger size="small" @click="handleDelete(record)"> 删除 </a-button>
                </a-space>
            </template>

			<template v-if="column.key === 'sourceFlag'">
                <a-space>
                    {{ sourceFlagDict[record.sourceFlag] }}
                </a-space>
            </template>

			<template v-if="column.key === 'syncStatus'">
                <a-tag :color="syncStatusColor[record.syncStatus]">{{ syncStatusDict[record.syncStatus] }}</a-tag>
            </template>
        </template>
    </config-table>

</template>

<script lang="ts">
import { defineComponent } from "vue";
import Main from './objectList'
export default defineComponent({
	setup() {
		return {
			...Main()
        };
    },
});
</script>