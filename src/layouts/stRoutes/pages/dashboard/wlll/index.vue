<template>
    <!-- 最新文旅活动/热门浏览 -->
    <div class="dashboard-wlll">
      <a-row :gutter="16">
        <a-col :span="12">
          <div class="wlll-item">
            <div class="wlll-item-title">
              <div class="dzIcon-box">
                <img class="dzIcon" :src="moduleIcons.hd.icon" />
              </div>
              最新文旅活动
            </div>
            <div class="wlll-item-swipper">
              <a-row :gutter="16">
                <a-col
                  :span="12"
                  v-for="(item, index) in wllls.wlhdList"
                  :key="index"
                >
                  <div class="swipper-item">
                    <div class="item-box">
                      <div class="swipper-item-img">
                        <img :src="item.img" />
                      </div>
                      <div class="swipper-item-labels backdrop-filter">{{ item.label }}</div>
                    </div>
                  </div>
                </a-col>
              </a-row>
            </div>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="wlll-item">
            <div class="wlll-item-title">
              <div class="dzIcon-box">
                <img class="dzIcon" :src="moduleIcons.hot.icon" />
              </div>
              热门浏览
            </div>
            <div class="wlll-item-swipper">
              <div class="swipper-item hot-item" v-for="(item, index) in wllls.rmllList"
                  :key="index">
                    <div class="item-box">
                      <div class="swipper-item-carousel">
                        <div class="item-tag" :style="`background-image:url(${item.bgIcon});`">{{ item.tag }}</div>
                        <img :src="item.img" />
                      </div>
                      <div class="swipper-item-labels hot-labels backdrop-filter">
                        <div class="hot-text">
                          {{ item.label }}
                          <div class="labels-address">
                            {{ item.address }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
</template>

<script lang="ts">
import Index from './index'
export default Index;
</script>

<style lang="less" scoped>
.dashboard {
  padding: 0 24px;
  background-color: #F7F8FA;
  .dzIcon-box{
    display: inline-block;
    width: 35px;
    height: 35px;
    background: #F6F7FB;
    border-radius: 50%;
    text-align: center;
    line-height: 35px;
    margin-right: 10px;
  }
  .dzIcon {
    width: 20px;
    height: 20px;
  }
 // 最新文旅活动/热门浏览
 &-wlll {
    margin: 20px 0px;
    .wlll-item {
      background: #fff;
      &-title {
        font-size: 20px;
        font-weight: bold;
        color: #151515;
        padding: 10px 24px;
        border: 1px solid #DCDEE0;
      }
      &-swipper {
        padding: 30px 24px 90px 24px;
        overflow-x:auto; // TO添加支持滚动
        display: flex;
        flex-wrap: nowrap;
        .swipper-item {
          .item-box{
            position: relative;
          }
          &-img {
            > img {
              width:100%;
              height: 100%;
              object-fit: contain;
            }
          }
          &-carousel {
            .item-tag{
              position: absolute;
              top:0;
              right: 0;
              color: #fff;
              display: inline-block;
              height: 54px;
              padding: 6px;
              background-repeat: no-repeat;
              background-size: contain;
            }
            > img {
              width:100%;
              height: 100%;
              object-fit: contain;
            }
          }
          &-labels {
            background: rgba(238,243,255,0.7);;
            position: absolute;
            left: 0;
            bottom: 0;
            padding-left:2em;
            height: 70px;
            line-height: 70px;
            width: 100%;
            font-size: 1vw;
            font-weight: 500;
            color: #222222;
            border: 1px solid #D1F0FF;
            
            &.backdrop-filter{
              backdrop-filter: blur(7px);
            }
            .labels-address {
              margin-top: 7px;
              font-size: calc(1vw - 6px);
              
            }
            &.hot-labels{
              display: flex;
              line-height: 1em;
              align-items: center;
            }
          }

          &.hot-item{
            width: 38%;
            flex-shrink: 0;
            margin-right: 16px;
            &:last-child{
              margin-right: 0;
            }
          }
        }
      }
    }
  }
}

</style >