<template>
    <div class="type" style="height: 100%">
        <FcTable :columns="columns" :dataSource="dataSource" :paginationConfig="pagination" @pageChange="paginationChange" :loading="loading" :searchRenderList="searchRenderList" :searchData="query" @search="queryList">

            <template #headerBtnArea>
                <a-button type="primary" @click="queryList">查询</a-button>
                <a-button type="default" @click="reset">重置</a-button>
                <a-button type="primary" @click="add">添加</a-button>
            </template>

            <template #action="{ record }">
                <a-space>
                    <a-button v-if="record.status == 'ENABLE'" type="link" size="small" @click="statusTenantMealModify(record.id, 'DISABLE')">停用</a-button>
                    <a-button v-if="record.status == 'DISABLE'" type="text" size="small" @click="statusTenantMealModify(record.id, 'ENABLE')">启用</a-button>
                    <a-button type="link" size="small" @click="edit(record)">权限编辑</a-button>
                    <a-button type="link" danger size="small" @click="deleteConfirm(record.id)">删除</a-button>
                    <a-button type="link" size="small" @click="see(record)">查看</a-button>
                </a-space>
            </template>
        </FcTable>

        <!-- 弹框 -->
        <a-modal v-model:visible="visible" :title="title" :afterClose="destroyInfo">
            <template #footer>
                <a-space v-if="isSubmit">
                    <a-button type="default" @click="() => { visible = false }">关闭</a-button>
                    <a-button type="primary" @click="submit">提交</a-button>
                </a-space>
                <a-space v-else>
                    <a-button type="default" @click="() => { visible = false }">关闭</a-button>
                </a-space>
            </template>
            <div class="modal-content">
                <a-form ref="formRef" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules">
                    <a-form-item ref="name" name="name" label="类型名称">
                        <a-input v-model:value="formState.name" placeholder="请输入类型名称" :disabled="Object.is(title, '查看') ? true : false" />
                    </a-form-item>
                    <a-form-item class="form-tree" ref="selectMenulist" name="selectMenulist" label="功能权限">
                        <a-tree :disabled="Object.is(title, '查看') ? true : false" checkable v-model:checkedKeys="formState.selectMenulist" :tree-data="menuTree" :fieldNames="{ title: 'name', key: 'id' }" />
                    </a-form-item>
                </a-form>
            </div>
        </a-modal>
    </div>
</template>
<script lang="ts">
import Index from "./index";
export default Index;
</script>
<style lang="less" scoped>
@import url("./index.less");
</style>