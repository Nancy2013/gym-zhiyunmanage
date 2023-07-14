<template>
    <a-spin :spinning="loading">
        <div class="detail">

            <!-- 企业基本信息 -->
            <Panel v-if="dataSource.baseInfo" class="panel" :title="dataSource.baseInfo.title"
                :img="dataSource.baseInfo.img" :data="dataSource.baseInfo.data" />
            <!-- 核心信息 -->
            <Panel v-if="dataSource.coreInfo" class="panel" :title="dataSource.coreInfo.title"
                :img="dataSource.coreInfo.img" :data="dataSource.coreInfo.data" />
            <!-- 联系信息 -->
            <Panel v-if="dataSource.contactInfo" class="panel" :title="dataSource.contactInfo.title"
                :img="dataSource.contactInfo.img" :data="dataSource.contactInfo.data" />
            <div class="footer" @click="back">
                <div class="btn-bottom"> 返回</div>
            </div>

            <div class="status">
                <div class="status-reason" v-if="info.approvalStatus == 3">
                    <span class="dot"></span>
                    <label>驳回原因: </label>
                    <span>{{ info.reason }}</span>
                </div>
                <span v-if="info.approvalStatus == 1" :class="`status-text status-${info.approvalStatus}`">待审核</span>
                <span v-if="info.approvalStatus == 2" :class="`status-text status-${info.approvalStatus}`">已认证</span>
                <span v-if="info.approvalStatus == 3" :class="`status-text status-${info.approvalStatus}`">已驳回</span>
            </div>
        </div>
    </a-spin>
</template>
<script lang="ts">
import Index from './index'
export default Index
</script>
<style lang="less" scoped>
@import url('./index.less');
</style>