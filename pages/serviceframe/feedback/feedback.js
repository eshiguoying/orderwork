// pages/feedback/feedback.js
const request = require('../../../request')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:'',
    feedback:''
  },

  bindFeedbackInput:function(e){
    this.setData({
      feedback: e.detail.value
    })
  },

  toFeedbackList:function(){
    var that = this
    if (that.data.feedback.trim() == ''){
      wx.showModal({
        content: '反馈内容不能为空',
        confirmText: '确定',
        confirmColor: '#fbc400',
        showCancel: false,
      })

      return false
    }
    var params = {
      content: that.data.feedback,
      orderid: that.data.orderId
    }

    request.HttpRequst('/v2/order/saveFeedback', 'POST', params).then(function (res) {
      console.log(res)
      wx.navigateTo({
        url: '../feedbackList/feedbackList',
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    that.setData({
      orderId: wx.getStorageSync('curOrder').order.id
    })
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