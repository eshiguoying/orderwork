//logs.js
const App = getApp();
const util = require('../../../utils/util.js')
const request = require('../../../request')

Component ({
  data: {
    // 页面可用高度
    windowH: App.globalData.windowHeight,
    // 页面可用宽度
    windowW: App.globalData.windowWidth,

    reportArr:[],
    orderTotal:0,
    baggageTotal:0,

    // 零时组装请求参数
    queryorderlistReqPram: {
      startTimeShow: '',
      s_year: '',
      s_month: '',
      s_day: '',
      endTimeShow: '',
      e_year: '',
      e_month: '',
      e_day: '',
      beginDate: '',// 开始时间
      endDate: '',//结束时间
    },
    // 最终组装请求参数
    queryorderlistReqPram_official: {
      startTimeShow: '',
      s_year: '',
      s_month: '',
      s_day: '',
      endTimeShow: '',
      e_year: '',
      e_month: '',
      e_day: '',
      beginDate: '',// 开始时间
      endDate: '',//结束时间
    },
    // 是否打开筛选页面
    screenchoiceflag: false,
  },

  attached() {
    this.init_report();
  },
  

  methods:{
    // 是否跳转注册页面
    init_report() {
      var maxcirclu = 1;
      var this_ = this;

      var getToken = setInterval(function () {
        if (maxcirclu <= 100) {
          maxcirclu = maxcirclu + 1;

          if (request.header.token) {

            this_.init_screen_time();
            this_.loadReportData(this_.data.queryorderlistReqPram_official);

            clearInterval(getToken);
          }
        } else {
          wx.showToast({
            title: '未查询出订单,请尝试刷新',
            icon: 'none',
            duration: 1000
          });

          // 结束循环
          clearInterval(getToken);
          return;

        }
      }, 10)
    },

    init_screen_time() {
      var endDate = new Date();
      var startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);

      var s_year = startDate.getFullYear()
      var s_month = startDate.getMonth() + 1;
      if (s_month < 10) {
        s_month = '0' + s_month
      }
      var s_day = startDate.getDate();
      if (s_day < 10) {
        s_day = '0' + s_day
      }

      var e_year = endDate.getFullYear();
      var e_month = endDate.getMonth() + 1;
      if (e_month < 10) {
        e_month = '0' + e_month
      }
      var e_day = endDate.getDate();
      if (e_day < 10) {
        e_day = '0' + e_day
      }

      this.setData({
        ['queryorderlistReqPram.beginDate']: s_year + '-' + s_month + '-' + s_day + ' 00:00:00',
        ['queryorderlistReqPram.startTimeShow']: s_year + '.' + s_month + '.' + s_day,
        ['queryorderlistReqPram.s_year']: s_year,
        ['queryorderlistReqPram.s_month']: s_month,
        ['queryorderlistReqPram.s_day']: s_day,
        ['queryorderlistReqPram.endDate']: e_year + '-' + e_month + '-' + e_day + ' 23:59:59',
        ['queryorderlistReqPram.endTimeShow']: e_year + '.' + e_month + '.' + e_day,
        ['queryorderlistReqPram.e_year']: e_year,
        ['queryorderlistReqPram.e_month']: e_month,
        ['queryorderlistReqPram.e_day']: e_day,

        ['queryorderlistReqPram_official.beginDate']: s_year + '-' + s_month + '-' + s_day + ' 00:00:00',
        ['queryorderlistReqPram_official.startTimeShow']: s_year + '.' + s_month + '.' + s_day,
        ['queryorderlistReqPram_official.s_year']: s_year,
        ['queryorderlistReqPram_official.s_month']: s_month,
        ['queryorderlistReqPram_official.s_day']: s_day,
        ['queryorderlistReqPram_official.endDate']: e_year + '-' + e_month + '-' + e_day + ' 23:59:59',
        ['queryorderlistReqPram_official.endTimeShow']: e_year + '.' + e_month + '.' + e_day,
        ['queryorderlistReqPram_official.e_year']: e_year,
        ['queryorderlistReqPram_official.e_month']: e_month,
        ['queryorderlistReqPram_official.e_day']: e_day,
      })
    },

    //加载数据
    loadReportData(params) {
      var this_ = this

      request.HttpRequst('/v2/order/report', 'POST', params).then(function (res) {
        console.log(res)
        wx.hideLoading();
        if (res.reports) {
          this_.setData({
            reportArr: res.reports,
            baggageTotal: res.baggageTotal,
            orderTotal: res.orderTotal
          })
        }
      })
    },
    // 打开筛选接口
    screenchoice() {
      this.setData({
        screenchoiceflag: true
      });
    },

    //显示开始日期弹层
    showCanlendarPanelbut(e) {
      if (e.currentTarget.dataset.type == 'start') {
        this.setData({
          select_year: this.data.queryorderlistReqPram.s_year,
          select_month: this.data.queryorderlistReqPram.s_month,
          select_day: this.data.queryorderlistReqPram.s_day,
          timetype: e.currentTarget.dataset.type,
          showCanlendarPanelflag: true
        })
      } else {
        this.setData({
          select_year: this.data.queryorderlistReqPram.e_year,
          select_month: this.data.queryorderlistReqPram.e_month,
          select_day: this.data.queryorderlistReqPram.e_day,
          timetype: e.currentTarget.dataset.type,
          showCanlendarPanelflag: true
        })
      }
    },

    // 关闭按钮
    canlendar_cancal_but(e) {
      this.setData({
        showCanlendarPanelflag: false,
      });
    },

    // 选择日期
    _selectDayEvent: function (e) {
      var data = e.detail.currentTarget.dataset

      var month = data.month < 10 ? '0' + data.month : data.month
      var day = data.day < 10 ? '0' + data.day : data.day
      var type = data.type
      if (data.type == 'start') {
        this.setData({
          ['queryorderlistReqPram.beginDate']: data.year + '-' + month + '-' + day + ' 00:00:00',
          ['queryorderlistReqPram.startTimeShow']: data.year + '.' + month + '.' + day,
          ['queryorderlistReqPram.s_year']: data.year,
          ['queryorderlistReqPram.s_month']: data.month,
          ['queryorderlistReqPram.s_day']: data.day,
          ['queryorderlistReqPram.endDate']: data.year + '-' + month + '-' + day + ' 23:59:59',
          ['queryorderlistReqPram.endTimeShow']: data.year + '.' + month + '.' + day,
          ['queryorderlistReqPram.e_year']: data.year,
          ['queryorderlistReqPram.e_month']: data.month,
          ['queryorderlistReqPram.e_day']: data.day,
        })
      }

      if (data.type == 'end') {
        if (this.data.startTimeShow > data.year + '.' + month + '.' + day && this.data.startTimeShow != '请选择') {
          wx.showToast({
            title: '结束时间不小于开始时间',
            icon: 'none',
            duration: 2000,
          });
          return false
        }

        this.setData({
          ['queryorderlistReqPram.endDate']: data.year + '-' + month + '-' + day + ' 23:59:59',
          ['queryorderlistReqPram.endTimeShow']: data.year + '.' + month + '.' + day,
          ['queryorderlistReqPram.e_year']: data.year,
          ['queryorderlistReqPram.e_month']: data.month,
          ['queryorderlistReqPram.e_day']: data.day,
        })
      }

      this.setData({
        showCanlendarPanelflag: false,
      })
    },

    // 查询
    queryorderlist_but() {

      var reqparam = this.data.queryorderlistReqPram;
      this.setData({

        screenchoiceflag: false,
      
        ['queryorderlistReqPram_official.startTimeShow']: reqparam.startTimeShow,
        ['queryorderlistReqPram_official.s_year']: reqparam.s_year,
        ['queryorderlistReqPram_official.s_month']: reqparam.s_month,
        ['queryorderlistReqPram_official.s_day']: reqparam.s_day,
        ['queryorderlistReqPram_official.endTimeShow']: reqparam.endTimeShow,
        ['queryorderlistReqPram_official.e_year']: reqparam.e_year,
        ['queryorderlistReqPram_official.e_month']: reqparam.e_month,
        ['queryorderlistReqPram_official.e_day']: reqparam.e_day,
        ['queryorderlistReqPram_official.beginDate']: reqparam.beginDate,
        ['queryorderlistReqPram_official.endDate']: reqparam.endDate,

       
      });


      this.loadReportData(this.data.queryorderlistReqPram_official);
    },

    // 重置
    resetorderparam() {
      var restvalue = {
        startTimeShow: '',
        s_year: '',
        s_month: '',
        s_day: '',
        endTimeShow: '',
        e_year: '',
        e_month: '',
        e_day: '',
        beginDate: '',// 开始时间
        endDate: '',//结束时间
      }

      this.setData({
        queryorderlistReqPram: restvalue,
        showCanlendarPanelflag: false,
      });
    },

    cancalorderparam() {
      var reqparam = this.data.queryorderlistReqPram_official;

      this.setData({
        screenchoiceflag: false,
        showCanlendarPanelflag: false,

        ['queryorderlistReqPram.startTimeShow']: reqparam.startTimeShow,
        ['queryorderlistReqPram.s_year']: reqparam.s_year,
        ['queryorderlistReqPram.s_month']: reqparam.s_month,
        ['queryorderlistReqPram.s_day']: reqparam.s_day,
        ['queryorderlistReqPram.endTimeShow']: reqparam.endTimeShow,
        ['queryorderlistReqPram.e_year']: reqparam.e_year,
        ['queryorderlistReqPram.e_month']: reqparam.e_month,
        ['queryorderlistReqPram.e_day']: reqparam.e_day,
        ['queryorderlistReqPram.beginDate']: reqparam.beginDate,
        ['queryorderlistReqPram.endDate']: reqparam.endDate,
      })
    },

    // 刷新
    refreshtap() {
      // 弹出加载页面
      wx.showLoading();
      // 查询订单列表信息
      this.loadReportData(this.data.queryorderlistReqPram_official);
    },
  },
  
  
})
