<template>
  <div class="swiper">
    <swiper
    :modules="modules"
    :slides-per-view="2"
    :space-between="10"
    :speed="1200"
    direction='vertical'
    :navigation="navigation"
    :centeredSlides="true"
    @swiper="onSwiper"
    @clickSwiper="clickSwiper"
    @snapGridLengthChange='snapGridLengthChange'
  >
    <swiper-slide @click="clickSlide(item)" v-for="item in data" :key="item">{{item.id}}</swiper-slide>
  </swiper>
  <div class="swiper-button-prev"></div>
  <div class="swiper-button-next"></div>
  </div>
</template>
<script lang="ts">
import Index from './index'

export default Index;
</script>
<style lang="less" scoped>
@import url("./index.less");
</style>
