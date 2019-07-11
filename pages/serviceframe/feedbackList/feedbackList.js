const App = getApp();
// pages/feedbackList/feedbackList.js
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
    feedbackArr:[],
    noData:false
  },
  
  attached() {
    this.loadfeedbackList();
  },
 
  methods: {
    loadfeedbackList() {
      var that = this

      wx.showLoading({
        title: '加载中...',
        mask: true
      });


      request.HttpRequst('/v2/order/feedbacklist', 'GET', { orderId: that.properties.orderid}).then(function (res) {
        wx.hideLoading();
        console.log(res)
        if (res.list.length == 0) {
          that.setData({
            noData: true
          })

          return false
        }

        that.setData({
          feedbackArr: res.list
        })
      })
    },

    // 反馈页面打开
    toFeedback: function () {
      this.setData({
        orderid: this.properties.orderid,
        isshowfeedback: true
      });
    },

    // 反馈页面关闭
    closefeedbackpanel() {
      this.setData({
        isshowfeedback: false
      });
      this.loadfeedbackList();
    }
    
  },

})