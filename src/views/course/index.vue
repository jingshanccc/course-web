<template>
  <div>
    <div>
      <el-image :src="AllCourse" class="all-course" />
      <div class="all-course-right">
        <el-image :src="AllCourseRight" />
      </div>
    </div>
    <div class="category">
      <div class="filter">
        <span>方向：</span>
        <el-radio-group v-model="parent" size="medium" @change="changeDirection">
          <el-radio-button v-for="item in directions" :key="item.id" :label="item.id" class="item">{{ item.name }}</el-radio-button>
        </el-radio-group>
      </div>
      <el-row v-popover:category-child class="filter">
        <span>分类：</span>
        <el-radio-group v-model="child" size="medium" @change="changeCategory">
          <el-popover
            ref="category-child"
            placement="bottom-start"
            width="950"
            trigger="hover"
            :offset="50"
            :disabled="types.length <= 10"
          >
            <el-radio-button v-for="item in types.slice(11)" :key="item.id" :label="item.id" class="item">{{ item.name }}</el-radio-button>
          </el-popover>
          <el-radio-button v-for="item in types.slice(0,10)" :key="item.id" :label="item.id" class="item">{{ item.name }}</el-radio-button>
        </el-radio-group>
      </el-row>
      <div class="filter">
        <span>难度：</span>
        <el-radio-group v-model="level" size="medium" @change="changeLevel">
          <el-radio-button v-for="item in categories.levels" :key="item.name" :label="item.name" class="item">{{ item.name }}</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div class="course">
      <el-tabs v-model="courseTab" @tab-click="handleCourseTab">
        <el-tab-pane v-for="item in ChargeEnum" :key="item" :label="item" :name="item">
          <course-pane :courses="shownCourses" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import AllCourse from '@/assets/images/all_course.png'
import AllCourseRight from '@/assets/images/all_course_right.png'
import { allCategories } from '@/api/category'
import { courseList } from '@/api/course'
import CoursePane from '@/components/CoursePane'

const CategoryDefault = {
  parent: { id: '', name: '全部' },
  child: { id: '', name: '不限' }
}
const CategoryParent = '00000000'
const LevelEnum = {
  ALL: '全部',
  PRIMARY: '初级',
  INTERMEDIATE: '中级',
  ADVANCED: '高级'
}
const ChargeEnum = {
  ALL: '全部',
  CHARGE: '付费',
  FREE: '免费'
}
export default {
  name: 'Course',
  components: {
    CoursePane
  },
  data: () => {
    return {
      AllCourse,
      AllCourseRight,
      categories: {
        parents: [CategoryDefault.parent],
        children: [CategoryDefault.child],
        levels: [{ name: LevelEnum.ALL }, { name: LevelEnum.PRIMARY }, { name: LevelEnum.INTERMEDIATE }, { name: LevelEnum.ADVANCED }]
      },
      directions: [],
      types: [],
      parent: '',
      child: '',
      level: LevelEnum.ALL,
      courseTab: ChargeEnum.ALL,
      courses: [],
      shownCourses: [],
      ChargeEnum: ChargeEnum
    }
  },
  created() {
    this.getCategories()
    this.getCourses(this.$route.query.cid)
  },
  methods: {
    getCategories() { // 获取课程分类
      allCategories().then(res => {
        if (res.success) {
          const data = res.content.rows
          data.forEach(category => {
            if (category.parent === CategoryParent) {
              category.children = []
              this.categories.parents.push(category)
              if (category.id === this.$route.query.cid) {
                this.parent = category.id
              }
            } else {
              this.categories.children.push(category)
              if (category.id === this.$route.query.cid) {
                this.children = category.id
              }
            }
          })
          this.categories.parents.forEach(p => {
            this.categories.children.forEach(child => {
              if (p.id === child.parent) {
                p.children.push(child)
              }
            })
          })
          this.directions = this.categories.parents
          this.types = this.categories.children
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    getCourses(cid) {
      courseList(cid).then(res => {
        if (res.success) {
          this.courses = res.content.rows
          this.changeLevel()
        } else {
          this.$message({
            type: 'error',
            message: res.message
          })
        }
      })
    },
    changeDirection(p) {
      this.child = CategoryDefault.child.id
      this.getCourses(p)
      if (p === '') {
        this.types = this.categories.children
        return
      }
      // 方向改变筛选其对应的分类 并将分类设置为不限 然后获取方向对应的课程
      this.types = [CategoryDefault.child]
      this.types.push(...this.categories.children.filter(({ parent }) => parent === p))
    },
    changeCategory(child) {
      // 分类改变选中其对应的方向 并获取分类对应的课程
      if (child === CategoryDefault.child.id) {
        this.getCourses(this.parent)
        return
      }
      this.parent = this.types.filter(({ id }) => id === child)[0].parent
      this.types = [CategoryDefault.child]
      this.types.push(...this.categories.children.filter(({ parent }) => parent === this.parent))
      this.getCourses(child)
    },
    changeLevel(l = this.level) {
      if (l === LevelEnum.ALL) {
        this.shownCourses = this.courses
      } else {
        this.shownCourses = this.courses.filter(({ level }) => level === l)
      }
    },
    handleCourseTab(tab) {
      if (tab.name === ChargeEnum.ALL) {
        this.shownCourses = this.courses
      } else {
        this.shownCourses = this.courses.filter(({ charge }) => charge === tab.name)
      }
    }
  }
}
</script>
<style scoped>
.wrap {

}
.all-course {
  width: 150px;
  height: 46px;
  margin-right: 8px;
}
.all-course-right {
  max-width: 103px;
  min-width: 60px;
  height: 26px;
  overflow: hidden;
  display: inline-block;
}
.category {
  padding: 20px 10px;
}
.filter {
  font-size: 16px;
  font-weight: bold;
  display: block;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  margin-bottom: 10px;
}
.item {
  margin: 5px;
}
.course {
  padding: 5px 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: white;
}
</style>
