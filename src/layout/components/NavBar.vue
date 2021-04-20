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
      <el-col :sm="5">
        <el-dropdown v-if="isLogin" class="avatar-container hover-effect" placement="bottom-start">
          <div class="avatar-wrapper">
            <img alt="头像" :src="userInfo.photo ? userInfo.photo : Avatar" class="user-avatar">
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown">
            <router-link to="/user">
              <el-dropdown-item>
                个人中心
              </el-dropdown-item>
            </router-link>
            <span style="display: block" @click="logout">
              <el-dropdown-item>
                退出登录
              </el-dropdown-item>
            </span>
          </el-dropdown-menu>
        </el-dropdown>
        <span v-else class="user" @click="$refs.loginRegister.visible = true; $refs.loginRegister.getImageCode()">登录/注册</span>
      </el-col>
      <login-register ref="loginRegister" />
    </el-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Avatar from '@/assets/images/avatar.gif'
import SearchBox from '@/layout/components/SearchBox'
import LoginRegister from '@/components/LoginRegister'

export default {
  name: 'NavBar',
  components: {
    LoginRegister,
    SearchBox
  },
  data() {
    return {
      isLogin: true,
      Avatar
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  methods: {
    logout() {
      this.$message('logout')
    }
  }
}
</script>
<style lang="scss" scoped>
.navbar {
  height: 50px;
  border-bottom: 1px solid rgba(34, 36, 38, .15);
  box-shadow: 0 1px 2px 0 rgba(34, 36, 38, .15);

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 0 6%;
  margin-bottom: 5px;
  background-color: #ffffff;
  z-index: 9;
  img {
    cursor: pointer;
    vertical-align: middle
  }
}

.title {
  display: block;
  font-weight: 700;
  height: 45px;
  text-decoration: none;
  color: #333;
}

.title span {
  line-height: 45px;
  margin-left: 5px;
}

.logo {
  width: 30px;
  top: 5px;
}

.search {
  text-align: center;
  padding-top: 6px;
}

.user {
  line-height: 45px;
  cursor: pointer;
}

.avatar-container {
  cursor: pointer;
  .avatar-wrapper {
    margin-top: 5px;
    position: relative;

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }

    .el-icon-caret-bottom {
      position: relative;
      right: -10px;
      font-size: 12px;
    }
  }
}

</style>
