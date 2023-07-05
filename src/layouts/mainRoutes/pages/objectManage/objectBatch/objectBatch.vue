<template>
    <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <a-form layout="inline" :model="searchData">
            <a-form-item label="">
                <a-input v-model:value="searchData.name" placeholder="批次标题/对象名称" />
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
        </template>
    </config-table>

    <a-modal v-model:visible="visible" title="添加对象分类" @ok="handleSubmit()" @cancel="handleCancel">
        <a-form ref="formRef" layout="horizontal" :model="formData" :rules="formRules" :label-col="labelCol" :wrapper-col="wrapperCol">
			<a-form-item label="对象名称" name="boId">
				<a-select v-model:value="formData.boId" placeholder="请输入对象名称" allowClear>
					<a-select-option v-for="(item, key) in objectOptions" :key="key" :value="item.value">{{ item.label }}</a-select-option>
				</a-select>
            </a-form-item>

			<a-form-item label="批次编号" name="batchNo">
                <a-input v-model:value="formData.batchNo" placeholder="请输入批次编号" />
            </a-form-item>

			<a-form-item label="批次标题" name="batchTitle">
                <a-input v-model:value="formData.batchTitle" placeholder="请输入批次标题" />
            </a-form-item>

			<a-form-item label="负责人" name="batchResponorUser">
                <a-input v-model:value="formData.batchResponorUser" placeholder="请输入负责人" />
            </a-form-item>

			<a-form-item label="批次日期" name="batchDate">
                <a-date-picker style="width: 100%;" v-model:value="formData.batchDate" placeholder="请选择批次日期" />
            </a-form-item>

			<a-form-item label="质保期" name="dates">
                <a-range-picker v-model:value="formData.dates" />
            </a-form-item>


			<a-form-item label="说明" name="remark">
				<a-textarea  v-model:value="formData.remark" placeholder="请输入说明" />
            </a-form-item>
		</a-form>
    </a-modal>

</template>

<script lang="ts">
import { defineComponent } from "vue";
import objectBatch from './objectBatch'
export default defineComponent({
	setup() {
		return {
			...objectBatch()
        };
    },
});
</script>