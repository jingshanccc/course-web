import request from '@/api/request'
export function allCategories() {
  return request({
    url: '/all-category',
    method: 'get'
  })
}

