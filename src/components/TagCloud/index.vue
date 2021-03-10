<template>
  <div class="wrap">
    <el-button v-for="data in tags" :key="data.tag.id" class="tags" :style="{ fontSize: data.size, backgroundColor: data.color }" round @click="$emit('click-tag', data.tag.id)">
      {{ data.tag.name }}
    </el-button>
  </div>
</template>
<script>
import util from './util'

export default {
  name: 'TagCloud',
  props: {
    list: {
      type: Array,
      required: true,
      default: () => { return [] }
    },
    size: {
      type: Number,
      required: true
    },
    clickTag: {
      type: Function,
      default: () => {}
    }
  },
  computed: {
    tags() {
      return this.getRandomTags().splice(0, this.size).map(tag => {
        return {
          tag: tag,
          color: this.setColor(),
          size: this.setSize(tag.name)
        }
      })
    }
  },
  methods: {
    setSize(name) {
      const re = /[^\u4E00-\u9FA5]/
      if (re.test(name) || name.length < 5) {
        // 英文或者中文字数少于5个字
        return '15px'
      } else {
        return '14px'
      }
      // return util.randomSize(14, 1) + 'px'
    },
    setColor() {
      return util.randomColor()
    },
    getRandomTags() {
      return this.list.sort(() => { // 重新随机排序
        return Math.random() > 0.5 ? -1 : 1
      }).concat()
    },
    rearrange() { // 重新随机排序
      this.list.sort(function(a, b) {
        return Math.random() > 0.5 ? -1 : 1
      })
    }
  }
}
</script>
<style scoped>
.wrap {
  text-align: center;
  word-break: break-word;
}

.tags{
  font-size: 24px;
  color: #ffffff;
  margin:5px;
  display: inline-block;
  font-family: 'Georgia','楷体','楷体_GB2312',sans-serif;
}
</style>
