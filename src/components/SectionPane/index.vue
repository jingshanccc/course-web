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
  </div>
</template>
<script>
import { formatSecond, openHref } from '@/utils'

export default {
  name: 'SectionPane',
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
  methods: {
    formatSecond,
    /**
     * @param c chapter 下标
     * @param s section 下标
     */
    startLearn(c, s = 0) {
      if (typeof c === 'object') {
        c = 0
      }
      const data = { course: this.course, chapter: c, section: s, randomCode: new Date().getTime() }
      openHref(this.$router, 'Learning', data, false)
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
