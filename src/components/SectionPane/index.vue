<template>
  <div>
    <div v-for="(chapter, c) in course.chapters" :key="chapter.id" class="chapter">
      <h3>第{{ chapter.sort }}章 {{ chapter.name }}</h3>
      <ul class="video">
        <li v-for="(item, s) in chapter.sections" :key="item.id" @click="startLearn(c, s)">
          <i class="el-icon-video-play" /> {{ chapter.sort }}-{{ item.sort }} {{ item.title }} ({{ formatSecond(item.time) }})
          <el-button v-if="learnBtn" type="danger" size="mini" round>开始学习</el-button>
        </li>
      </ul>
    </div>
    <login-register ref="loginRegister" :after-login="confirmBuyCourse" />
  </div>
</template>
<script>
import { formatSecond, openHref } from '@/utils'
import { addCourse } from '@/api/user'
import { mapGetters } from 'vuex'
import LoginRegister from '@/components/LoginRegister'
export default {
  name: 'SectionPane',
  components: { LoginRegister },
  props: {
    course: {
      type: Object,
      required: true
    },
    learnBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      routerData: {}
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  methods: {
    formatSecond,
    addCourse() {
      addCourse(this.course.id).then(res => {
        if (res.success) {
          openHref(this.$router, 'Learning', this.routerData, false)
        } else {
          this.$notify({
            title: res.message,
            type: 'warning'
          })
        }
      })
    },
    // 弹窗确认购买
    confirmBuyCourse() {
      this.$confirm('购买本课程需要花费' + this.course.price + '积分, 是否购买?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        // 2-1. 确认后添加进我的课程 然后跳转到学习页面
        this.$message({
          type: 'success',
          message: '购买成功!'
        })
        this.addCourse()
      }).catch(() => {
        // 2-2. 取消后啥也不干
        this.$message({
          type: 'info',
          message: '取消购买'
        })
      })
    },
    /**
     * @param c chapter 下标
     * @param s section 下标
     */
    startLearn(c, s = 0) {
      if (typeof c === 'object') {
        c = 0
      }
      this.routerData = { course: this.course, chapter: c, section: s, randomCode: new Date().getTime() }
      // 若章节免费则不登陆也可观看，付费则检查登陆状态，未登陆则弹出登陆/注册框，已登陆则进行购买课程确认
      if (this.course.chapters[c].sections[s].charge === '免费') {
        if (this.userInfo.id !== '') { // 已登录 记录进"我的课程"
          this.addCourse()
        } else {
          openHref(this.$router, 'Learning', this.routerData, false)
        }
      } else {
        if (this.userInfo.id !== '') { // 已登录
          this.confirmBuyCourse()
        } else {
          // 1. 弹窗登录 登录成功后 执行付费+已登录逻辑(afterLogin) 登录失败后什么都不做
          this.$refs.loginRegister.visible = true
          this.$refs.loginRegister.getImageCode()
        }
      }
    }
  }
}
</script>
<style scoped>
.chapter {
  margin-bottom: 8px;
  padding: 24px 32px 32px;
  background: #fff;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}
.chapter h3 {
  color: #1c1f21;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
}
.chapter .video {
  list-style: none;
}
.chapter .video li {
  padding-top: 10px;
  font-size: 15px;
  line-height: 30px;
  cursor: pointer;
}
.chapter li:hover {
  color: red;
}
.chapter li button {
  display: none;
}
.chapter li:hover button {
  display: inline;
  float: right;
}
</style>
