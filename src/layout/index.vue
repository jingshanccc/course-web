<template>
  <div>
    <nav-bar />
    <div class="main-container">
      <transition name="fade-transform" mode="out-in">
        <keep-alive>
          <router-view />
        </keep-alive>
      </transition>
    </div>
    <!--  底部文字和备案号  -->
    <div id="el-main-footer">
      <span v-html="$store.state.settings.footerText" />
      <span> ⋅ </span>
      <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">{{ $store.state.settings.caseNumber }}</a>
    </div>
  </div>
</template>
<script>
import NavBar from '@/layout/components/NavBar'
export default {
  name: 'Layout',
  components: {
    NavBar
  }
}
</script>
<style>
.main-container{
  min-width: 1000px;
  padding: 20px 60px 45px 6%;
  background-color: #e7eaec;
}
</style>
