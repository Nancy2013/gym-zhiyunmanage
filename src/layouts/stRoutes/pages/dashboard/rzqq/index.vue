<template>
    <!-- 企业认证/地块确权 -->
    <div class="dashboard-rzqq">
        <a-row :gutter="16">
            <a-col :span="12">
                <div class="rzqq-item">
                    <div class="rzqq-item-title">
                        <span class="more" @click="$router.push({ path: '/stPublic/application/certificationAudit' })">
                            <span class="text">查看更多</span>
                            <img :src="rightArrow" alt="" />
                        </span>
                        <div class="dzIcon-box">
                            <img class="dzIcon" :src="moduleIcons.rz.icon" />
                        </div>
                        企业认证
                    </div>
                    <div class="rzqq-item-tips">
                        <div class="tips-item" v-for="(item, index) in enterpriseDots" :key="index">
                            <div :class="[
                    `tips-item-square`,
                    `square-background-${item.status}`,
                  ]"></div>
                            <div class="tips-item-remark">
                                <span>{{ switchQyStatus(item.status) }}</span>
                                <span>{{ item.count }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="rzqq-item-table">
                        <div class="table-item" v-for="(item, index) in enterpriseList" :key="index">
                            <p>{{ item.name }}</p>
                            <p :class="`status-${item.status}`">
                                {{ switchQyStatus(item.status) }}
                            </p>
                            <p>{{ item.time }}</p>
                        </div>
                    </div>
                </div>
            </a-col>
            <a-col :span="12">
                <div class="rzqq-item" @click="
              $router.push({ path: '/stPublic/application/teaGardenProperty' })
            ">
                    <div class="rzqq-item-title">
                        <!-- <span class="more" @click="$router.push({ path: '/stPublic/application/teaGardenProperty' })">
                            <span class="text">查看更多</span>
                            <img :src="rightArrow" alt="" />
                        </span> -->
                        <div class="dzIcon-box">
                            <img class="dzIcon" :src="moduleIcons.qq.icon" />
                        </div>
                        地块确权
                    </div>
                    <div class="rzqq-item-tips">
                        <div class="tips-item" v-for="(item, index) in farmDots" :key="index">
                            <div :class="[
                    `tips-item-square`,
                    `square-background-${item.status}`,
                  ]"></div>
                            <div class="tips-item-remark">
                                <span>{{ switchDkStatus(item.status) }}</span>
                                <span>{{ item.count }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="rzqq-item-table">
                        <div class="table-item" v-for="(item, index) in farmList" :key="index">
                            <p>{{ item.name }}</p>
                            <p :class="`status-${item.status}`">
                                {{ switchDkStatus(item.status) }}
                            </p>
                            <p>{{ item.time }}</p>
                        </div>
                    </div>
                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script lang="ts">
import Index from "./index";
export default Index;
</script>

<style lang="less" scoped>
.dashboard {
    padding: 0 24px;
    background-color: #f7f8fa;
    .dzIcon-box {
        display: inline-block;
        width: 35px;
        height: 35px;
        background: #f6f7fb;
        border-radius: 50%;
        text-align: center;
        line-height: 35px;
        margin-right: 10px;
    }
    .dzIcon {
        width: 20px;
        height: 20px;
    }
    .more {
        position: absolute;
        bottom: 10px;
        right: 20px;
        cursor: pointer;
        color: #185ef0;
        .text {
            vertical-align: middle;
            font-size: 18px;
        }
        img {
            vertical-align: middle;
            width: 10px;
            height: 14px;
            margin-left: 8px;
        }
    }
    // 企业认证/地块确权
    &-rzqq {
        margin: 20px 0px;
        .rzqq-item {
            padding-bottom: 10px;
            background: #fff;
            &-title {
                font-size: 20px;
                color: #151515;
                padding: 10px 24px;
                border: 1px solid #dcdee0;
                position: relative;
                .dzIcon-box {
                    font-weight: bold;
                }
            }
            &-tips {
                padding: 10px 20px;
                display: flex;
                justify-content: flex-end;
                .tips-item {
                    padding: 0 10px;
                    display: inline-flex;
                    align-items: center;
                    border: 1px solid #dcdee0;
                    margin-left: 44px;
                    &-square {
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                    }
                    .square-background-1 {
                        background: #1ebc5d;
                    }
                    .square-background-2 {
                        background: #666666;
                    }
                    .square-background-3 {
                        background: #fa3838;
                    }
                    &-remark {
                        > span {
                            padding: 0 5px;
                            &:last-child {
                                font-weight: 600;
                            }
                        }
                    }
                }
            }
            &-table {
                padding: 10px 20px;
                .table-item {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 10px 0 0;
                    border-bottom: 1px solid #d8d8d8;
                    &:first-child {
                        border: 1px solid #d8d8d8;
                    }
                    .status-1 {
                        color: #1ebc5d;
                    }
                    .status-2 {
                        color: #787878;
                    }
                    .status-3 {
                        color: #fd592c;
                    }
                    p {
                        flex: 1;
                        text-align: center;
                    }
                }
            }
        }
    }
}
</style >