const App = getApp();
// pages/record/record.js
const request = require('../../../request')

Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    order_record_list: {
      type: Array,
      value: [],
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
  },

  attached() {
    this.loadloginit();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  methods: {
    loadloginit() {
      var arr = []

      // var arry = [
      //   {
      //     operateTime: "2019-06-14 14:47:05",
      //     remark: '李爽将订单指派给李爽',
      //   },
      //   {
      //     operateTime: "2019-06-18 14:47:05",
      //     remark: "daen已指派订单",
      //   },
      //   {
      //     operateTime: "2019-06-18 18:47:05",
      //     remark: "李爽已接收订单",
      //   },
      // ];

      // for (var i = 0; i < arry.length; ++i) {
      //   var remark = arry[i].remark
      //   var operateDate = arry[i].operateTime.substring(0, 10)
      //   var operateHour = arry[i].operateTime.substring(11, 16)

      //   arr.push({
      //     remark: remark,
      //     operateDate: operateDate,
      //     operateHour: operateHour
      //   })
      // }

      // this.setData({
      //   logArr: arr
      // })

      for (var i = 0; i < this.properties.order_record_list.length; ++i) {
        var remark = this.properties.order_record_list[i].remark
        var operateDate = this.properties.order_record_list[i].operateTime.substring(0, 10)
        var operateHour = this.properties.order_record_list[i].operateTime.substring(11, 16)

        arr.push({
          remark: remark,
          operateDate: operateDate,
          operateHour: operateHour
        })
      }

      this.setData({
        logArr: arr
      })
    },

    // 关闭日志面板
    closelogpanel() {
      console.info('abcddsafasd');
      this.triggerEvent("closelogpanel")
    }
  },

  
})