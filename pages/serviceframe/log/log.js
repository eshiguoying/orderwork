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
    // 状态栏高度
    navH: App.globalData.navHeight,
    // 标题栏高度
    titlebarH: App.globalData.titlebarHeight,
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
      this.triggerEvent("closelogpanel")
    }
  },

  
})