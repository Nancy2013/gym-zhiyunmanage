<template>
    <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <a-form layout="inline" :model="searchData">
            <a-form-item label="">
                <a-input v-model:value="searchData.name" @pressEnter="handleSearch" placeholder="对象分类名称" />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" @click="handleSearch">查询</a-button>
            </a-form-item>
        </a-form>
        <div>
            <a-button type="primary" @click="visible = true">添加</a-button>
        </div>
    </div>
    <config-table :configColumns="{
      tableModules: {
        columns,
        dataSource,
        rowKey: 'id',
        bordered: true,
        loading: false,
        pagination: {
            pageSize,
		    current: pageNum,
		    total
        },
        onChange: handlePageChange
      },
      actionModules: {
        isAdd: false,
        isSearch: false,
        isAction: true,
      }
    }">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
                <a-space>
                    <a-button type="link" size="small" @click="handleEdit(record)"> 编辑 </a-button>
                    <a-divider type="vertical" />
                    <a-button type="link" danger size="small" @click="handleDelete(record)"> 删除 </a-button>
                </a-space>
            </template>
        </template>
    </config-table>

    <a-modal v-model:visible="visible" :title="formData.id ? '编辑对象分类' : '添加对象分类' " @ok="handleSubmit()" @cancel="handleCancel">
        <a-form ref="formRef" layout="horizontal" :model="formData" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-item label="对象分类名称" name="categoryName">
                <a-input v-model:value="formData.categoryName" @change="filterInputCategoryName.filterInput" show-count :maxlength="20" placeholder="请输入对象分类名称" />
            </a-form-item>

            <a-form-item label="标识策略" name="idisPolicy">
                <a-select v-model:value="formData.idisPolicy" placeholder="请选择标识策略" allowClear>
                    <a-select-option v-for="(item, key) in ruleOptions" :key="key" :value="item.value">{{ item.label }}</a-select-option>
                </a-select>
            </a-form-item>
            <span class="objectClass-prompt">只可选择【标识策略】菜单中自动生码类型的标识策略</span>
        </a-form>
    </a-modal>

</template>

<script lang="ts">
import { defineComponent } from "vue";
import Main from "./objectClass";
export default defineComponent({
    setup() {
        return {
            ...Main(),
        };
    },
});
</script>

<style lang="less" scoped>
.objectClass-prompt {
    font-size: 12px;
    color: #666;
    margin-left: 120px;
}
</style>