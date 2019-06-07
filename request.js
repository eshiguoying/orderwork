// TODO 封装 wx.request

// const utilMd5 = require('utils/md5.js')
const config = require('config')
let header = {
  'Accept': 'application/json;',
  'content-type': 'application/json;',
  'token': null,
}

function HttpRequst(url, methods, params, callBack) {
  // 默认显示加载动画
  let loading = true

  // 接口类型
  const method = methods

  // 加载动画
  if (loading == true) {
    // wx.showToast({
    //   title: '数据加载中',
    //   icon: 'loading'
    // })
  }

  let postData = params

  return new Promise((resolve, reject) => {
    wx.request({
      url: config.ipconfig + url,
      data: postData,
      header: header,
      method: method,
      success: (res) => {
        resolve(res.data);
      },
      fail: (res) => {
        reject(res)
      }
    })
  })
};

module.exports = {
  HttpRequst: HttpRequst,
  header: header
}
