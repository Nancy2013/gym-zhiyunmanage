<template>
  <div class="swiper">
    <swiper :modules="modules" slides-per-view="auto" :space-between="10" :speed="1200" direction='vertical'
      :navigation="navigation" @swiper="onSwiper" @clickSwiper="onSwiperclick">
      <template v-for="item in data" :key="item">
        <swiper-slide  :class="`swiper-slide ${actived===item.id?'actived':''}`" @click="onSlideClick(item)" >{{ item.id }}</swiper-slide>
      </template>
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
