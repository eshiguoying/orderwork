// // 引入SDK核心类
// var QQMapWX = require('../../thirdparty/js/qqmap-wx-jssdk.min.js');
// // 实例化API核心类
// var qqmapsdk = new QQMapWX({
//   key: 'ABBBZ-AZ5K4-LPTU2-DUZ4B-EH2UQ-AYBMF' // 必填
// });

// //数据回填方法
// function backfill (e) {
//   var id = e.currentTarget.id;
//   for (var i = 0; i < this.data.suggestion.length; i++) {
//     if (i == id) {
//       this.setData({
//         backfill: this.data.suggestion[i].title
//       });
//     }
//   }
// }

// //触发关键词输入提示事件
// function getsuggest(e) {
//   var _this = this;
//   //调用关键词提示接口
//   qqmapsdk.getSuggestion({
//     //获取输入框值并设置keyword参数
//     keyword: e.detail.value, //用户输入的关键词，可设置固定值,如keyword:'KFC'
//     region: '310000', //设置城市名，限制关键词所示的地域范围，非必填参数
//     region_fix: 1,
//     success: function (res) {//搜索成功后的回调
//       var sug = [];
//       for (var i = 0; i < res.data.length; i++) {
//         sug.push({ // 获取返回结果，放到sug数组中、
//           landmark: res.data[i].title,// 地标性建筑
//           addrdetail: res.data[i].address,// 详细地址
//           lat: res.data[i].location.lat,
//           lng: res.data[i].location.lng,
//         });
//       }
//       _this.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
//         suggestion: sug
//       });
//     }
//   });
// }

// function pitchonaddrone (param) {// 选择地址
//   // 收件信息
//   var takeaddrinfo = {};
//   takeaddrinfo.landmark = param.currentTarget.dataset.landmark;
//   takeaddrinfo.addrdetail = param.currentTarget.dataset.addrdetail;
//   takeaddrinfo.lng = param.currentTarget.dataset.lng;
//   takeaddrinfo.lat = param.currentTarget.dataset.lat;

//   this.setData({
//     selectaddrpage: false,
//     backfill: '',
//     suggestion: [{}],
//     addrcontent: param.currentTarget.dataset.landmark,
//     takeaddrinfo: takeaddrinfo
//   });

// }

// module.exports= {
//   backfill: backfill,
//   getsuggest: getsuggest,
//   pitchonaddrone: pitchonaddrone
// }

// pages/serviceframe/goldservice/goldservice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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

  },
})
