<template>
  <div>
    <div class="header">
      <el-col :sm="9">
        <div>
          <el-button style="float: left; margin-left: 5px" size="mini" @click="rearrange"><i class="el-icon-view el-icon--left" />换一批</el-button>
          <el-button style="float: right" size="mini" @click="toCourseList">全部<i class="el-icon-top-right el-icon--left" /> </el-button>
        </div>
        <tag-cloud ref="category" :list="categories" :size="18" @click-tag="toCourseList" />
      </el-col>
      <el-col :sm="15">
        <!-- 轮播图 -->
        <el-carousel style="margin-left: 5px; border-radius: 0.8%">
          <el-carousel-item v-for="item in carouselCourse" :key="item.id" @click.native="$refs.coursePane.courseDetail(item.id)">
            <el-image alt="封面" :src="item.image" style="width: 100%; height: 350px;" />
          </el-carousel-item>
        </el-carousel>
      </el-col>
    </div>
    <img class="title" :src="title" alt="新上好课">
    <course-pane ref="coursePane" :courses="newPublishCourse" :course-id="''" />
  </div>
</template>
<script>
import TagCloud from '@/components/TagCloud'
import CoursePane from '@/components/CoursePane'
import { allCategories } from '@/api/category'
import courseApi from '@/api/course'
import Title from '@/assets/images/title.png'
export default {
  name: 'Home',
  components: {
    TagCloud,
    CoursePane
  },
  data() {
    return {
      categories: [],
      title: Title,
      carouselCourse: [],
      newPublishCourse: []
    }
  },
  created() {
    this.getCategories()
    this.getCarouselCourse()
    this.getNewPublishCourse()
  },
  methods: {
    getCarouselCourse() {
      courseApi.carousel().then(res => {
        if (res.success) {
          this.carouselCourse = res.content.rows
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    getNewPublishCourse() {
      courseApi.newPublish().then(res => {
        if (res.success) {
          this.newPublishCourse = res.content.rows
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    getCategories() { // 获取课程分类
      allCategories().then(res => {
        if (res.success) {
          this.categories = res.content.rows
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    rearrange() {
      if (this.$refs.category) {
        this.$refs.category.rearrange()
      }
    },
    toCourseList(categoryId) {
      const base = 'course/list'
      const path = typeof categoryId === 'string' ? base + '?cid=' + categoryId : base
      const routeData = this.$router.resolve({ path: path })
      window.open(routeData.href, '_blank')
    }
  }
}
</script>

<style scoped>
.header {
  background-color: aliceblue;
  text-align: center;
  height: 350px;
  padding-top: 40px;
  border-radius: 0.5%;
  box-shadow: 0 0 10px 5px rgba(0,0,0,0.1);
}
.title {
  display: block;
  font-weight: 700;
  height: 34px;
  text-decoration: none;
  color: #333;
  margin-top: 15px;
}
</style>
