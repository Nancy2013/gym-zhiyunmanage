<template>
    <div class="enterprise" style="height: 100%">
        <vue-table :columns="columns" :dataSource="dataSource" :paginationConfig="pagination" @pageChange="paginationChange" :loading="loading" :searchRenderList="searchRenderList" :searchData="query" @search="queryList">

            <template #headerBtnArea>
                <a-button type="primary" @click="queryList">查询</a-button>
                <a-button type="default" @click="reset">重置</a-button>
                <a-button type="primary" @click="add">添加</a-button>
            </template>

            <template #status="{ record }">
                <template v-if="record.status == 'ENABLE'"><a-tag color="green">启用</a-tag></template>
                <template v-if="record.status == 'DISABLE'"><a-tag color="red">停用</a-tag></template>
            </template>

            <template #action="{ record }">
                <a-space>
                    <a-button v-if="record.status == 'ENABLE'" type="link" size="small" @click="modifyEnterpriseStatus(record.id, 'DISABLE')">停用</a-button>
                    <a-button v-if="record.status == 'DISABLE'" type="text" size="small" @click="modifyEnterpriseStatus(record.id, 'ENABLE')">启用</a-button>
                    <a-button type="link" size="small" @click="edit(record)">编辑</a-button>
                    <a-button type="link" size="small" @click="see(record)">查看</a-button>
                </a-space>
            </template>
        </vue-table>

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
                    <a-form-item ref="tenantName" name="tenantName" label="企业名称">
                        <a-input v-model:value="formState.tenantName" placeholder="请输入" :disabled="Object.is(title, '查看') ? true : false" />
                    </a-form-item>
                    <a-form-item ref="contact" name="contact" label="企业联系人">
                        <a-input v-model:value="formState.contact" placeholder="请输入" :disabled="Object.is(title, '查看') ? true : false" />
                    </a-form-item>
                    <a-form-item ref="contactPhone" name="contactPhone" label="联系电话">
                        <a-input maxlength="11"  v-model:value="formState.contactPhone" placeholder="请输入" :disabled="Object.is(title, '查看') ? true : false" />
                    </a-form-item>
                    <a-form-item ref="enterpriseType" name="enterpriseType" label="企业类型">
                        <a-select v-model:value="formState.enterpriseType" placeholder="请选择" :options="options" :disabled="Object.is(title, '查看') ? true : false" />
                    </a-form-item>
                    <a-form-item class="form-tree" ref="selectMenuList" name="selectMenuList" label="功能权限">
                        <a-tree :disabled="Object.is(title, '查看') ? true : false" checkable v-model:checkedKeys="formState.selectMenuList" :tree-data="menuTree" :fieldNames="{ title: 'name', key: 'id' }" />
                    </a-form-item>
                    <!-- <a-form-item ref="status" name="status" label="状态">
                        <a-radio-group v-model:value="formState.status">
                            <a-radio value="ENABLE">
                                <span>启用</span>
                            </a-radio>
                            <a-radio value="DISABLE">
                                <span>停用</span>
                            </a-radio>
                        </a-radio-group>
                    </a-form-item> -->
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