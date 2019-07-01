const App = getApp();

const request = require('../../request');
const config = require('../../config');
// const addrselect = require('addrselect/addrselect');
// // 高德地图引用
const amapFile = require('../../thirdparty/js/amap-wx.js');

Page({
  data : {
    // 状态栏高度
    navH: App.globalData.navHeight,
    // 标题栏高度
    titlebarH: App.globalData.titlebarHeight,
    // 页面可用高度
    windowH: App.globalData.windowHeight,
    // 页面可用宽度
    windowW: App.globalData.windowWidth,
    
    // 点击三条杠是否打开左侧弹出框
    open: false,
    // 默认登陆页面是 => 金牌配送
    servicename: 'order',

    
  },

  // 页面加载进入的时候
  onLoad: function (options) {
    this.is_register();
  },

  // 是否跳转注册页面
  is_register() {
    var this_ = this;
    var getToken = setInterval(function () {
      if (request.header.token && wx.getStorageSync('userInfo')) {
        // 判断是否需要注册
        if (!wx.getStorageSync('userInfo').isReg) {
          clearInterval(getToken);
          // 跳转到注册页
          wx.redirectTo({
            url: '../login/login'
          })
          return false
        }
        clearInterval(getToken);
      }
    }, 10)
  },


  // 点击菜单加载按钮，左侧菜单弹出或收回
  navBack() {
    if (this.data.open) {
      this.setData({
        open: false
      });
    } else {
      this.setData({
        open: true
      });
    }
  },

  // 点击遮罩层listbar收回
  cancallistbar () {
    this.setData({
      open: false
    });
  },

  // 菜单栏选择菜单
  servicetap: function (param) {
    this.setData({
      open: false,
      servicename: param.currentTarget.dataset.service
    });
  }
})



