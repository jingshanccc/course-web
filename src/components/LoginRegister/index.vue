<template>
  <el-dialog :visible.sync="visible" width="25%" append-to-body center>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      class="form"
    >
      <div style="float: right; margin-bottom: 10px; cursor:pointer;">
        <span v-if="isRegister" class="el-link el-link--primary" @click="isRegister = false">已有账号？去登陆</span>
        <span v-else class="el-link el-link--primary" @click="isRegister = true">首次使用？去注册</span>
      </div>
      <h3 class="title">
        {{ $store.state.settings.title }}
      </h3>
      <el-form-item prop="loginName">
        <el-input
          v-model="form.login_name"
          type="text"
          auto-complete="off"
          :placeholder="isRegister ? '用户名' : '用户名/邮箱'"
        />
      </el-form-item>
      <el-form-item v-if="isRegister" prop="name">
        <el-input
          v-model="form.name"
          type="text"
          auto-complete="off"
          placeholder="昵称"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="form.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="doSubmit"
        />
      </el-form-item>
      <el-form-item v-if="isRegister" prop="email">
        <el-input
          v-model="form.email"
          type="text"
          style="width: 70%"
          auto-complete="off"
          placeholder="邮箱"
        />
        <el-button style="float: right" :loading="emailCodeLoading" :disabled="emailCodeButtonDisabled" @click="sendCode">{{ emailCodeButtonName }}</el-button>
      </el-form-item>
      <el-form-item v-if="isRegister" prop="code">
        <el-input v-model="form.code" placeholder="验证码" />
      </el-form-item>
      <el-form-item v-if="!isRegister" prop="code">
        <el-input
          v-model="form.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="doSubmit"
        />
        <div class="login-code">
          <img :src="codeUrl" alt="code" width="100%" @click="getImageCode">
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="resetForm">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import { getImgCode, register, sendEmailCode } from '@/api/user'
import { validEmail } from '@/utils/validate'

export default {
  name: 'LoginRegister',
  props: {
    afterLogin: {
      type: Function,
      default: null
    }
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
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  methods: {
    resetForm() {
      this.visible = false
      this.$refs['form'].resetFields()
      window.clearInterval(this.timer)
      this.loading = false
      this.isRegister = false
      this.codeUrl = ''
      this.emailCodeTime = 60
      this.emailCodeButtonName = '获取验证码'
      this.emailCodeButtonDisabled = false
      this.form = { email: '', name: '', code: '', password: '' }
    },
    getImageCode() {
      getImgCode().then(res => {
        this.form.id = res.content.Id
        this.codeUrl = res.content.Base64String
      })
    },
    sendCode() {
      if (this.form.email) {
        this.emailCodeLoading = true
        this.emailCodeButtonName = '验证码发送中'
        const _this = this
        sendEmailCode(this.form.email).then(res => {
          if (res.success) {
            this.$message({
              showClose: true,
              message: '发送成功，验证码有效期5分钟',
              type: 'success'
            })
            this.emailCodeLoading = false
            this.emailCodeButtonDisabled = true
            this.emailCodeButtonName = this.emailCodeTime-- + '秒后重新发送'
            this.timer = window.setInterval(function() {
              _this.emailCodeButtonName = _this.emailCodeTime + '秒后重新发送'
              --_this.emailCodeTime
              if (_this.emailCodeTime < 0) {
                _this.emailCodeButtonName = '重新发送'
                _this.emailCodeTime = 60
                _this.emailCodeButtonDisabled = false
                window.clearInterval(_this.timer)
              }
            }, 1000)
          } else {
            this.emailCodeLoading = false
            this.emailCodeButtonName = '获取验证码'
            this.$notify({
              title: '发送失败',
              type: 'error',
              message: res.message,
              duration: 5000
            })
          }
        }).catch(err => {
          this.resetForm()
          this.emailCodeLoading = false
          console.log(err.response.data.message)
        })
      }
    },
    doSubmit() {
      this.isRegister ? this.handleRegister() : this.handleLogin()
    },
    handleLogin() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const data = { ...this.form }
          this.$store.dispatch('Login', data).then(() => {
            this.loading = false
            this.visible = false
            this.$message('登陆成功')
            this.afterLogin()
          }).catch(() => {
            this.loading = false
            this.getImageCode()
          })
        }
      })
    },
    handleRegister() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const data = { ...this.form }
          register(data).then(res => {
            if (res.success) {
              this.$message('注册成功，请使用邮箱/用户名+密码登陆')
              this.resetForm()
              this.visible = true
              this.getImageCode()
            } else {
              this.loading = false
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
<style lang="scss" scoped>
.form {
  border-radius: 6px;
  background: #ffffff;
  padding: 25px 25px 5px 25px;
  .title {
    text-align: center;
    color: #707070;
  }
}

.login-code {
  width: 33%;
  display: inline-block;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle
  }
}
</style>
