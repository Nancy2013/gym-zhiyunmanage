<template>
    <div class="videoMonitor">
        <!-- 摄像头 -->
        <div class="videoMonitor-camera">
            <!-- 标题头 -->
            <div class="camera-title">
                <div class="camera-title-left"><span>摄像头</span></div>
                <div class="camera-title-right">
                    <ul>
                        <li>
                            <label>全部</label>
                            <span>4</span>
                        </li>
                        <li>
                            <label>种植</label>
                            <span>1</span>
                        </li>
                        <li>
                            <label>生产</label>
                            <span>3</span>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- 主内容 -->
            <div class="camera-content">
                <a-row :gutter="16">
                  <a-col :span="18">
                    <div class="camera-content-video">
                      <div class="video-item" v-for="(item, index) in cameraList" :key="index">
                         <div class="video-item-header">
                            <p><span>{{ item.name }}</span></p>
                            <p><img :src="screenIcon1" /></p>
                         </div>
                         <div class="video-item-show">
                           <img :src="item.video" />
                         </div>
                     </div>
                    </div>
                  </a-col>
                  <a-col :span="6">
                    <div class="camera-content-annotate">
                        <div class="annotate-info">
                           <div class="annotate-info-title">
                              <span>设备信息</span>
                           </div>
                           <div class="annotate-info-labels">
                             <p>
                                <label>所属公司</label>
                                <span>石台西黄山</span>
                             </p>
                             <p>
                                <label>设备名称</label>
                                <span>摄像头001</span>
                             </p>
                             <p>
                                <label>型号</label>
                                <span>TL800</span>
                             </p>
                             <p>
                                <label>位置</label>
                                <span>01车间自动化流水线拐角处</span>
                             </p>
                             <p>
                                <label>监控方式</label>
                                <span>固定点监控</span>
                             </p>
                           </div>
                        </div>
                        <div class="annotate-location">
                            <div class="annotate-location-title">
                              <span>所在位置</span>
                           </div>
                           <div class="annotate-location-map">
                              <div class="map" id="cameraMap">
                                 <img :src="addressIcon" />
                              </div>
                           </div>
                        </div>
                    </div>
                  </a-col>
                </a-row>
            </div>
        </div>
        <!-- 气象站 -->
        <div class="videoMonitor-weather">
            <!-- 标题头 -->
            <div class="weather-title">
                <div class="weather-title-left"><span>气象站</span></div>
            </div>
            <!-- 主内容 -->
            <div class="weather-content">
                <a-row :gutter="16">
                  <a-col :span="18">
                    <div class="weather-content-target">
                        <!-- 气象站001 -->
                        <div class="target-card">
                            <div class="target-card-title"><span>气象站001</span></div>
                            <div class="target-card-item" v-for="(item, index) in weathers.one" :key="index">
                               <p><span>{{ item.value }}</span></p>
                               <p><label>{{ item.name }}</label></p>
                            </div>
                        </div>
                        <!-- 气象站002 -->
                        <div class="target-card">
                            <div class="target-card-title"><span>气象站002</span></div>
                            <div class="target-card-item" v-for="(item, index) in weathers.two" :key="index">
                               <p><span>{{ item.value }}</span></p>
                               <p><label>{{ item.name }}</label></p>
                            </div>
                        </div>
                         <!-- 气象站003 -->
                         <div class="target-card">
                            <div class="target-card-title"><span>气象站003</span></div>
                            <div class="target-card-item" v-for="(item, index) in weathers.three" :key="index">
                               <p><span>{{ item.value }}</span></p>
                               <p><label>{{ item.name }}</label></p>
                            </div>
                        </div>
                         <!-- 气象站004 -->
                         <div class="target-card">
                            <div class="target-card-title"><span>气象站004</span></div>
                            <div class="target-card-item" v-for="(item, index) in weathers.four" :key="index">
                               <p><span>{{ item.value }}</span></p>
                               <p><label>{{ item.name }}</label></p>
                            </div>
                        </div>
                    </div>
                  </a-col>
                  <a-col :span="6">
                    <div class="weather-content-annotate">
                        <div class="annotate-info">
                            <div class="annotate-info-title">
                              <span>设备信息</span>
                           </div>
                           <div class="annotate-info-labels">
                             <p>
                                <label>所属公司</label>
                                <span>石台西黄山</span>
                             </p>
                             <p>
                                <label>设备名称</label>
                                <span>摄像头001</span>
                             </p>
                             <p>
                                <label>型号</label>
                                <span>TL800</span>
                             </p>
                             <p>
                                <label>位置</label>
                                <span>01车间自动化流水线拐角处</span>
                             </p>
                             <p>
                                <label>监控方式</label>
                                <span>固定点监控</span>
                             </p>
                           </div>
                        </div>
                        <div class="annotate-location">
                            <div class="annotate-location-title">
                              <span>所在位置</span>
                           </div>
                           <div class="annotate-location-map">
                              <div class="map" id="weatherMap">
                                 <img :src="addressIcon" />
                              </div>
                           </div>
                        </div>
                    </div>
                  </a-col>
                </a-row>
            </div>
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