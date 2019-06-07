// pages/login/login.js
const App = getApp();
const util = require('../../utils/util');
const request = require('../../request');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 状态栏高度
    navH: App.globalData.navHeight,
    // 标题栏高度
    titlebarH: App.globalData.titlebarHeight,
    // 页面可用高度
    windowH: App.globalData.windowHeight,
    // 页面可用宽度
    windowW: App.globalData.windowWidth,
    
    // 用户名
    userName: '',
    // 手机号
    phoneNum: '',
    // 验证码
    verifyCode: '',
    // 注册码
    registerNum: '',
    // 验证秘钥
    verifyKey: '',
    // 短信文字
    sendMsg: '发送'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.randomBColor();
  },

  // 发送验证码
  sendSMS() {
    if (this.data.sendMsg == '发送' || this.data.sendMsg == '重新发送') {

      if (this.data.phoneNum.trim() == '') {
        wx.showModal({
          content: '请输入手机号!',
          confirmText: '确定',
          confirmColor: '#fbc400',
          showCancel: false,
        });
        return false
      }

      // 验证手机号
      if (!util.checkPhone(this.data.phoneNum)) {
        wx.showModal({
          content: '请填写正确的手机号',
          confirmText: '确定',
          confirmColor: '#fbc400',
          showCancel: false
        })
        return false
      }

      let time = 60
      let sendInterval = setInterval(() => {
        if (time <= 0) {
          clearInterval(sendInterval)
          this.setData({
            sendMsg: '重新发送'
          })
        } else {
          this.setData({
            sendMsg: time + 's'
          })
        }
        time--;
      }, 1000)
      let codeParam = {
        mobile: this.data.phoneNum,
        smsCode: 'A100'
      }
      request.HttpRequst('/v2/sms/send', 'POST', codeParam).then(res => {
        // console.log(res)
        this.setData({
          verifyKey: res.verifyKey
        })
      })
    }
  },

  bindUserNameInput(e) {
    this.setData({
      userName: e.detail.value
    })
  },
  bindPhoneNumInput(e) {
    this.setData({
      phoneNum: e.detail.value
    })
  },
  bindVerifyCodeInput(e) {
    this.setData({
      verifyCode: e.detail.value
    })
  },
  bindRegisterNumInput(e) {
    this.setData({
      registerNum: e.detail.value
    })
  },

  // 注册
  registerBtn: function () {
    // 验证
    // 用户名不能为空
    if (this.data.userName.trim() == '') {
      wx.showModal({
        content: '请输入用户名',
        confirmText: '确定',
        confirmColor: '#fbc400',
        showCancel: false,
      });
      return false
    }
    if (this.data.phoneNum.trim() == '') {
      wx.showModal({
        content: '请输入手机号',
        confirmText: '确定',
        confirmColor: '#fbc400',
        showCancel: false,
      });
      return false
    }
    // 验证手机号
    if (!util.checkPhone(this.data.phoneNum)) {
      wx.showModal({
        content: '请填写正确的手机号',
        confirmText: '确定',
        confirmColor: '#fbc400',
        showCancel: false
      })
      return false
    }
    if (this.data.verifyCode.trim() == '') {
      wx.showModal({
        content: '请输入验证码',
        confirmText: '确定',
        confirmColor: '#fbc400',
        showCancel: false
      })
      return false
    }
    if (this.data.registerNum.trim() == '') {
      wx.showModal({
        content: '请输入注册码',
        confirmText: '确定',
        confirmColor: '#fbc400',
        showCancel: false
      })
      return false
    }
    // 验证验证码
    let verify = {
      verifyCode: this.data.verifyCode,
      verifyKey: this.data.verifyKey
    }
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    request.HttpRequst('/v2/sms/verify', 'POST', verify).then(res => {
      wx.hideLoading();
      if (res.code != 0) {
        wx.showModal({
          content: '验证码错误',
          confirmText: '确定',
          confirmColor: '#fbc400',
          showCancel: false
        })
        return false
      } else {
        // 注册
        let params = {
          "mobile": this.data.phoneNum,
          "name": this.data.userName,
          "openid": wx.getStorageSync('userInfo').openId,
          "registerCode": this.data.registerNum,
        }
        console.log(params)
        // 注册接口
        request.HttpRequst('/v2/app-user/register?verifyToken=' + res.verifyToken, 'POST', params).then(res => {
          console.log(res)
          wx.hideLoading();
          if (res.code != 0) {
            wx.showModal({
              content: '注册失败，请稍后再试',
              confirmText: '确定',
              confirmColor: '#fbc400',
              showCancel: false
            })
            return false
          } else {
            wx.showToast({
              title: '注册成功',
              icon: 'success',
              duration: 1500,
              mask: true,
            })

            wx.setStorage({
              key: 'accountInfo',
              data: {
                appUser: res.appUser,
                registerCode: res.registerCode
              }
            });

            setTimeout(() => {
              let tempInfo = wx.getStorageSync('userInfo')
              wx.setStorage({
                key: 'userInfo',
                data: {
                  'openId': tempInfo.openid,
                  'session_key': tempInfo.session_key,
                  'token': tempInfo.token,
                  'isReg': true
                }
              });
              wx.redirectTo({
                url: '../serviceframe/serviceframe'
              })
            }, 1000)
          }
        })
      }
    })
  },

  
})