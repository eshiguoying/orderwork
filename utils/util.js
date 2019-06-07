const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//验证手机号码
const checkPhone = str => {
  return (/^1[34578]\d{9}$/.test(str)) && str.length >= 11
}

module.exports = {
  formatTime: formatTime,
  checkPhone: checkPhone,
}
