<template>
  <div :style="type" @click="teacherIndex(teacher.id)">
    <el-avatar :src="teacher.image" :size="55" style="float: left; margin-right: 10px" />
    <div class="teacher-info">
      <span style="font-size: 18px; font-weight: bold">{{ teacher.name }}</span>
      <span style="margin-top: 10px; font-size: 14px">{{ teacher.position }}</span>
    </div>
  </div>
</template>
<script>
import { openHref } from '@/utils'

export default {
  name: 'TeacherInfo',
  props: {
    type: {
      type: Object,
      default: () => {}
    },
    teacher: {
      type: Object,
      required: true
    }
  },
  methods: {
    teacherIndex(id) {
      openHref(this.$router, 'Teacher', { id: id })
    }
  }
}
</script>
<style scoped>
.teacher-info {
  display: flex;
  justify-content: center;
  flex-direction: column;
}
</style>

