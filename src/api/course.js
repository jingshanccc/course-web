import request from '@/api/request'

export function carousel() {
  return request({
    url: '/carousel-course',
    method: 'get'
  })
}

export function newPublish() {
  return request({
    url: '/new-publish',
    method: 'get'
  })
}

export function courseList(cid) {
  return request({
    url: '/course-list',
    method: 'get',
    params: { Str: cid }
  })
}

export function course(id) {
  return request({
    url: '/course',
    method: 'get',
    params: { Str: id }
  })
}

export function relatedCourse(id) {
  return request({
    url: '/related-course',
    method: 'get',
    params: { Str: id }
  })
}

export function downloadCourseContent(id) {
  return request({
    url: '/course-content',
    method: 'get',
    params: { Str: id }
  })
}

export default { carousel, newPublish, courseList, course }
