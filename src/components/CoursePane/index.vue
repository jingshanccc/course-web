<template>
  <el-row v-if="!isVertical && realCourses.length > 0" style="margin-top: 20px;" :gutter="20">
    <el-col v-for="course in realCourses" :key="course.id" :span="6">
      <el-card :body-style="{ padding: '0px' }" shadow="always" @click.native="courseDetail(course.id)">
        <el-image :src="course.image" fit="contain" alt="课程封面" style="border-radius: 4px; box-shadow: 0 4px 6px rgba(0, 0, 0, .12)" />
        <p class="name">{{ course.name }}</p>
        <p class="level">{{ course.level }} · {{ course.enroll ? course.enroll : 0 }}人报名</p>
        <div class="bottom">
          <span class="price">￥{{ course.price }}.00</span>
        </div>
      </el-card>
    </el-col>
  </el-row>
  <div v-else-if="isVertical && realCourses.length > 0" class="related-course" :style="styles">
    <div class="text"><strong>{{ text }}</strong></div>
    <el-row v-for="item in realCourses" v-show="item.id !== courseId" :key="item.id" :gutter="5" class="course">
      <el-col :span="9"><el-image :src="item.image" /></el-col>
      <el-col :span="15" style="display: flex; justify-content: center; flex-direction: column;">
        <span class="title" @click="courseDetail(item.id)">{{ item.name }}</span>
        <span class="info">{{ item.level }} · <i class="el-icon-user" /> {{ item.enroll ? item.enroll : 0 }}</span>
      </el-col>
    </el-row>
  </div>
  <el-card v-else style="text-align: center">
    <h2>暂无上线课程</h2>
  </el-card>
</template>
<script>
import { openHref } from '@/utils'
import { relatedCourse } from '@/api/course'

export default {
  name: 'CoursePane',
  props: {
    courses: {
      type: Array,
      default: () => { return [] }
    },
    isVertical: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: '相关课程推荐'
    },
    courseId: {
      type: String,
      required: true
    },
    styles: {
      type: Object,
      default: () => {
        return {
          borderRadius: '5px',
          boxShadow: '0 0 10px 5px rgba(0,0,0,0.1)',
          backgroundColor: '#f8fafc'
        }
      }
    }
  },
  data: () => {
    return {
      relatedCourses: []
    }
  },
  computed: {
    realCourses() {
      if (this.courseId !== '') {
        return this.relatedCourses
      } else {
        return this.courses
      }
    }
  },
  created() {
    this.getRelatedCourse()
  },
  methods: {
    courseDetail(id) {
      openHref(this.$router, 'CourseDetail', { id: id })
    },
    getRelatedCourse() {
      relatedCourse(this.courseId).then(res => {
        if (res.success) {
          this.relatedCourses = res.content.rows
        }
      })
    }
  }
}
</script>
<style scoped>
.name {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  color: #545C63;
  line-height: 20px;
  height: 40px;
  margin-bottom: 8px;
  padding: 0 8px;
}
.level {
  display: block;
  color: #9199A1;
  font-size: 12px;
  margin-bottom: 8px;
  padding: 0 8px;
}
.bottom {
  font-size: 12px;
  color: #9199A1;
  line-height: 18px;
  padding: 0 8px;
  margin-bottom: 18px;
}
.price {
  line-height: 20px;
  margin-right: 2px;
  color: #F01414;
  font-weight: bold;
}
.related-course {
  padding: 10px
}
.related-course .text {
  margin-bottom: 20px;
}
.related-course .course {
  margin-bottom: 10px;
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
  font-size: 10px;
  margin-top: 20px;
}
.related-course .title:hover ~ .info {
  display: none;
}
</style>
