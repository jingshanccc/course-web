import request from '@/api/request'

export function upload(data) {
  return request({
    url: '/user/upload',
    method: 'POST',
    data
  })
}

export function check(key) {
  return request({
    url: '/user/check',
    method: 'GET',
    params: {
      Str: key
    }
  })
}

export function uploadShard(data, onProgress = e => e, source) {
  return request({
    url: '/user/upload_shard',
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    onUploadProgress: onProgress,
    cancelToken: source.token,
    data
  })
}

export function verifyUpload(key) {
  return request({
    url: '/user/verify_upload',
    method: 'GET',
    params: {
      Str: key
    }
  })
}

export function merge(fileInfo) {
  return request({
    url: '/user/merge',
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
    url: '/file/cancel',
    method: 'GET',
    params: {
      Str: key
    }
  })
}

export default { upload, check, uploadShard, verifyUpload, merge, cancel }
