const App = getApp();
// pages/feedback/feedback.js
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
    feedback:''
  },

  methods:{
    bindFeedbackInput: function (e) {
      this.setData({
        feedback: e.detail.value
      })
    },

    toFeedbackList: function () {
      var that = this;
      if (that.data.feedback.trim() == '') {
        wx.showToast({
          title: '请填写反馈内容',
          icon: 'none',
          duration: 1000
        });
        return false
      }
      var params = {
        content: that.data.feedback,
        orderid: that.properties.orderid
      }

      request.HttpRequst('/v2/order/saveFeedback', 'POST', params).then(function (res) {
        that.closefeedbackpanel();
      })
    },

    // 关闭订单反馈面板
    closefeedbackpanel() {
      this.triggerEvent("closefeedbackpanel")
    }
  },
})