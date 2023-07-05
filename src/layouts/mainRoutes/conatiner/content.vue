<template>
  <a-layout-content class="manage-content">
    <div class="manage-content-layout">
      <router-view />
    </div>
  </a-layout-content>
</template>

<style>
.manage-content {
  overflow: auto;
  min-height: 280px;
}
.manage-content-layout {
  padding: 15px;
  margin: 10px;
  background: #fff;
  height: calc(100% - 20px);
  overflow: auto;
}
</style>