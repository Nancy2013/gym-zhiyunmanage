<template>
    <div class="message">
        <div class="message-top">
            <div class="message-top-left">
               <p><label>全部消息</label><span>（13）</span></p>
               <p><label>我的通知</label><span>（5）</span></p>
               <p><label>系统消息</label><span>（8）</span></p>
            </div>
            <div class="message-top-right">
                <a-button type="default">标记为已读</a-button>
                <a-button type="primary">删除</a-button>
            </div>
        </div>
        <div class="message-list">
            <a-list item-layout="horizontal" :data-source="data">
                <template #renderItem="{ item }">
                    <a-list-item>
                        <a-list-item-meta
                            :description="item.description">
                            <template #title>
                                <img class="messageIcon" :src="item.icon" /> 
                                <span>{{ item.title }}</span>
                                <span v-if="item.type == 1" :class="`messageColor-${item.type}`">【认证审核】</span>
                                <span v-if="item.type == 2" :class="`messageColor-${item.type}`">【茶园确权】</span>
                                <span v-if="item.type == 3" :class="`messageColor-${item.type}`">【授权审核】</span>
                            </template>
                            <template #avatar>
                                <a-checkbox  />
                            </template>
                        </a-list-item-meta>
                        <div>{{ item.time }}</div>
                    </a-list-item>
                </template>
            </a-list>
        </div>
        <div class="message-pagination">
            <Pagination show-quick-jumper :total="500" />
        </div>
    </div>
</template>
<script lang="ts">
import Index from './index'
export default Index
</script>
<style lang="less" scoped>
@import url('./index.less');
</style>