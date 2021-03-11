<template>
  <div>
    <el-row class="navbar el-table__fixed-header-wrapper">
      <el-col :sm="5" class="right">
        <a href="/home" class="title">
          <img src="@/assets/images/logo.jpg" alt="logo" class="logo">
          <span v-html="$store.state.settings.title" />
        </a>
      </el-col>
      <el-col :sm="14" class="search">
        <search-box />
      </el-col>
      <el-col :sm="5" class="user-info">
        <span>登录/注册</span>
      </el-col>
    </el-row>
    <!--防止下面的盒子上移动，nav-bar脱离了标准流-->
    <div style="height: 50px;" />
  </div>
</template>
<script>
import SearchBox from '@/layout/components/SearchBox'
export default {
  name: 'NavBar',
  components: {
    SearchBox
  }
}
</script>
<style scoped>
.navbar{
  height: 50px;
  border-bottom: 1px solid rgba(34, 36, 38, .15);
  box-shadow: 0 1px 2px 0 rgba(34, 36, 38, .15);

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding-left: 6%;
  padding-right: 6%;
  background-color: #ffffff;
  z-index: 9;
}
.right {
  word-break: keep-all; /* 不换行 */
  white-space: nowrap; /* 不换行 */
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  display: block;
  font-weight: 700;
  height: 45px;
  text-decoration: none;
  color: #333;
}

.title span {
  margin-left: 5px;
}

.logo {
  width: 30px;
  position: relative;
  top: 5px;
}

.search {
  text-align: center;
  padding-top: 6px;
}
.user-info {
  padding-top: 6px;
  word-break: keep-all; /* 不换行 */
  white-space: nowrap; /* 不换行 */
}
</style>
