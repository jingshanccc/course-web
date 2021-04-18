<template>
  <div>
    <el-autocomplete
      v-model="searchVal"
      :fetch-suggestions="querySearch"
      placeholder="搜索你想看的课程"
      clearable
      suffix-icon="el-icon-search"
      size="medium"
      :debounce="1000"
      :style="modality"
      @select="handleSelect"
      @focus="userFocus"
      @keyup.enter.native="onSearch"
    />
  </div>
</template>
<script>
export default {
  name: 'SearchBox',
  props: {
    modality: {
      type: String,
      default: 'width: 60%'
    }
  },
  data() {
    return {
      restaurants: [],
      searchVal: ''
    }
  },
  methods: {
    querySearch(queryString, callback) {
      if (queryString) {
        callback(this.restaurants)
      } else {
        callback(this.restaurants)
      }
    },
    handleSelect(item) {

    },
    onSearch() {

    },
    userFocus() {

    }
  }
}
</script>
