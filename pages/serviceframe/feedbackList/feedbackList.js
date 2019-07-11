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
    orderId:'',
    feedbackArr:[],
    noData:false
  },
  
  toFeedback:function(){
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this

    wx.showLoading({
      title: '加载中...',
      mask: true
    });

    that.setData({
      orderId: wx.getStorageSync('curOrder').order.id
    })
    var params = {
      orderId:that.data.orderId
    }
    
    request.HttpRequst('/v2/order/feedbacklist', 'GET', params).then(function (res) {
      wx.hideLoading();
      console.log(res)
      if (res.list.length == 0) {
        that.setData({
          noData: true
        })

        return false
      }

      that.setData({
        feedbackArr:res.list
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})