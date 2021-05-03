import request from '@/api/request'
const api = process.env.VUE_APP_BASE_API + 'file'
export function upload(data) {
  return request({
    baseURL: api,
    url: '/upload',
    method: 'POST',
    data
  })
}

export function check(key) {
  return request({
    baseURL: api,
    url: '/check',
    method: 'GET',
    params: {
      Str: key
    }
  })
}

export function uploadShard(data, onProgress = e => e, source) {
  return request({
    baseURL: api,
    url: '/upload_shard',
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    onUploadProgress: onProgress,
    cancelToken: source.token,
    data
  })
}

export function verifyUpload(key) {
  return request({
    baseURL: api,
    url: '/verify_upload',
    method: 'GET',
    params: {
      Str: key
    }
  })
}

export function merge(fileInfo) {
  return request({
    baseURL: api,
    url: '/merge',
    method: 'POST',
    data: {
      Name: fileInfo.name,
      Key: fileInfo.key,
      Suffix: fileInfo.suffix,
      ShardTotal: fileInfo.shardTotal,
      Size: fileInfo.size
    }
  })
}

export function cancel(key) {
  return request({
    baseURL: api,
    url: '/cancel',
    method: 'GET',
    params: {
      Str: key
    }
  })
}

export default { upload, check, uploadShard, verifyUpload, merge, cancel }
