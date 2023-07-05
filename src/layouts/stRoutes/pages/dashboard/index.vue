<template>
  <div class="dashboard">
    <!-- 视频弹框 -->
    <a-modal
      v-model:visible="visible"
      title="数字化茶园"
      :footer="null"
      width="1000px"
      :destroyOnClose="true"
    >
      <div class="videoModal">
        <video-player
          class="video-player vjs-custom-skin"
          :playsinline="true"
          :options="
            Object.assign({}, playerOptions, {
              sources: [{ type: 'application/x-mpegURL', src: videoAddress }],
            })
          "
        >
        </video-player>
      </div>
    </a-modal>
    <!-- 卡片 -->
    <div class="dashboard-cards">
      <a-row>
        <a-col :span="4" v-for="(item, index) in cardsList" :key="index">
          <div class="card-item">
            <img :src="item.img" alt="" />
            <div class="card-item-content">
              <div class="card-item-title">{{ item.title }}</div>
              <div class="card-item-footer">
                <span class="footer-span">{{ item.count }}</span>
                <label class="footer-label">{{ item.unit }}</label>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
    <!-- 面板 -->
    <!-- v-if="userInfo.deptName == '运营部'" -->
    <div class="dashboard-panels">
      <a-row :gutter="16">
        <a-col :span="12">
          <div class="panel-item panel-item-flex">
            <div class="panel-item-logo">
              <span>{{ userInfo.name.substr(-1) }}</span>
            </div>
            <div class="panel-item-description">
              <p class="description-name">
                <span>下午好，{{ userInfo.name }}</span>
                <a-button type="primary">管理员</a-button>
              </p>
              <p class="description-log">
                <label>上次登录</label>
                <span>2020/03/04</span>
              </p>
              <p class="description-code">
                <label>剩余码量</label>
                <span>20,000,000</span>
              </p>
            </div>
            <div class="panel-item-btns">
              <a-button type="primary" ghost class="useHistory"
                >使用记录</a-button
              >
              <a-button type="primary" ghost>立即购买</a-button>
            </div>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="panel-item">
            <div class="panel-item-title">
              <div class="dzIcon-box">
                <img class="dzIcon" :src="moduleIcons.db.icon" />
              </div>
              我的待办
            </div>
            <div class="panel-item-config">
              <div
                class="config-item"
                @click="
                  $router.push({
                    path: '/stPublic/application/certificationAudit',
                  })
                "
              >
                <div class="config-item-count">5</div>
                <div class="config-item-tip">待认证审批</div>
              </div>
              <div
                class="config-item"
                @click="
                  $router.push({
                    path: '/stPublic/application/teaGardenProperty',
                  })
                "
              >
                <div class="config-item-count">85</div>
                <div class="config-item-tip">待确权审批</div>
              </div>
              <div
                class="config-item"
                @click="
                  $router.push({
                    path: '/stPublic/application/authorizationReview',
                  })
                "
              >
                <div class="config-item-count">10</div>
                <div class="config-item-tip">待授权审核</div>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
    <!-- 我的常用 暂时不做-->
    <!-- <div class="dashboard-used">
            <div class="used-title">
                <div class="dzIcon-box"><img class="dzIcon" :src="moduleIcons.cy.icon" /></div>
                我的常用</div>
            <div class="used-cards">
                <div class="card-item" v-for="(item, index) in usedList" :key="index" @click="$router.push({ path: item.path })">
                    <div class="card-item-img">
                        <img :src="item.icon" />
                    </div>
                    <div class="card-item-label">{{ item.title }}</div>
                </div>
            </div>
            <div class="used-right" @click="$router.push({ path: '/stPublic/application' })">
                <span>前往应用中心></span>
            </div>
        </div> -->
    <!-- 企业认证/地块确权-->
    <Rzqq/>
    <!-- 品牌及码量/数字化茶园 -->
    <Mlcy @update-visible="visible=true"/>
    <!-- 品牌产量分析/溯源数据分析 -->
    <Ppsy/>
    <!-- 最新文旅活动/热门浏览 -->
    <Wlll/>
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue';
import Rzqq from './rzqq/index.vue';
import Mlcy from './mlcy/index.vue';
import Wlll from './wlll/index.vue';
import Ppsy from './ppsy/index.vue';
import Index from './index'

export default defineComponent({
  components:{
    Rzqq,
    Mlcy,
    Wlll,
    Ppsy,
  },
    setup(){
        return {
            ...Index()
        }
    }
});
</script>
<style lang="less" scoped>
@import url("./index.less");
</style>
