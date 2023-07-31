<template>
    <div class="menu">
        <vue-table :columns="columns" :dataSource="dataSource" :paginationConfig="pagination" @pageChange="paginationChange" :loading="loading" :expandedRowKeys="expandedRowKeys" @expand="expandChange" :searchRenderList="searchRenderList" :searchData="query" @search="queryList">

            <template #headerBtnArea>
                <a-button type="primary" @click="queryList">搜索</a-button>
                <a-button type="primary" @click="expandAll">展开所有</a-button>
                <a-button type="primary" @click="closeAll">折叠所有</a-button>
                <a-button type="primary" @click="add">添加</a-button>
            </template>

            <template #status="{ record }">
                <template v-if="record.status == 'ENABLE'"><a-tag color="green">启用</a-tag></template>
                <template v-if="record.status == 'DISABLE'"><a-tag color="red">停用</a-tag></template>
            </template>

            <template #menuFlag="{ record }">
                <a-switch checked-children="是" un-checked-children="否" :checked="record.menuFlag == 'Y' ? true : false" disabled />
            </template>

            <template #action="{ record }">
                <a-space>
                    <a-button type="link" size="small" @click="() => edit(record)">修改</a-button>
                    <a-button type="link" danger size="small" @click="deleteConfirm(record.id)">删除</a-button>
                </a-space>
            </template>
        </vue-table>

        <!-- 弹框 -->
        <a-modal width="660px" v-model:visible="visible" :title="title" :afterClose="destroyInfo" @ok="submit">
            <div class="modal-content">
                <tsx-form ref="formRef" :rules="rules" :renderList="renderFormList" v-model:formData="formState" labelAlign="right" :labelCol="{ style: {width: '88px'} }" @unifyEvent="haddleUnifyEvent">
                    <tsx-formItem style="display: flex; flex-direction: row;" v-model:value="formState.icon" :renderItem="{ label: '选择图标', key: 'icon', type: 'radio', width: '100%', labelCol: {style: {width: '88px'}} }">
                        <a-radio-group v-model:value="formState.icon">
                            <div class="select-icons">
                                <p class="select-icon" v-for="(item, index) in icons" :key="index">
                                    <a-radio :value="item">
                                        <tsx-icon width="24px" height="24px" :name="item" class="svgClass" style="margin: 0;" />
                                    </a-radio>
                                </p>
                            </div>
                        </a-radio-group>
                    </tsx-formItem>
                </tsx-form>
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