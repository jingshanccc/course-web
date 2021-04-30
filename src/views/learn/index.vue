<template>
  <div>
    <el-page-header :content="chapter.sort +'-'+ section.sort + ' ' + section.title" @back="$router.push({ name: 'CourseDetail', query: { id: course.id }})" />
    <el-row class="container">
      <el-col :span="2">
        <el-menu background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" @select="drawer = true">
          <el-menu-item>
            <i class="el-icon-document" />
            <span slot="title">章节</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="16">
        <player ref="player" :player-options="options" />
      </el-col>
      <el-col :span="6">
        <div class="teacher">
          <teacher-info :teacher="course.teacher" :type="{ cursor: 'pointer', width: '200px', height: '80px' }" />
          <span class="intro" :title="course.teacher.intro">{{ course.teacher.intro }}</span>
        </div>
        <div class="download">
          <div><strong>下载</strong></div>
          <div class="content" @click="getCourseContent"><i class="el-icon-document" /> 课程讲义下载 <i class="el-icon-download" /></div>
        </div>
        <div class="courses">
          <course-pane :course-id="course.id" :is-vertical="true" :styles="{ backgroundColor: '#333333' }" />
        </div>
      </el-col>
    </el-row>
    <el-drawer title="章节目录" :visible.sync="drawer" direction="ltr" :modal="false" :with-header="false">
      <section-pane :course="course" :learn-btn="false" />
    </el-drawer>
    <el-drawer title="课程讲义" :visible.sync="contentDrawer" direction="rtl" :size="'40%'" :modal="false" :with-header="false">
      <div style="text-align: center">
        <el-button v-print="'#pdfDom'" type="primary" round>下载</el-button>
        <el-button type="danger" round @click="contentDrawer = false">关闭</el-button>
      </div>
      <div id="pdfDom" style="margin: 10px">
        <div v-html="courseContent" />
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { downloadCourseContent } from '@/api/course'
import { saveLearnInfo, experience } from '@/api/user'
import Player from '@/components/Player'
import SectionPane from '@/components/SectionPane'
import TeacherInfo from '@/components/TeacherInfo'
import CoursePane from '@/components/CoursePane'
export default {
  name: 'Learning',
  components: {
    CoursePane,
    SectionPane,
    Player,
    TeacherInfo
  },
  data: () => {
    return {
      course: {},
      chapter: {},
      section: {},
      courseContent: '',
      drawer: false,
      contentDrawer: false,
      options: {}
    }
  },
  created() {
    if (!this.$route.params.course) {
      this.$router.push({ name: 'Course' })
    }
    this.course = this.$route.params.course
    this.chapter = this.course.chapters[this.$route.params.chapter]
    this.section = this.chapter.sections[this.$route.params.section]
    this.options.sources = [{
      type: 'video/mp4',
      src: this.section.video
    }]
    this.startRecord()
  },
  destroyed() {
    this.clearRecord()
  },
  methods: {
    getCourseContent() {
      if (this.courseContent === '') {
        downloadCourseContent(this.course.id).then(res => {
          if (res.success) {
            this.courseContent = res.content.str
          }
        })
      }
      this.contentDrawer = true
    },
    startRecord() {
      this.timer = setInterval(function() {
        this.addExperience()
      }, 100000)
    },
    clearRecord() {
      clearInterval(this.timer)
      saveLearnInfo(this.course.id, this.chapter.sort + ' ' + this.section.sort + ' ' + this.$refs.player.curTime).then().catch()
    },
    addExperience() {
      // 记录学习进度和发放积分分开 由于存在快进快退因此经验参照页面停留时间、积分在自动切换下一节时发放
      // 学习进度在离开页面/章节切换时记录
      console.log(this.$refs.player.curTime)
      experience(this.course.id).then(res => {
        if (res.success) {
          this.$message('经验+10')
        }
      })
    }
  }
}
</script>
<style scoped>
.container {
  margin-top: 20px;
  background-color: #333333;
  color: #f8fafc;
  border-radius: 5px;
}
.teacher {
  margin: 20px 10px 10px 10px;
}
.teacher .intro {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3; /* 设置显示行数 */
  overflow: hidden;
  font-size: 12px;
  color: rgba(255,255,255,.6);
  line-height: 22px;
}
.download {
  padding: 10px;
}
.download .content {
  cursor: pointer;
  margin-top: 20px;
  margin-left: 10px;
  font-size: 15px;
}
/deep/.el-drawer.rtl{
  overflow: auto;
}
</style>
