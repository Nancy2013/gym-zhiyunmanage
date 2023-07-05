<template>
    <config-page title="返回" sub-title="返回对象列表页">
        <div>基础信息</div>
        <a-form ref="formRef" layout="horizontal" :model="formData" :rules="formRules" :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <a-form-item label="对象名称" name="name">
                <a-input v-model:value="formData.name" @change="filterInputName" placeholder="请输入对象名称" show-count
                    :maxlength="20" />
            </a-form-item>

            <a-form-item label="对象分类名称" name="categoryId">
                <a-select v-model:value="formData.categoryId" placeholder="请选择对象分类名称" allowClear>
                    <a-select-option v-for="(item, key) in objectClassOptions" :key="key" :value="item.value">{{ item.label
                    }}</a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item label="是否可溯源" name="sourceFlag">
                <a-switch v-model:checked="formData.sourceFlag" @change="handleChangeSourceFlag" :unCheckedValue="-1"
                    :checkedValue="0" />
            </a-form-item>
        </a-form>

        <div>规格/属性</div>
        <div><a-button type="primary" @click="handleAddAttribute">添加属性</a-button></div>
        <a-form class="attributeTableForm" ref="attributeTableFormRef" layout="horizontal" :model="attributeFormData">
            <a-table :columns="attributeColumns" :data-source="attributeTableList" size="middle" :pagination="false">
                <template #bodyCell="{ column, index, record }">
                    <template v-if="column.key === 'index'">
                        {{ index + 1 }}
                    </template>

                    <template v-if="column.key === 'attrNameCn'">
                        <a-form-item label="" :name="`${record.attributeTableKey}-attrNameCn`"
                            :rules="[{ required: true, message: '请输入属性名', trigger: 'blur' }]">
                            <a-input v-model:value="attributeFormData[`${record.attributeTableKey}-attrNameCn`]"
                                placeholder="请输入属性名" />
                        </a-form-item>
                    </template>

                    <template v-if="column.key === 'attrNameEn'">
                        <a-form-item label="" :name="`${record.attributeTableKey}-attrNameEn`"
                            :rules="[{ required: true, message: '请输入属性英文名', trigger: 'blur' }]">
                            <a-input v-model:value="attributeFormData[`${record.attributeTableKey}-attrNameEn`]"
                                placeholder="请输入属性英文名" />
                        </a-form-item>
                    </template>

                    <template v-if="column.key === 'attrIndex'">
                        <a-form-item label="" :name="`${record.attributeTableKey}-attrIndex`"
                            :rules="[{ required: true, message: '请输入属性排序', trigger: 'blur' }]">
                            <a-input v-model:value="attributeFormData[`${record.attributeTableKey}-attrIndex`]"
                                placeholder="请输入属性排序" />
                        </a-form-item>
                    </template>

                    <template v-if="column.key === 'attrValue'">
                        <a-form-item label="" :name="`${record.attributeTableKey}-attrValue`"
                            :rules="[{ required: false, message: '请输入属性值', trigger: 'blur' }]">
                            <a-input v-model:value="attributeFormData[`${record.attributeTableKey}-attrValue`]"
                                placeholder="请输入属性值" />
                        </a-form-item>
                    </template>

                    <template v-if="column.key === 'attrType'">
                        <a-form-item label="" :name="`${record.attributeTableKey}-attrType`"
                            :rules="[{ required: true, message: '请选择隐私类型', trigger: 'blur' }]">
                            <a-select v-model:value="attributeFormData[`${record.attributeTableKey}-attrType`]"
                                placeholder="请选择隐私类型" allowClear>
                                <a-select-option v-for="(item, key) in attrTypeOptions" :key="key" :value="item.value">{{
                                    item.label }}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </template>

                    <template v-if="column.key === 'action'">
                        <a-space>
                            <a-button type="link" danger size="small"
                                @click="deleteAttributeRow(index, record.attributeTableKey)">移除</a-button>
                        </a-space>
                    </template>
                </template>
            </a-table>
        </a-form>

        <div>图片信息</div>
        <div><a-button type="primary" @click="handleAddImage">添加图片</a-button></div>
        <a-table :columns="imageColumns" :data-source="imageTableList" size="middle" :pagination="false">
            <template #bodyCell="{ column, index, record }">
                <template v-if="column.key === 'index'">
                    {{ index + 1 }}
                </template>

                <template v-if="column.key === 'imgPath'">
                    <a-image width="60px" height="60px" :src="record.imgPath" alt="" />
                </template>

                <template v-if="column.key === 'fileSize'">
                    <span>{{ filterFileSize(record.fileSize) }}</span>
                </template>

                <template v-if="column.key === 'action'">
                    <a-space>
                        <a-button type="link" danger size="small" @click="deleteImageRow(index)">移除</a-button>
                    </a-space>
                </template>
            </template>
        </a-table>

        <div class="addObject-bottom" style="margin-top: 36px">
            <a-button @click="handleCancel">取消</a-button>
            <a-button type="primary" @click="handleSubmit">提交</a-button>
        </div>
    </config-page>
    
    <a-modal v-model:visible="visible" title="添加对象分类" @ok="submitAddImage()" @cancel="cancelAddImage">
        <a-form ref="addFormRef" layout="horizontal" :model="imageFormData" :rules="imageFormRules" :label-col="{ span: 6 }"
            :wrapper-col="{ span: 14 }">
            <a-form-item label="对象分类图片" name="imgPath">
                <!-- <a-input v-model:value="formData.fieldA" placeholder="请输入对象分类名称" /> -->
                <config-upload :uploadConfigs="{
                    maxCount: 1,
                    accept: 'image/*',
                    listType: 'picture'
                }" v-model:value="imageFormData.imgPath" />
            </a-form-item>

            <a-form-item label="说明" name="remark">
                <a-input v-model:value="imageFormData.remark" placeholder="请输入说明" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Main from "./addObject";
export default defineComponent({
    setup() {
        return {
            ...Main()
        };
    },
});
</script>

<style lang="less" scoped>@import url("./addObject.less");</style>