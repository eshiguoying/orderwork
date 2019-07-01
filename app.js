//app.js
const request = require('request');

App({
  globalData: {
    userInfo: null,
    // 默认是ios 标题栏高度 44
    titlebarHeight: 0,
    navHeight: 0,
    windowHeight: 0,
    windowWidth: 0
  },

  onLaunch: function () {
    // 获取系统登陆信息
    wx.getSystemInfo({
      success: res => {
        // 状态栏高度
        this.globalData.navHeight = res.statusBarHeight;

        // 默认是ios标题栏高度，如果系统是安卓则设置为安卓标题栏高度
        var reg = new RegExp('Android');
        var system = res.system;
        if (system.match(reg)) {
          this.globalData.titlebarHeight = 48;
        } else {
          this.globalData.titlebarHeight = 44;
        }

        // 窗口可使用高度
        this.globalData.windowHeight = res.windowHeight - this.globalData.titlebarHeight - this.globalData.navHeight;
        this.globalData.windowWidth = res.windowWidth;
      }, fail(err) {
        console.log(err);
      }
    })

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let params = { 'code': res.code };
        
        request.HttpRequst('/v2/mini-program/accredit', 'GET', params).then(res => {
          if (res.code == 400) {
            wx.hideLoading()

            wx.showModal({
              content: '您的账号被禁用，请联系管理员',
              confirmText: '确定',
              confirmColor: '#fbc400',
              showCancel: false,
              success: function (res) {
                wx.redirectTo({
                  url: '../reject/reject'
                })
              }
            })

            return false
          }
         
          // 存放openid等用户信息
          wx.setStorage({
            key: 'userInfo',
            data: {
              'openId': res.session.openid,
              'session_key': res.session.session_key,
              'token': res.token,
              'isReg': res.isReg
            }
          });

          request.header.token = res.token;
          
          // 是否已注册
          if (res.isReg) {
            // 已注册
            // 把用户信息存到缓存中
            wx.setStorage({
              key: 'accountInfo',
              data: {
                appUser: res.appUser,
                registerCode: res.registerCode
              }
            });
          }
        })
      }
    })

  }
  
  
})