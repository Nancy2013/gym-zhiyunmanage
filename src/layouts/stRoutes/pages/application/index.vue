<template>
    <div class="application">
        <!-- 面板 -->
        <div class="application-panels">
            <a-row :gutter="16">
              <a-col :span="24">
                <div class="panel-item panel-item-flex">
                    <div class="panel-item-logo">
                        <span>{{ userInfo.name.substr(-1) }}</span>
                    </div>
                    <div class="panel-item-description">
                        <p class="description-name">
                            <span>{{ userInfo.name }}，下午好</span>
                        </p>
                        <p class="description-tags">
                            <span>政府</span>
                            <a-divider type="vertical" />
                            <span>管理员</span>
                        </p>
                    </div>
                    <div class="panel-item-absoulute">
                         <label>上次登录</label>
                         <span>2023/03/10</span>
                         <span>10:03:28</span>
                    </div>
                </div>
              </a-col>
            </a-row>
        </div>
        <!-- 主内容 -->
        <div class="application-content">
            <a-row :gutter="16">
              <a-col :span="24">
                <!-- 认证服务 -->
                <div class="content-item">
                    <div class="content-item-title"><img class="dzIcon" :src="dzIcon" />认证服务</div>
                    <div class="content-item-cards">
                        <div class="cards-item" v-for="(item, index) in services.rzfw" :key="index">
                            <div class="cards-item-icon" :style="`background:${item.color}`">
                              <img :src="item.icon" />
                            </div>
                            <div class="cards-item-label">
                                <p>{{ item.title }}</p>
                                <p>{{ item.label }}</p>
                            </div>
                            <div class="cards-item-absoulte">
                                <router-link :to="item.path">
                                    <span>前往>></span>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 品牌服务 -->
                <div class="content-item">
                    <div class="content-item-title"><img class="dzIcon" :src="dzIcon" />品牌服务</div>
                    <div class="content-item-cards">
                        <div class="cards-item cards-item-gray" v-for="(item, index) in services.ppfw" :key="index">
                            <div class="cards-item-icon" :style="`background:${item.color}`">
                                <img :src="item.icon" />
                            </div>
                            <div class="cards-item-label">
                                <p>{{ item.title }}</p>
                                <p>{{ item.label }}</p>
                            </div>
                            <div class="cards-item-absoulte">
                                <span>前往>></span>
                                <!-- <router-link :to="item.path">
                                    <span>前往</span>
                                </router-link> -->
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 产品溯源 -->
                <div class="content-item">
                    <div class="content-item-title"><img class="dzIcon" :src="dzIcon" />产品溯源</div>
                    <div class="content-item-cards">
                        <div class="cards-item cards-item-gray" v-for="(item, index) in services.cpsy" :key="index">
                            <div class="cards-item-icon" :style="`background:${item.color}`">
                                <img :src="item.icon" />
                            </div>
                            <div class="cards-item-label">
                                <p>{{ item.title }}</p>
                                <p>{{ item.label }}</p>
                            </div>
                            <div class="cards-item-absoulte">
                                <span>前往>></span>
                                <!-- <router-link :to="item.path">
                                    <span>前往</span>
                                </router-link> -->
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 其他服务 -->
                <div class="content-item">
                    <div class="content-item-title"><img class="dzIcon" :src="dzIcon" />其他服务</div>
                    <div class="content-item-cards">
                        <div class="cards-item" v-for="(item, index) in services.qtfw" :key="index">
                            <div class="cards-item-icon" :style="`background:${item.color}`">
                                <img :src="item.icon" />
                            </div>
                            <div class="cards-item-label">
                                <p>{{ item.title }}</p>
                                <p>{{ item.label }}</p>
                            </div>
                            <div class="cards-item-absoulte">
                                <router-link :to="item.path">
                                    <span>前往>></span>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
              </a-col>
            </a-row>
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