<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="5" style="margin-bottom: 10px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人中心</span>
          </div>
          <div>
            <div style="text-align: center">
              <img
                :src="userInfo.photo ? userInfo.photo : Avatar"
                title="点击上传头像"
                class="avatar"
                alt="avatar"
              >
              <upload
                :input-id="'image-upload'"
                :text="'上传头像'"
                :suffixes="['jpg', 'jpeg','png', 'gif']"
                :after-upload="cropUploadSuccess"
              />
            </div>
            <ul class="user-info">
              <li><div style="height: 100%"><svg-icon icon-class="user" /> 登录账号<div class="user-right">{{ userInfo.login_name }}</div> </div> </li>
              <li><svg-icon icon-class="menu" /> 用户昵称 <div class="user-right">{{ userInfo.name }}</div></li>
              <li><svg-icon icon-class="email" /> 用户邮箱 <div class="user-right">{{ userInfo.email }}</div></li>
              <li><svg-icon icon-class="integral" /> 我的积分 <div class="user-right">{{ userInfo.integral }}</div></li>
              <li><svg-icon icon-class="time" /> 学习时长 <div class="user-right">{{ formatSecond(userInfo.learning_time, true) }}</div></li>
              <li>
                <svg-icon icon-class="security" /> 安全设置
                <div class="user-right">
                  <a @click="$refs.pass.dialog = true">修改密码 </a>
                  <a @click="$refs.email.dialog = true">修改邮箱</a>
                </div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="19">
        <el-card class="box-card">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="我的课程" name="first">
              <h4 v-if="isRecommend">你还没有开始学习，为你推荐以下课程</h4>
              <course-pane v-if="isLoad && courses.length > 0" course-id="''" :courses="courses" />
            </el-tab-pane>
            <el-tab-pane label="用户资料" name="second">
              <el-form ref="form" :model="form" :rules="rules" style="margin-top: 10px" size="small" label-width="64px">
                <el-form-item label="昵称" prop="nickname">
                  <el-input v-model="form.name" style="width: 35%" />
                  <span style="color: #C0C0C0; margin-left: 10px;">用户昵称不作为登录使用</span>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="form.email" style="width: 35%" />
                  <span style="color: #C0C0C0; margin-left: 10px;">邮箱不能重复</span>
                </el-form-item>
                <el-form-item label="性别">
                  <el-radio-group v-model="form.sex" style="width: 178px">
                    <el-radio label="男">男</el-radio>
                    <el-radio label="女">女</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="">
                  <el-button :loading="saveLoading" size="mini" type="primary" @click="doSubmit">保存配置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    <update-email ref="email" :email="userInfo.email" />
    <update-pass ref="pass" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Avatar from '@/assets/images/avatar.gif'
import { formatSecond } from '@/utils'
import { validEmail } from '@/utils/validate'
import Upload from '@/components/Upload'
import UpdatePass from '@/views/user/UpdatePass'
import UpdateEmail from '@/views/user/UpdateEmail'
import { saveUser, courses } from '@/api/user'
import { newPublish } from '@/api/course'
import CoursePane from '@/components/CoursePane'

export default {
  name: 'User',
  components: {
    CoursePane,
    Upload,
    UpdateEmail,
    UpdatePass
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
      Avatar: Avatar,
      activeName: 'first',
      courses: [],
      isLoad: false,
      isRecommend: false,
      saveLoading: false,
      form: {},
      rules: {
        name: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, trigger: 'blur', validator: validMail }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  created() {
    this.form = { ...this.userInfo }
    console.log('user create')
    this.getCourses()
  },
  methods: {
    formatSecond,
    async getCourses() {
      courses(this.form.id).then(res => {
        if (res.success) {
          if (res.content.rows) {
            console.log('is load')
            this.isLoad = true
            this.courses = res.content.rows
          } else {
            newPublish().then(res => {
              if (res.success) {
                console.log('car is load')
                this.courses = res.content.rows
              }
              this.isLoad = true
              this.isRecommend = true
            })
          }
        } else {
          this.$message('获取课程失败')
          this.isLoad = true
        }
      })
    },
    handleClick(tab, event) {
    },
    cropUploadSuccess(data) {
      this.userInfo.photo = data.path
      saveUser(this.userInfo).then(() => {
        // 需要更新 缓存中的userinfo
        this.$store.dispatch('UserInfo').then(() => {})
      })
    },
    doSubmit() {
      if (this.$refs['form']) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.saveLoading = true
            saveUser(this.form).then(res => {
              if (res.success) {
                this.$notify({
                  title: '保存成功',
                  type: 'success',
                  duration: 2500
                })
                this.$store.dispatch('UserInfo').then(() => {})
              } else {
                this.$notify({
                  title: '保存失败',
                  type: 'error',
                  message: res.message,
                  duration: 5000
                })
              }
              this.saveLoading = false
            }).catch(() => {
              this.saveLoading = false
            })
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.container {
  padding-top: 20px;
}
.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}
.user-info {
  padding-left: 0;
  list-style: none;
  li {
    border-bottom: 1px solid #F0F3F4;
    padding: 11px 0;
    font-size: 13px;
  }
  .user-right {
    float: right;
    a{
      color: #317EF3;
    }
  }
}
</style>
