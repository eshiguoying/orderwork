const App = getApp();
// pages/record/record.js
const request = require('../../../request')

Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    orderid: {
      type: String,
      value: "",
    }
  },

  /**
   * 页面的初始数据
   */
  data: {
    // 页面可用高度
    windowH: App.globalData.windowHeight,
    // 页面可用宽度
    windowW: App.globalData.windowWidth,
    logArr:[],
    noData:false
  },

  attached() {
    this.loadloginit();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  methods: {
    loadloginit() {
      var that = this

      wx.showLoading({
        title: '加载中...',
        mask: true
      });
      
      request.HttpRequst('/v2/order/loglist', 'GET', { orderId: that.properties.orderid}).then(function (res) {
        wx.hideLoading();
        console.log(res)

        if (res.list.length == 0) {
          that.setData({
            noData: true
          })

          return false
        }
        var arr = []
        for (var i = 0; i < res.list.length; ++i) {
          var remark = res.list[i].remark
          var operateDate = res.list[i].operateTime.substring(0, 10)
          var operateHour = res.list[i].operateTime.substring(11, 16)

          arr.push({
            remark: remark,
            operateDate: operateDate,
            operateHour: operateHour
          })
        }

        that.setData({
          logArr: arr
        })
      })
    },

    // 关闭日志面板
    closelogpanel() {
      this.triggerEvent("closelogpanel")
    }
  },

  
})