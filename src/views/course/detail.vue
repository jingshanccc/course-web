<template>
  <div>
    <div class="bg" :style="{ backgroundImage: 'url('+ course.image + ')' }" />
    <div class="header">
      <el-page-header content="课程详情" title="首页" @back="$router.push({name: 'Course'})" />
      <h1>{{ course.name }}</h1>
      <div style="cursor: pointer; width: 200px; float: left; height: 80px" @click="teacherIndex(course.teacher.id)">
        <el-avatar :src="course.teacher.image" :size="55" style="float: left; margin-right: 10px" />
        <div class="teacher-info">
          <span style="font-size: 18px; font-weight: bold">{{ course.teacher.name }}</span>
          <span style="margin-top: 10px; font-size: 14px">{{ course.teacher.position }}</span>
        </div>
      </div>
      <ul class="course-info">
        <li><span><strong>难度</strong> {{ course.level }}</span></li>
        <li><span><strong>时长</strong> {{ formatSecond(course.time, true) }}</span></li>
        <li><span><strong>学习人数</strong> {{ course.enroll ? course.enroll : 0 }}</span></li>
        <el-button type="danger" style="float: right" round icon="el-icon-thumb" @click="startLearn">开始学习</el-button>
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
            <div v-for="chapter in course.chapters" :key="chapter.id" class="chapter course-wrap">
              <h3>第{{ chapter.sort }}章 {{ chapter.name }}</h3>
              <ul class="video">
                <li v-for="item in chapter.sections" :key="item.id" @close="startLearn(item.id)">
                  <i class="el-icon-video-play" /> {{ chapter.sort }}-{{ item.sort }} {{ item.title }} ({{ formatSecond(item.time) }})
                  <el-button type="danger" size="mini" round @click="startLearn(item.id)">开始学习</el-button>
                </li>
              </ul>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="7">
        <el-card class="related-course">
          <div slot="header">
            <strong>相关课程推荐</strong>
          </div>
          <el-row v-for="item in relatedCourses" v-show="item.id !== course.id" :key="item.id" :gutter="5">
            <el-col :span="8"><el-image :src="item.image" /></el-col>
            <el-col :span="16" class="teacher-info">
              <span class="title" @click="courseDetail(item.id)">{{ item.name }}</span>
              <span class="info">{{ item.level }} · <i class="el-icon-user" /> {{ item.enroll ? item.enroll : 0 }}</span>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { formatSecond, openHref } from '@/utils'
import { course, relatedCourse } from '@/api/course'

export default {
  name: 'CourseDetail',
  data: () => {
    return {
      course: {
        teacher: {},
        chapters: []
      },
      activeTab: 'chapter',
      relatedCourses: []
    }
  },
  created() {
    this.getCourse()
  },
  methods: {
    formatSecond,
    getCourse() {
      course(this.$route.query.id).then(res => {
        if (res.success) {
          this.course = res.content
          this.course.chapters.forEach(chapter => {
            chapter.sections = []
            this.course.sections.forEach(section => {
              if (section.chapterId === chapter.id) {
                chapter.sections.push(section)
              }
            })
            chapter.sections.sort((a, b) => { return a.sort - b.sort })
          })
          this.getRelatedCourse()
        }
      })
    },
    getRelatedCourse() {
      relatedCourse(this.course.id).then(res => {
        if (res.success) {
          this.relatedCourses = res.content.rows
        }
      })
    },
    teacherIndex(id) {
      openHref(this.$router, 'Teacher', { id: id })
    },
    startLearn(sectionId) {
      openHref(this.$router, 'Learning', { id: sectionId })
    },
    courseDetail(id) {
      openHref(this.$router, 'CourseDetail', { id: id })
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
.teacher-info {
  display: flex;
  justify-content: center;
  flex-direction: column;
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
