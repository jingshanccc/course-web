<template>
  <el-row v-if="courses.length > 0" style="margin-top: 20px;" :gutter="20">
    <el-col v-for="course in courses" :key="course.id" :span="6">
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
  <el-card v-else style="text-align: center">
    <h2>暂无上线课程</h2>
  </el-card>
</template>
<script>
export default {
  name: 'CoursePane',
  props: {
    courses: {
      type: Array,
      default: () => { return [] }
    }
  },
  methods: {
    courseDetail(id) {
      const routeData = this.$router.resolve({
        name: 'CourseDetail',
        query: {
          id: id
        }
      })
      window.open(routeData.href, '_blank')
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
</style>
