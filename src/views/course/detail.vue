<template>
  <div>
    <div class="bg" :style="{ backgroundImage: 'url('+ course.image + ')' }" />
    <div class="header">
      <el-page-header content="课程详情" title="首页" @back="$router.push({name: 'Course'})" />
      <h1>{{ course.name }}</h1>
      <teacher-info :teacher="course.teacher" :type="{ cursor: 'pointer', width: '200px', float: 'left', height: '80px' }" />
      <ul class="course-info">
        <li><span><strong>难度</strong> {{ course.level }}</span></li>
        <li><span><strong>时长</strong> {{ formatSecond(course.time, true) }}</span></li>
        <li><span><strong>学习人数</strong> {{ course.enroll ? course.enroll : 0 }}</span></li>
        <span style="float: right">{{ learnInfoText }}</span>
        <el-button type="danger" style="float: right" round icon="el-icon-thumb" @click.native="$refs.sectionPane.startLearn(-1)">{{ buttonText }}</el-button>
      </ul>
    </div>
    <el-divider />
    <el-row :gutter="40">
      <el-col :span="17" class="course-content">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="章节" name="chapter">
            <div class="course-wrap" style="font-size: 14px">
              简介：{{ course.summary }}
            </div>
            <section-pane ref="sectionPane" :course="course" />
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="7">
        <course-pane :course-id="course.id" :is-vertical="true" />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { formatSecond } from '@/utils'
import { course } from '@/api/course'
import { courseInfo } from '@/api/user'
import { mapGetters } from 'vuex'
import SectionPane from '@/components/SectionPane'
import TeacherInfo from '@/components/TeacherInfo'
import CoursePane from '@/components/CoursePane'
export default {
  name: 'CourseDetail',
  components: {
    CoursePane,
    SectionPane,
    TeacherInfo
  },
  data: () => {
    return {
      course: {
        id: '',
        teacher: {},
        chapters: []
      },
      activeTab: 'chapter',
      buttonText: '开始学习',
      learnInfoText: ''
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  created() {
    this.course.id = this.$route.query.id
    this.getCourse()
  },
  methods: {
    formatSecond,
    getCourse() {
      let learnInfo = []
      if (this.userInfo.id) {
        courseInfo(this.course.id).then(res => {
          if (res.success && res.content.str) {
            learnInfo = res.content.str.split(' ')
            this.learnInfoText = '上次学到：第' + learnInfo[0] + '章第' + learnInfo[1] + '节'
            this.buttonText = '继续学习'
          }
        })
      }
      course(this.course.id).then(res => {
        if (res.success) {
          this.course = res.content
          if (learnInfo !== []) {
            this.course.learnInfo = learnInfo
          }
          this.course.chapters.forEach(chapter => {
            chapter.sections = []
            this.course.sections.forEach(section => {
              if (section.chapterId === chapter.id) {
                chapter.sections.push(section)
              }
            })
            chapter.sections.sort((a, b) => { return a.sort - b.sort })
          })
        }
      })
    }
  }
}
</script>
<style scoped>
/deep/ .el-page-header__content {
  color: #f8fafc;
}
.bg {
  background: #fff no-repeat;
  background-size: cover;
  -webkit-filter: blur(15px);
  -ms-filter: blur(15px);
  filter: blur(15px);
  position: absolute;
  left: 0;
  top: 0;
  height: 250px;
  width: 100%;
}
.header {
  position: relative;
  top:0;
  color: #f8fafc;
}
.course-info {
  height: 80px;
  line-height: 40px;
  font-size: 14px;
}
.course-info strong {
  margin-right: 10px;
}
.course-info li {
  float: left;
  margin-left: 80px;
}
/deep/.el-tabs__item {
  font-size: 18px;
  font-weight: bold;
}
.course-content  {
  padding: 5px 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  background-color: #f8fafc;
}
.course-wrap {
  margin-bottom: 8px;
  padding: 24px 32px 32px;
  background: #fff;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}
.related-course .title {
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.related-course .title:hover {
  overflow: visible;
  text-overflow: clip;
  white-space: 	normal;
}
.related-course .info {
  float: bottom;
  font-size: 10px;
}
</style>
