<template>
  <!-- 品牌及码量/数字化茶园 -->
    <div class="dashboard-mlcy">
      <a-row :gutter="16">
        <a-col :span="12">
          <div class="mlcy-item">
            <div class="mlcy-item-title">
              <div class="dzIcon-box">
                <img class="dzIcon" :src="moduleIcons.pp.icon" />
              </div>
              品牌及码量
            </div>
            <div class="mlcy-item-content">
              <a-table
                :columns="codeColumn"
                :data-source="codeList"
                :pagination="false"
                rowClassName="ml-table"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'img'">
                    <img :src="record.img" alt="" class="mlcy-img" />
                  </template>
                </template>
              </a-table>
            </div>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="mlcy-item">
            <div class="mlcy-item-title">
              <div class="dzIcon-box">
                <img class="dzIcon" :src="moduleIcons.sz.icon" />
              </div>
              数字化茶园
            </div>
            <div class="mlcy-item-content">
              <div class="content-top">
                <div class="content-top-carousel">
                  <a-carousel autoplay easing="linear">
                    <div
                      @click="getVideoAddress(item.deviceSerial)"
                      :class="[`carsousel-item`, `carsouel-item-${index}`]"
                      v-for="(item, index) in carousels"
                      :key="index"
                    >
                      <img :src="item.video" />
                    </div>
                  </a-carousel>
                </div>
                <div class="content-top-list">
                  <div class="list-selects">
                    <a-select
                      style="width: 226px"
                      value="茶园1号"
                      placeholder="请选择茶园"
                      :options="[{ value: '茶园1号', label: '茶园1号' }]"
                    ></a-select>
                  </div>
                  <div class="list-tips">
                    <a-row :gutter="4">
                      <a-col :span="12">
                        <label>种植面积：</label>
                        <span>{{ digitalizeObj.zzmj }}</span>
                      </a-col>
                      <a-col :span="12">
                        <label>硒含量：</label>
                        <span>{{ digitalizeObj.xhl }}</span>
                      </a-col>
                    </a-row>

                    <a-row :gutter="4">
                      <a-col :span="12">
                        <label>经纬度：</label>
                        <span>{{ digitalizeObj.jwd }}</span>
                      </a-col>
                      <a-col :span="12">
                        <label>负责人：</label>
                        <span>{{ digitalizeObj.fzr }}</span>
                      </a-col>
                    </a-row>
                  </div>
                </div>
              </div>
              <div class="content-bottom">
                <a-table
                  :columns="digitalizeObj.table.columns"
                  :data-source="digitalizeObj.table.datasource"
                  :pagination="false"
                >
                  <template #bodyCell="{ column, record }">
                    <template v-if="['trwd', 'kqwd'].includes(column.key)">
                      {{ record[column.key] + "℃" }}
                    </template>
                    <template v-if="['trsf', 'kqsd'].includes(column.key)">
                      {{ record[column.key] + "%" }}
                    </template>
                    <template v-if="column.key === 'dqy'">
                      {{ record[column.key] + ".pa" }}
                    </template>
                  </template>
                </a-table>
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
  // 品牌及码量/数字化茶园
  &-mlcy {
    margin: 20px 0px;
    .mlcy-item {
      padding-bottom: 10px;
      background: #fff;
      &-title {
        font-size: 20px;
        font-weight: bold;
        color: #151515;
        padding: 10px 24px;
        border: 1px solid #DCDEE0;
      }
      .mlcy-img{
        width: 176px;
        height: 75px;
      }
      &-content {
        margin: 13px 20px;
        :deep .ml-table td{
          padding: 10px 16px
        }
        .content-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          &-carousel {
            width: 360px;
            height: 157px;
            position: relative;
            margin-right: 96px;
            &:deep(.ant-carousel) {
              text-align: center;
              height: 150px;
              line-height: 150px;
              overflow: hidden;
            }
            .carsousel-item > img {
              width: 100%;
              height: 150px;
              cursor: pointer;
            }
          }
          &-list {
            flex: 1;
            .list-selects {
              margin-bottom: 15px;
            }
            .list-tips {
              > p {
                > label {
                  display: inline-block;
                  width: 100px;
                  padding: 0 0 0 10px;
                  color: #222222
                }
              }
            }
          }
        }
        .content-middle {
          display: flex;
          align-items: center;
          justify-content: space-around;
          &-item {
            text-align: center;
            padding: 20px 0;
            > p {
              margin: 5px 0;
              &:first-child {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                margin: auto;
                margin-bottom: 10px;
                > img {
                  height: 100%;
                }
              }
            }
          }
        }
      }
    }
  }
}

</style >