//logs.js
const util = require('../../../utils/util.js')
const request = require('../../../request')

Component ({
  data: {
    wrapperH1:0,
    grayBgStatus:false,
    grayBgShow:false,
    reportQueryShow:false,
    reportQueryStatus:false,
    showStartTime:false,
    showEndTime:false,
    s_year: '',
    s_month: '',
    s_day: '',
    e_year: '',
    e_month: '',
    e_day: '',
    startTime: '',//筛选条件，开始时间
    endTime: '',//筛选条件，开始时间
    startTimeShow: '',//筛选条件，开始时间显示
    endTimeShow: '',//筛选条件，结束时间显示
    reportArr:[],
    orderTotal:0,
    baggageTotal:0
  },

  attached: function () {
    var that = this

    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    // 获取系统信息
    wx.getSystemInfo({
      success: function (phoneRes) {
        that.setData({
          wrapperH1: phoneRes.windowHeight - 50
        })
      },
    })

    var startDate = that.calStartDate(-7)
    var s_year = startDate.getFullYear()
    var s_month = startDate.getMonth() + 1;
    if (s_month < 10) {
      s_month = '0' + s_month
    }
    var s_day = startDate.getDate();
    if (s_day < 10) {
      s_day = '0' + s_day
    }

    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if (month < 10) {
      month = '0' + month
    }
    var day = date.getDate();
    if (day < 10) {
      day = '0' + day
    }

    that.setData({
      startTime: s_year + '-' + s_month + '-' + s_day + ' 00:00:00',
      endTime: year + '-' + month + '-' + day + ' 23:59:59',
      startTimeShow: s_year + '.' + s_month + '.' + s_day,
      endTimeShow: year + '.' + month + '.' + day,
      s_year: s_year,
      s_month: s_month,
      s_day: s_day,
      e_year: year,
      e_month: month,
      e_day: day
    })

    var params = {
      beginDate: that.data.startTime,
      endDate: that.data.endTime
    }

    that.loadData(that, params)

    this.canlendar = this.selectComponent("#canlendar");
    this.canlendar.init(3);
    this.canlendar2 = this.selectComponent("#canlendar2");
    this.canlendar2.init(3);
  },

  methods:{
    stopPageScroll: function () {
      return false
    },
    //显示开始日期弹层
    showStartTime() {
      this.setData({
        showStartTime: true
      })

      this.canlendar.toViewFunc(parseInt(this.data.s_month))
    },
    //隐藏开始日期弹层
    hideStartTime() {
      this.setData({
        showStartTime: false
      })
    },
    //显示结束日期弹层
    showEndTime() {
      this.setData({
        showEndTime: true
      })

      this.canlendar2.toViewFunc(parseInt(this.data.e_month))
    },
    //隐藏结束日期弹层
    hideEndTime() {
      this.setData({
        showEndTime: false
      })
    },
    _selectDayEvent: function (e) {
      var data = e.detail.currentTarget.dataset

      this.hideStartTime()
      this.hideEndTime()

      var month = data.month < 10 ? '0' + data.month : data.month
      var day = data.day < 10 ? '0' + data.day : data.day

      if (data.type == 'start') {
        this.setData({
          startTime: data.year + '-' + month + '-' + day + ' 00:00:00',
          startTimeShow: data.year + '.' + month + '.' + day,
          s_year: data.year,
          s_month: data.month,
          s_day: data.day
        })
      }
      if (data.type == 'end') {
        this.setData({
          endTime: data.year + '-' + month + '-' + day + ' 23:59:59',
          endTimeShow: data.year + '.' + month + '.' + day,
          e_year: data.year,
          e_month: data.month,
          e_day: data.day
        })
      }
    },
    //显示筛选弹层
    showQueryLayer: function () {
      this.setData({
        grayBgShow: true,
        grayBgStatus: true,
        reportQueryShow: true,
        reportQueryStatus: true
      })
    },
    //隐藏筛选弹层
    hideQueryLayer: function () {
      var that = this
      that.setData({
        grayBgStatus: false,
        reportQueryStatus: false
      })

      setTimeout(function () {
        that.setData({
          grayBgShow: false,
          reportQueryShow: false
        })
      }, 200)
    },
    sureFunc: function () {
      if (this.data.startTime > this.data.endTime) {
        wx.showModal({
          content: '开始时间不能大于结束时间',
          confirmText: '确定',
          confirmColor: '#fbc400',
          showCancel: false
        })

        return false
      }

      var params = {
        beginDate: this.data.startTime,
        endDate: this.data.endTime
      }

      this.loadData(this, params)

      this.hideQueryLayer()
    },
    //加载数据
    loadData: function (that, params) {
      var that = this

      console.log(params)

      request.HttpRequst('/v2/order/report', 'POST', params).then(function (res) {
        console.log(res)
        wx.hideLoading();

        if (res.reports) {
          that.setData({
            reportArr: res.reports,
            baggageTotal: res.baggageTotal,
            orderTotal: res.orderTotal
          })
        }
      })
    },
    calStartDate: function (num) {
      var date = new Date()
      var date2 = new Date(date);

      date2.setDate(date.getDate() + num)
      return date2
    },
  },
  
  
})
