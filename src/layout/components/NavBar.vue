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
        <span @click="loginRegister.visible = true; getImageCode()">登录/注册</span>
      </el-col>
      <el-dialog :visible.sync="loginRegister.visible" width="25%" append-to-body center>
        <el-form
          ref="form"
          :model="loginRegister.form"
          :rules="loginRegister.rules"
          class="form"
        >
          <div style="float: right; margin-bottom: 10px; cursor:pointer;">
            <span v-if="loginRegister.isRegister" class="el-link el-link--primary" @click="loginRegister.isRegister = false">已有账号？去登陆</span>
            <span v-else class="el-link el-link--primary" @click="loginRegister.isRegister = true">首次使用？去注册</span>
          </div>
          <h3 class="title">
            {{ $store.state.settings.title }}
          </h3>
          <el-form-item prop="loginName">
            <el-input
              v-model="loginRegister.form.login_name"
              type="text"
              auto-complete="off"
              :placeholder="loginRegister.isRegister ? '用户名' : '用户名/邮箱'"
            />
          </el-form-item>
          <el-form-item v-if="loginRegister.isRegister" prop="name">
            <el-input
              v-model="loginRegister.form.name"
              type="text"
              auto-complete="off"
              placeholder="昵称"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginRegister.form.password"
              type="password"
              auto-complete="off"
              placeholder="密码"
              @keyup.enter.native="doSubmit"
            />
          </el-form-item>
          <el-form-item v-if="loginRegister.isRegister" prop="email">
            <el-input
              v-model="loginRegister.form.email"
              type="text"
              style="width: 70%"
              auto-complete="off"
              placeholder="邮箱"
            />
            <el-button style="float: right" :loading="loginRegister.emailCodeLoading" :disabled="loginRegister.emailCodeButtonDisabled" @click="sendCode">{{ loginRegister.emailCodeButtonName }}</el-button>
          </el-form-item>
          <el-form-item v-if="loginRegister.isRegister" prop="code">
            <el-input v-model="loginRegister.form.code" placeholder="验证码" />
          </el-form-item>
          <el-form-item v-if="!loginRegister.isRegister" prop="code">
            <el-input
              v-model="loginRegister.form.code"
              auto-complete="off"
              placeholder="验证码"
              style="width: 63%"
              @keyup.enter.native="doSubmit"
            />
            <div class="login-code">
              <img :src="loginRegister.codeUrl" alt="code" width="100%" @click="getImageCode">
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="resetForm">取消</el-button>
          <el-button :loading="loginRegister.loading" type="primary" @click="doSubmit">确认</el-button>
        </div>
      </el-dialog>
    </el-row>
    <!--防止下面的盒子上移动，nav-bar脱离了标准流-->
    <div style="height: 50px;" />
  </div>
</template>
<script>
import SearchBox from '@/layout/components/SearchBox'
import { validEmail } from '@/utils/validate'
import { sendEmailCode, getImgCode, register } from '@/api/user'

export default {
  name: 'NavBar',
  components: {
    SearchBox
  },
  data() {
    const validMail = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('邮箱不能为空'))
      } if (validEmail(value)) {
        callback()
      } else {
        callback(new Error('邮箱格式错误'))
      }
    }
    return {
      loginRegister: {
        visible: false,
        loading: false,
        isRegister: false,
        codeUrl: '',
        emailCodeLoading: false,
        emailCodeButtonDisabled: false,
        emailCodeButtonName: '获取验证码',
        emailCodeTime: 60,
        form: {
          id: '', // 登陆时作为验证码 token
          email: '',
          login_name: '',
          name: '',
          code: '',
          password: ''
        },
        rules: {
          email: [{ required: true, trigger: 'blur', validator: validMail }],
          login_name: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
          name: [{ required: true, trigger: 'blur', message: '请输入昵称', length: 18 }],
          password: [{ required: true, trigger: 'blur', message: '密码不能为空' }],
          code: [{ required: true, trigger: 'blur', message: '请输入验证码' }]
        }
      }
    }
  },
  methods: {
    resetForm() {
      this.loginRegister.visible = false
      this.$refs['form'].resetFields()
      window.clearInterval(this.timer)
      this.loginRegister.loading = false
      this.loginRegister.isRegister = false
      this.loginRegister.codeUrl = ''
      this.loginRegister.emailCodeTime = 60
      this.loginRegister.emailCodeButtonName = '获取验证码'
      this.loginRegister.emailCodeButtonDisabled = false
      this.loginRegister.form = { email: '', name: '', code: '', password: '' }
    },
    getImageCode() {
      getImgCode().then(res => {
        this.loginRegister.form.id = res.content.Id
        this.loginRegister.codeUrl = res.content.Base64String
      })
    },
    sendCode() {
      if (this.loginRegister.form.email) {
        this.loginRegister.emailCodeLoading = true
        this.loginRegister.emailCodeButtonName = '验证码发送中'
        const _this = this
        sendEmailCode(this.loginRegister.form.email).then(res => {
          if (res.success) {
            this.$message({
              showClose: true,
              message: '发送成功，验证码有效期5分钟',
              type: 'success'
            })
            this.loginRegister.emailCodeLoading = false
            this.loginRegister.emailCodeButtonDisabled = true
            this.loginRegister.emailCodeButtonName = this.loginRegister.emailCodeTime-- + '秒后重新发送'
            this.timer = window.setInterval(function() {
              _this.loginRegister.emailCodeButtonName = _this.loginRegister.emailCodeTime + '秒后重新发送'
              --_this.loginRegister.emailCodeTime
              if (_this.loginRegister.emailCodeTime < 0) {
                _this.loginRegister.emailCodeButtonName = '重新发送'
                _this.loginRegister.emailCodeTime = 60
                _this.loginRegister.emailCodeButtonDisabled = false
                window.clearInterval(_this.timer)
              }
            }, 1000)
          } else {
            this.loginRegister.emailCodeLoading = false
            this.loginRegister.emailCodeButtonName = '获取验证码'
            this.$notify({
              title: '发送失败',
              type: 'error',
              message: res.message,
              duration: 5000
            })
          }
        }).catch(err => {
          this.resetForm()
          this.loginRegister.emailCodeLoading = false
          console.log(err.response.data.message)
        })
      }
    },
    doSubmit() {
      this.loginRegister.isRegister ? this.handleRegister() : this.handleLogin()
    },
    handleLogin() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loginRegister.loading = true
          const data = { ...this.loginRegister.form }
          this.$store.dispatch('Login', data).then(() => {
            this.loginRegister.loading = false
            this.loginRegister.visible = false
            this.$message('登陆成功')
          }).catch(() => {
            this.loginRegister.loading = false
            this.getImageCode()
          })
        }
      })
    },
    handleRegister() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loginRegister.loading = true
          const data = { ...this.loginRegister.form }
          register(data).then(res => {
            if (res.success) {
              this.$message('注册成功，请使用邮箱/用户名+密码登陆')
              this.resetForm()
              this.loginRegister.visible = true
              this.getImageCode()
            } else {
              this.loginRegister.loading = false
              this.$message({
                type: 'error',
                message: res.message
              })
            }
          })
        }
      })
    }
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
  cursor: pointer;
  word-break: keep-all; /* 不换行 */
  white-space: nowrap; /* 不换行 */
}

.form {
  border-radius: 6px;
  background: #ffffff;
  padding: 25px 25px 5px 25px;
}

.form .title {
  text-align: center;
  color: #707070;
}
.login-code {
  width: 33%;
  display: inline-block;
  height: 38px;
  float: right;
}
img {
  cursor: pointer;
  vertical-align: middle
}

</style>
