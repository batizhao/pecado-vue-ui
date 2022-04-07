export function analysisUrl (url, row) {
  // 匹配花括号中的属性名,如果值里面还有花括号就继续匹配
  const reg = /{[^{}]+}/g
  let count = 0 // 限制解析次数，防止死循环
  const recursion = () => {
    const result = url.match(reg)
    if (result) {
      result.map(res => {
        url = url.replace(res, row[res.match(/{(.+)}/)[1]])
      })
      count ++
    }
    if (url.match(reg) && count < 5) {
      recursion()
    }
  }
  recursion()
  return url
}