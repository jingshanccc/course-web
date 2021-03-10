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

export default { carousel, newPublish, courseList }
