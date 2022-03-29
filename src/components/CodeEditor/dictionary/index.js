// 图片类型
export const imageType = {
  '': '不限',
  'image/*': '图片',
  'video/*': '视频',
  'audio/*': '音频',
  '.xls,.xlsx': 'excel',
  '.doc,.docx': 'word',
  '.ppt,.pptx': 'ppt',
  '.pdf': 'pdf',
  '.txt': 'txt'
}
export function getEnumArray (name) {
  const obj = eval(name)
  const arr = []
  for (const key in obj) {
    arr.push({
      key,
      value: obj[key]
    })
  }
  return arr
}
