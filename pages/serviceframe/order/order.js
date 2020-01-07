const App = getApp();
const request = require('../../../request');
const config = require('../../../config');

Component({
  
  data: {
    // 状态栏高度
    navH: App.globalData.navHeight,
    // 标题栏高度
    titlebarH: App.globalData.titlebarHeight,
    // 页面可用高度
    windowH: App.globalData.windowHeight,
    // 页面可用宽度
    windowW: App.globalData.windowWidth,
    // 登录用户信息
    accountInfo: {},

    // 订单页面
    // 零时组装请求参数
    queryorderlistReqPram: {
      orderno: '',// 订单号
      distributorname: '', // 分销商name
      distributorId: '',// 分销商id
      countername: '',// 柜台name
      counterId: '',// 柜台id
      username: '',// 订单负责人名称
      userId: '', // 用户id
      PREPAID: false,// 待分配是否选中
      WAITPICK: false,// 待提取是否被选中
      DELIVERYING: false,// 配送中是否被选中
      DELIVERYOVER: false,// 已送达是否被选中
      COMPLETED: false,// 已完成是否被选中
      statuslist: [],// 订单状态列表
      status: '',// 订单状态
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
      pageIndex: 1, // 默认第一页
      totalPage: 0,// 页面总数;
      totalCount: 0,// 订单总数
    },
    // 最终组装请求参数
    queryorderlistReqPram_official: {
      orderno: '',// 订单号
      distributorname: '', // 分销商name
      distributorId: '',// 分销商id
      countername: '',// 柜台name
      counterId: '',// 柜台id
      username: '',// 订单负责人名称
      userId: '', // 用户id
      PREPAID: false,// 待分配是否选中
      WAITPICK: false,// 待提取是否被选中
      DELIVERYING: false,// 配送中是否被选中
      DELIVERYOVER: false,// 已送达是否被选中
      COMPLETED: false,// 已完成是否被选中
      statuslist: [],// 订单状态列表
      status: '',// 订单状态
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
      pageIndex: 1, // 默认第一页
      totalPage: 0,// 页面总数;
      totalCount: 0,// 订单总数
    },
    // 是否打开筛选页面
    screenchoiceflag: false,
    // 三级分销商list
    distributorArr: [],
    // 柜台list
    counterArr: [],
    // 订单负责人list
    orderChargeArr: [],


    // 订单列表展示
    orderlist: [],
    // 选择订单按钮数据储存
    selectedorderlist: [],
    multiplechoiceflag: false,// 多选
    mulchoiceflag: false,//多选
    openshadepanel: false,// 不打开遮罩
  },

  // 组件生命周期函数-在组件实例进入页面节点树时执行
  attached() {
    this.init_order();
  },

  methods: {
    // 初始化筛选中的时间
    init_screen_time() {
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

      var date2 = new Date(date);
      date2.setDate(date.getDate() + 2);
      var e_year = date2.getFullYear();
      var e_month = date2.getMonth() + 1;
      if (e_month < 10) {
        e_month = '0' + e_month
      }
      var e_day = date2.getDate();
      if (e_day < 10) {
        e_day = '0' + e_day
      }

      this.setData({
        ['queryorderlistReqPram.beginDate']: year + '-' + month + '-' + day + ' 00:00:00',
        ['queryorderlistReqPram.startTimeShow']: year + '.' + month + '.' + day,
        ['queryorderlistReqPram.s_year']: year,
        ['queryorderlistReqPram.s_month']: month,
        ['queryorderlistReqPram.s_day']: day,
        ['queryorderlistReqPram.endDate']: e_year + '-' + e_month + '-' + e_day + ' 23:59:59',
        ['queryorderlistReqPram.endTimeShow']: e_year + '.' + e_month + '.' + e_day,
        ['queryorderlistReqPram.e_year']: e_year,
        ['queryorderlistReqPram.e_month']: e_month,
        ['queryorderlistReqPram.e_day']: e_day,

        ['queryorderlistReqPram_official.beginDate']: year + '-' + month + '-' + day + ' 00:00:00',
        ['queryorderlistReqPram_official.startTimeShow']: year + '.' + month + '.' + day,
        ['queryorderlistReqPram_official.s_year']: year,
        ['queryorderlistReqPram_official.s_month']: month,
        ['queryorderlistReqPram_official.s_day']: day,
        ['queryorderlistReqPram_official.endDate']: e_year + '-' + e_month + '-' + e_day + ' 23:59:59',
        ['queryorderlistReqPram_official.endTimeShow']: e_year + '.' + e_month + '.' + e_day,
        ['queryorderlistReqPram_official.e_year']: e_year,
        ['queryorderlistReqPram_official.e_month']: e_month,
        ['queryorderlistReqPram_official.e_day']: e_day,
      })
    },

    // 是否跳转注册页面
    init_order() {
      var maxcirclu = 1;
      var this_ = this;
      
      var getToken = setInterval(function () {
        if (maxcirclu <= 100) {
          maxcirclu = maxcirclu + 1;

          if (request.header.token) {
            // 获取当前登录用户信息
            this_.setData({
              accountInfo: wx.getStorageSync('accountInfo')
            })

            this_.init_screen_time();
            this_.loadOrderlist(this_.data.queryorderlistReqPram_official);

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

    // 加载订单列表数据
    loadOrderlist(param) {
      // 弹出加载页面
      wx.showLoading();

      var this_ = this
      request.HttpRequst('/v2/order/list', 'POST', param).then(function (res) {
        console.info(res);
        // 隐藏加载框
        wx.hideLoading();

        // 未成功加载
        if (res.code == 500) {
          this_.setData({ orderlist: [] })
          wx.showToast({
            title: '未被分配到三级分销商',
            icon: 'none',
            duration: 2000,
          });
          return false
        }
   
        if(res.code != 0) {
          wx.showToast({
            title: '加载订单失败，请刷新',
            icon: 'none',
            duration: 2000,
          });
          return false
        }

        // 未查询出数据
        if (res.result.totalPage == 0) {
          return false
        }

        var orderlist = this_.data.orderlist;

        var list = res.result.list
        for (var i = 0; i < list.length; ++i) {
          var oneItem = {
            order: {
              serviceType: list[i].order.serviceType,
              serviceTypeDesc: config.serviceType[list[i].order.serviceType].name,
              id: list[i].order.id,
              name: list[i].order.name,
              num: list[i].order.num,
              status: list[i].order.status,
              statusdesc: config.orderStatus[list[i].order.status].name,// 订单状态描述
              distributorId: list[i].order.distributorId,
              taketimepart: list[i].order.taketime.substring(5, 16),
              sendtimepart: list[i].order.sendtime.substring(5, 16),
              iscanceled: list[i].order.iscanceled,
            },
            orderAddress: {
              srcaddrtypedesc: list[i].srcType,
              srcaddress: list[i].orderAddress.srcaddress,
              srcgps: list[i].orderAddress.srcgps,
              destaddrtypedesc: list[i].destType,
              destaddress: list[i].orderAddress.destaddress,
              destgps: list[i].orderAddress.destgps,
            },
            primaryAnewAppoint: list[i].primaryAnewAppoint,
            qrList: list[i].orderQR ? list[i].orderQR.qrCode.split(',') : [],
            appUser: list[i].appUser,
            charge: list[i].appUser ? list[i].appUser.name : '未分配',
            selected: true,
          }

          orderlist.push(oneItem)
        }

      
        this_.setData({
          orderlist: orderlist,
          ["queryorderlistReqPram.pageIndex"]: this_.data.queryorderlistReqPram.pageIndex + 1,
          ["queryorderlistReqPram_official.pageIndex"]: this_.data.queryorderlistReqPram_official.pageIndex + 1,
          ["queryorderlistReqPram.totalPage"]: res.result.totalPage,
          ["queryorderlistReqPram.totalCount"]: res.result.totalCount,
          ["queryorderlistReqPram_official.totalPage"]: res.result.totalPage,
          ["queryorderlistReqPram_official.totalCount"]: res.result.totalCount,
        })

      })
    },

    // 地址导航
    toNavSend: function (e) {
      var name = e.currentTarget.dataset.name
      var gps = JSON.parse(e.currentTarget.dataset.gps.replace(/\'/g, "\""))

      wx.openLocation({//​使用微信内置地图查看位置。
        latitude: Number(gps.lat),//要去的纬度-地址
        longitude: Number(gps.lng),//要去的经度-地址
        name: name,
        address: name
      })
    },

    // 根据筛选条件，刷新订单列表
    refreshtap() {
      // 刷新订单列表的目标：携带筛选条件重新查询一边,并且页数回到第一页
      this.setData({
        allloadflag: false,
        orderlist: [],
        ['queryorderlistReqPram.pageIndex']: 1,
        ['queryorderlistReqPram_official.pageIndex']: 1,
        ['queryorderlistReqPram.totalPage']: 0,
        ['queryorderlistReqPram.totalCount']: 0,
        ['queryorderlistReqPram_official.totalPage']: 0,
        ['queryorderlistReqPram_official.totalCount']: 0,
      });
      // 查询订单列表信息
      this.loadOrderlist(this.data.queryorderlistReqPram_official);
    },

    // 打开筛选接口
    screenchoice() {
      var this_ = this;

      if (this_.data.accountInfo.appUser.level == config.levelType.HIGH.value) {
        //三级分销商接口 高级
        request.HttpRequst('/v2/distributor/ownerList', 'GET', {}).then(function (res) {
          if (res.code == config.resCode.success.value) {
            this_.setData({
              distributorArr: res.list
            });
          }
        })

        // 订单负责人接口 高级
        var params = {
          distributorId: this_.data.accountInfo.appUser.distributor2nd,
          isvalid: 'Y'
        }
        request.HttpRequst('/v2/app-user/list', 'POST', params).then(function (res) {
          if (res.code == config.resCode.success.value) {
            this_.setData({
              orderChargeArr: res.data
            })
          }
        })
      }

      //柜台服务中心接口参数 TODO 高级不应该查询出所有的柜台信息嘛？
      if (this_.data.accountInfo.appUser.distributor3rd) {
        var counterParams = this_.data.accountInfo.appUser.distributor3rd
        request.HttpRequst('/v2/counter/listByDistributor', 'POST', counterParams).then(function (res) {
          if (res.code == config.resCode.success.value) {
            this_.setData({
              counterArr: res.counters
            })
          }
        })
      }

      //订单负责人接口 中级
      if (this_.data.accountInfo.appUser.level != config.levelType.LOW.value) {
        var params = {
          distributorId: this_.data.accountInfo.appUser.distributor3rd,
        }
        request.HttpRequst('/v2/app-user/select', 'GET', params).then(function (res) {
          if (res.code == config.resCode.success.value) {
            this_.setData({
              orderChargeArr: res.data
            })
          }
        })
      }

      this_.setData({
        screenchoiceflag: true
      });
    },

    // 取消筛选面板编辑
    cancalorderparam() {
      var reqparam = this.data.queryorderlistReqPram_official;

      this.setData({
        screenchoiceflag: false,
        showCanlendarPanelflag: false,
        ['queryorderlistReqPram.orderno']: reqparam.orderno,
        ['queryorderlistReqPram.distributorname']: reqparam.distributorname,
        ['queryorderlistReqPram.distributorId']: reqparam.distributorId,
        ['queryorderlistReqPram.countername']: reqparam.countername,
        ['queryorderlistReqPram.counterId']: reqparam.counterId,
        ['queryorderlistReqPram.username']: reqparam.username,
        ['queryorderlistReqPram.userId']: reqparam.userId,

        ['queryorderlistReqPram.PREPAID']: reqparam.PREPAID,
        ['queryorderlistReqPram.WAITPICK']: reqparam.WAITPICK,
        ['queryorderlistReqPram.DELIVERYING']: reqparam.DELIVERYING,
        ['queryorderlistReqPram.DELIVERYOVER']: reqparam.DELIVERYOVER,
        ['queryorderlistReqPram.COMPLETED']: reqparam.COMPLETED,
        ['queryorderlistReqPram.statuslist']: reqparam.statuslist,
        ['queryorderlistReqPram.status']: reqparam.status,

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

        ['queryorderlistReqPram.pageIndex']: reqparam.pageIndex,
        ['queryorderlistReqPram.totalPage']: reqparam.totalPage,
        ['queryorderlistReqPram.totalCount']: reqparam.totalCount,
      })
    },

    // 重置筛选条件
    resetorderparam() {
      var restvalue = {
        orderno: '',// 订单号
        distributorname: '', // 分销商name
        distributorId: '',// 分销商id
        countername: '',// 柜台name
        counterId: '',// 柜台id
        username: '',// 订单负责人名称
        userId: '', // 用户id
        PREPAID: false,// 待分配是否选中
        WAITPICK: false,// 待提取是否被选中
        DELIVERYING: false,// 配送中是否被选中
        DELIVERYOVER: false,// 已送达是否被选中
        COMPLETED: false,// 已完成是否被选中
        statuslist: [],// 订单状态列表
        status: '',// 订单状态
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
        pageIndex: 1, // 默认第一页
        totalPage: 0,// 订单总数 
        totalCount: 0 //订单总数
      }

      this.setData({
        queryorderlistReqPram: restvalue,
        showCanlendarPanelflag: false,
      });
    },

    // 根据筛选条件查询订单列表
    queryorderlist_but() {
      var reqparam = this.data.queryorderlistReqPram;
      this.setData({
        allloadflag: false,
        orderlist: [],
        screenchoiceflag: false,
        showCanlendarPanelflag: false,

        ['queryorderlistReqPram_official.orderno']: reqparam.orderno,
        ['queryorderlistReqPram_official.distributorname']: reqparam.distributorname,
        ['queryorderlistReqPram_official.distributorId']: reqparam.distributorId,
        ['queryorderlistReqPram_official.countername']: reqparam.countername,
        ['queryorderlistReqPram_official.counterId']: reqparam.counterId,
        ['queryorderlistReqPram_official.username']: reqparam.username,
        ['queryorderlistReqPram_official.userId']: reqparam.userId,

        ['queryorderlistReqPram_official.PREPAID']: reqparam.PREPAID,
        ['queryorderlistReqPram_official.WAITPICK']: reqparam.WAITPICK,
        ['queryorderlistReqPram_official.DELIVERYING']: reqparam.DELIVERYING,
        ['queryorderlistReqPram_official.DELIVERYOVER']: reqparam.DELIVERYOVER,
        ['queryorderlistReqPram_official.COMPLETED']: reqparam.COMPLETED,
        ['queryorderlistReqPram_official.statuslist']: reqparam.statuslist,
        ['queryorderlistReqPram_official.status']: reqparam.status,

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

        ['queryorderlistReqPram_official.pageIndex']: 1,
        ['queryorderlistReqPram_official.totalPage']: 0,
        ['queryorderlistReqPram_official.totalCount']: 0,
      });


      this.loadOrderlist(this.data.queryorderlistReqPram_official);
    },
    
    // 下拉加载数据;
    bindDownLoad: function () {
      if (this.data.queryorderlistReqPram_official.pageIndex > this.data.queryorderlistReqPram_official.totalPage) {
        this.setData({
          allloadflag: true,
        });
        return false
      } 

      this.loadOrderlist(this.data.queryorderlistReqPram_official)
    },

    // 是否多选
    tomutlchoice() {
      if(this.data.orderlist.length == 0) {
        wx.showToast({
          title: '暂无订单',
          icon: 'none',
          duration: 2000,
        });
        return;
      }

      this.setData({
        multiplechoiceflag: true
      });
    },

    // 取消多选
    mutlchoice_cancal() {
      var orderlist = this.data.orderlist;
      for (var i = 0; i < orderlist.length; i++) {
        orderlist[i].selected = true;
      }

      this.setData({
        selectedorderlist: [],
        multiplechoiceflag: false,
        orderlist: orderlist,
        mulchoiceflag: false,
      });
    },

    // 多选
    mulchoiceflag() {
      var mulchoiceflag = this.data.mulchoiceflag;
      var orderlist = this.data.orderlist;

      if (!mulchoiceflag && this.data.queryorderlistReqPram_official.totalCount > orderlist.length) {
        wx.showToast({
          title: '请下拉加载全部订单，再点击全选',
          icon: 'none',
          duration: 3000,
        });
        return false
      }

      var selectedorderlist = [];
      
      if (mulchoiceflag) {
        // 取消全选
        for (var i = 0; i < orderlist.length; i++) {
          orderlist[i].selected = mulchoiceflag;
        }
      } else {
        // 点击全选
        for (var i = 0; i < orderlist.length; i++) {
          // 退单中的信息无法选择 TODO
          if (orderlist[i].order.iscanceled == '1' || orderlist[i].order.status == config.orderStatus.REFUNDING.value) {
            continue;
          }

          orderlist[i].selected = mulchoiceflag;
          selectedorderlist.push(orderlist[i]);
        }
      }

      this.setData({
        selectedorderlist: selectedorderlist,
        orderlist: orderlist,
        mulchoiceflag: !this.data.mulchoiceflag
      });
    },

    // 单选
    picthupone(e) {
      // 退单中的信息无法选择
      var orderinfo = this.data.orderlist[e.currentTarget.dataset.index];
      // TODO
      if (orderinfo.order.iscanceled == '1' || orderinfo.order.status == config.orderStatus.REFUNDING.value) {
        wx.showToast({
          title: '正在退单中',
          icon: 'none',
          duration: 1000
        });
        return;
      }

      orderinfo.selected = !orderinfo.selected;

      var selectedorderlist = this.data.selectedorderlist;
      if (orderinfo.selected) {
        selectedorderlist.splice(e.currentTarget.dataset.index, 1);
      } else {
        selectedorderlist[e.currentTarget.dataset.index] = orderinfo;
      }

      this.setData({
        selectedorderlist: selectedorderlist,
        ["orderlist[" + e.currentTarget.dataset.index + "].selected"]: orderinfo.selected,
      });

    },

    // 点击批量改派
    batchchangesendtap() {
      var this_ = this;
      if (this.data.selectedorderlist.length == 0) {
        wx.showToast({
          title: '未选择订单',
          icon: 'none',
          duration: 2000,
        });
        return;
      }

      var selectedorderlist = this.data.selectedorderlist;
  
      var selectedorder = undefined;
      for (var i = 0; i < selectedorderlist.length; ++i) {
        if (!selectedorderlist[i]) {
          continue;
        }
        if (!selectedorder) {
          selectedorder = selectedorderlist[i]
        }

        // 此校验属于一级二级批量指派或改派下的情况
        if (selectedorder.order.distributorId != selectedorderlist[i].order.distributorId) {
          wx.showModal({
            content: '所选订单不属于同一分销商',
            confirmText: '确定',
            confirmColor: '#fbc400',
            showCancel: false
          })
          return false
        }

        // 当级别是3级时，
        if(this.data.accountInfo.appUser.level == 3) {
          if (
            selectedorderlist[i].order.status == config.orderStatus.COMPLETED.value  
            || selectedorderlist[i].order.status != config.orderStatus.DELIVERYOVER.value
            || selectedorderlist[i].orderAddress.destaddrtype == 'HOUSE'
            || selectedorderlist[i].orderAddress.destaddrtype == 'HOTEL') {
            // 3级只能改派一次（TODO 订单列表只能）
            wx.showToast({
              title: '某些订单号不能改派',
              icon: 'none',
              duration: 2000,
            });
            return;
          }
        }

      }
     
      // 未选择订单
      if (!selectedorder) {
        wx.showToast({
          title: '未选择订单',
          icon: 'none',
          duration: 2000,
        });
        return;
      }

      this.setData({
        distributor3rd: selectedorder.order.distributorId,
        isshowstafflistpanel:true
      });
    },

    // 关闭工作人员列表
    closestafflistpanel() {
      this.setData({
        isshowstafflistpanel: false
      });
    },

    // 选择工作人员后指派/改派回调
    sure_changeallow_staff(e) {
      // 弹出加载页面
      wx.showLoading();

      var staffid = e.detail.id;
    
      var this_ = this
      var non_appoint_orderid_list = ''
      var appoint_orderid_list = ''

      // 选中待改派的订单
      var selectedorderlist = this.data.selectedorderlist;
      for (var i = 0; i < selectedorderlist.length; ++i) {
        if (selectedorderlist[i]) {
          if (selectedorderlist[i].appUser) {
            // 待 改派的订单号
            appoint_orderid_list += selectedorderlist[i].order.id + ','
          } else {
            // 待 指派的订单号
            non_appoint_orderid_list += selectedorderlist[i].order.id + ','
          }
        }
      }

      if (non_appoint_orderid_list != '' && appoint_orderid_list == '') {
        var params = {
          userId: e.detail.id,
          orderIds: non_appoint_orderid_list.substring(0, non_appoint_orderid_list.length - 1)
        }
        request.HttpRequst('/v2/order/appoint', 'POST', params).then(function (res) {
          console.info(res);
          // 隐藏加载框
          wx.hideLoading();

          if (res.code == 0) {
            var selectedorderlist = this_.data.selectedorderlist;
            var orderlist = this_.data.orderlist;
            for (var i = 0; i < selectedorderlist.length; i++) {
              if (selectedorderlist[i]) {
                this_.setData({
                  ['orderlist[' + i + '].order.status']: orderlist[i].order.status == config.orderStatus.PREPAID.value ? config.orderStatus.WAITPICK.value : orderlist[i].order.status,
                  ['orderlist[' + i + '].order.statusdesc']: orderlist[i].order.status == config.orderStatus.PREPAID.value ? config.orderStatus.WAITPICK.name : orderlist[i].order.statusdesc,
                  ['orderlist[' + i + '].charge']: e.detail.name,
                  ['orderlist[' + i + '].appUser']: e.detail,
                  ['orderlist[' + i + '].selected']: true,
                })
              }
            }

          } else {
            wx.showToast({
              title: '改派未成功',
              icon: 'none',
              duration: 2000,
            });
            return false
          }

        })
      } else if (non_appoint_orderid_list == '' && appoint_orderid_list != '') {
        var new_params = {
          userId: e.detail.id,
          orderIds: appoint_orderid_list.substring(0, appoint_orderid_list.length - 1)
        }
        request.HttpRequst('/v2/order/anewAppoint', 'POST', new_params).then(function (res) {
          console.info(res);
          // 隐藏加载框
          wx.hideLoading();

          if (res.code == 0) {
            if (this_.data.accountInfo.appUser.level != 3) {
              // 1.2级别改派，
              var selectedorderlist = this_.data.selectedorderlist;
              var orderlist = this_.data.orderlist;
              for (var i = 0; i < selectedorderlist.length; i++) {
                if (selectedorderlist[i]) {
                  this_.setData({
                    ['orderlist[' + i + '].charge']: e.detail.name,
                    ['orderlist[' + i + '].appUser']: e.detail,
                    ['orderlist[' + i + '].selected']: true,
                  })
                }
              }
            } else {
              // 改派需要刷新订单
              this_.setData({
                allloadflag: false,
                orderlist: []
              });
              this_.loadOrderlist(this_.data.queryorderlistReqPram_official);
            }

            
          } else {
            wx.showToast({
              title: '改派未成功',
              icon: 'none',
              duration: 2000,
            });
            return false
          }
        })
      } else {
        var params = {
          userId: e.detail.id,
          orderIds: non_appoint_orderid_list.substring(0, non_appoint_orderid_list.length - 1)
        }
        request.HttpRequst('/v2/order/appoint', 'POST', params).then(function (res) {
          // 隐藏加载框
          wx.hideLoading();

          if (res.code == 0) {
            var new_params = {
              userId: e.detail.id,
              orderIds: appoint_orderid_list.substring(0, appoint_orderid_list.length - 1)
            }
            request.HttpRequst('/v2/order/anewAppoint', 'POST', new_params).then(function (res) {
              if (res.code == 0) {
                if (this_.data.accountInfo.appUser.level != 3) {
                  console.info(res);
                  var selectedorderlist = this_.data.selectedorderlist;
                  var orderlist = this_.data.orderlist;
                  for (var i = 0; i < selectedorderlist.length; i++) {
                    if (selectedorderlist[i]) {
                      this_.setData({
                        ['orderlist[' + i + '].order.status']: orderlist[i].order.status == config.orderStatus.PREPAID.value ? config.orderStatus.WAITPICK.value : orderlist[i].order.status,
                        ['orderlist[' + i + '].order.statusdesc']: orderlist[i].order.status == config.orderStatus.PREPAID.value ? config.orderStatus.WAITPICK.name : orderlist[i].order.statusdesc,
                        ['orderlist[' + i + '].charge']: e.detail.name,
                        ['orderlist[' + i + '].appUser']: e.detail,
                        ['orderlist[' + i + '].selected']: true,
                      })
                    }
                  }
                } 
              } else {
                // 部分更新
                var updateOrderidlist = non_appoint_orderid_list.split(',');
                var selectedorderlist = this_.data.selectedorderlist;
                for(var a = 0; a<updateOrderidlist.length; a++) {
                  for(var b= 0; b< selectedorderlist.length; b++) {
                    if (selectedorderlist[b] && selectedorderlist[b].order.id == updateOrderidlist[a]) {
                      this_.setData({
                        ['orderlist[' + b + '].order.status']: orderlist[b].order.status == config.orderStatus.PREPAID.value ? config.orderStatus.WAITPICK.value : orderlist[b].order.status,
                        ['orderlist[' + b + '].order.statusdesc']: orderlist[b].order.status == config.orderStatus.PREPAID.value ? config.orderStatus.WAITPICK.name : orderlist[b].order.statusdesc,
                        ['orderlist[' + b + '].charge']: e.detail.name,
                        ['orderlist[' + b + '].appUser']: e.detail,
                        ['orderlist[' + b + '].selected']: true,
                      })
                    }
                  }
                }

                wx.showToast({
                  title: '部分改派未成功',
                  icon: 'none',
                  duration: 2000,
                });
                return false
              }
            })
          } else {
            wx.showToast({
              title: '部分指派未成功',
              icon: 'none',
              duration: 2000,
            });
            return false
          }
         
        })
      }
    },

    //批量修改订单状态，运用场景
    updateOrderStatus: function () {
      var this_ = this;
      
      var selectedorderlist =  this.data.selectedorderlist;
      if (selectedorderlist.length == 0) {
        wx.showToast({
          title: '未选择订单',
          icon: 'none',
          duration: 2000,
        });
        return;
      }

      var orderIdStr = ''
      var selectedorder = undefined;
      for (var i = 0; i < selectedorderlist.length; ++i) {
        if (!selectedorderlist[i]) {
          continue;
        }

        // 待分配订单
        if (selectedorderlist[i].order.status == config.orderStatus.PREPAID.value) {
          wx.showToast({
            title: '无法操作,所选订单中有' + config.orderStatus.PREPAID.name + "订单",
            icon: 'none',
            duration: 2000,
          });
          return false
        }

        // 待提取 -> 配送中  qr码必须扫描完成
        if (selectedorderlist[i].qrList.length != selectedorderlist[i].order.num) {
          wx.showToast({
            title: 'qr码未扫描完成',
            icon: 'none',
            duration: 2000,
          });
          return false
        }


        // 已完成订单无需操作
        if (selectedorderlist[i].order.status == config.orderStatus.COMPLETED.value) {
          wx.showToast({
            title: '无法操作,所选订单中有' + config.orderStatus.COMPLETED.name + '订单',
            icon: 'none',
            duration: 2000,
          });
          return false
        }

        // 退款中的订单暂时无法操作 TODO
        if (selectedorderlist[i].order.iscanceled == '1' || selectedorderlist[i].order.status == config.orderStatus.REFUNDING.value) {
          wx.showToast({
            title: '无法操作,所选订单中有' + config.orderStatus.REFUNDING.name + '订单',
            icon: 'none',
            duration: 2000,
          });
          return false
        }

        // if (this.data.selectArr[0].appUser.name != that.data.accountInfo.appUser.name) {
        //   wx.showModal({
        //     content: '对不起,所选订单包含他人订单,您没有权限进行操作',
        //     confirmText: '确定',
        //     confirmColor: '#fbc400',
        //     showCancel: false,
        //   })

        //   return false
        // }

        if (!selectedorder) {
          selectedorder = selectedorderlist[i]
        }

        // 订单是否所属同一级分销商
        if (selectedorder.order.distributorId != selectedorderlist[i].order.distributorId) {
          wx.showToast({
            title: '所选订单不属于同一分销商',
            icon: 'none',
            duration: 2000,
          });
          return false
        }

        if (selectedorder.order.status != selectedorderlist[i].order.status) {
          wx.showModal({
            content: '所选订单状态不一致',
            confirmText: '确定',
            confirmColor: '#fbc400',
            showCancel: false
          })

          return false
        }


        orderIdStr += this.data.selectArr[k].order.id + ','
      }

      // 未选择订单
      if (!selectedorder) {
        wx.showToast({
          title: '未选择订单',
          icon: 'none',
          duration: 2000,
        });
        return;
      }
      
      // 订单下个状态
      var nextOrderStatus = '';
      // 订单做的操作
      var updateOrderStatus = ''
      if (selectedorder.order.status == config.orderStatus.WAITPICK.value) {
        nextOrderStatus = config.orderStatus.DELIVERYING.value;
        updateOrderStatus = config.orderOperateType.RECEIVE.value;
      } else if (selectedorder.order.status == config.orderStatus.DELIVERYING.value) {
        nextOrderStatus = config.orderStatus.DELIVERYOVER.value;
        updateOrderStatus = config.orderOperateType.DELIVERY.value;
      } else if (selectedorder.order.status == config.orderStatus.DELIVERYOVER.value) {
        nextOrderStatus = config.orderStatus.COMPLETED.value;
        updateOrderStatus = config.orderOperateType.FINISH.value;
      }

      wx.showModal({
        content: '确认修改订单状态为' + config.orderStatus[nextOrderStatus].name + '吗？',
        confirmText: '确定',
        confirmColor: '#fbc400',
        cancelText: '取消',
        cancelColor: '#fbc400',
        success: function (response) {
          if (response.confirm) {
            var params = {
              operateType: updateOrderStatus,
              orderId: orderIdStr.substring(0, orderIdStr.length - 1)
            }
            request.HttpRequst('/v2/order/operate', 'POST', params).then(function (res) {
              if(res.code == config.resCode.success.value) {
                for(var i=0; i< this_.data.selectedorderlist.length; i++) {
                  this_.setData({
                    ['orderlist[' + i + '].order.status']: nextOrderStatus,
                    ['orderlist[' + i + '].order.statusdesc']: config.orderStatus[nextOrderStatus].name
                  })
                }
              }
            })
          }
        }
      })
    },
  

    orderno_input(e) {
      this.setData({
        ['queryorderlistReqPram.orderno']: e.detail.value
      });
      console.info(this.data.queryorderlistReqPram);
      console.info(this.data.queryorderlistReqPram_official);
    },

    // 取消选择改派人员列表
    cancal_changeorder() {
      // 取派人员框消失
      this.setData({
        openshadepanel: false,
        staffselect: '-1',
        staffinfolist: [],
      });
    },

    showtrileveldistribution() {
      this.setData({
        isviewtrileveldistri: true,
      });
    },


    //选择三级分销商
    selectDistributor: function (e) {
      var that = this
      that.setData({
        isviewtrileveldistri: false,
        ['queryorderlistReqPram.distributorname']: e.currentTarget.dataset.name,
        ['queryorderlistReqPram.distributorId']: e.currentTarget.dataset.id,
        ['queryorderlistReqPram.countername']: '',
        ['queryorderlistReqPram.counterId']: '',
        isviewtrileveldistri: false,
      })

      //柜台服务中心接口参数 高级
      if (that.data.accountInfo.appUser.level == 1) {
        if (that.data.queryorderlistReqPram.distributorId == -1) {
          return false
        }

        var counterParams = that.data.queryorderlistReqPram.distributorId

        request.HttpRequst('/v2/counter/listByDistributor', 'POST', counterParams).then(function (res) {
          that.setData({
            counterArr: res.counters
          })
        })
      }
    },

    showcounterbody() {
      this.setData({
        isviewcounter: true,
      });
    },

    //选择柜台服务中心
    selectCounter: function (e) {
      this.setData({
        ['queryorderlistReqPram.countername']: e.currentTarget.dataset.name,
        ['queryorderlistReqPram.counterId']: e.currentTarget.dataset.id,
        isviewcounter: false,
      })
    },

    showofficerbody() {
      if (this.data.orderChargeArr.length == 0) {
        wx.showToast({
          title: '暂无订单负责人',
          icon: 'none',
          duration: 2000,
        });
        return;
      }

      this.setData({
        isviewofficerbody: true,
      });
    },

    //选择柜台服务中心
    selectOrderCharge: function (e) {
      this.setData({
        ['queryorderlistReqPram.username']: e.currentTarget.dataset.name,
        ['queryorderlistReqPram.userId']: e.currentTarget.dataset.id,
        isviewofficerbody: false,
      })
    },

    checkTap: function (e) {
      var code = e.currentTarget.dataset.code
      var statuslist = this.data.queryorderlistReqPram.statuslist;
      if (!this.data.queryorderlistReqPram[code]) {
        // 选中
        statuslist.push(code);
      } else {
        // 去除
        statuslist.splice(statuslist.indexOf(code), 1);
      }

      this.setData({
        ['queryorderlistReqPram.statuslist']: statuslist,
        ['queryorderlistReqPram.' + code]: !this.data.queryorderlistReqPram[code],
        ['queryorderlistReqPram.status']: statuslist.join(",")
      });

    },

    //显示开始日期弹层
    showCanlendarPanelbut(e) {
      if(e.currentTarget.dataset.type == 'start') {
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

    // 关闭时间选择按钮
    canlendar_cancal_but() {
      this.setData({
        showCanlendarPanelflag: false,
      })
    },

    // 筛选选择日期后回调
    _selectDayEventselectDayEvent: function (e) {
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

      this.canlendar_cancal_but();
    },


    // 加载订单详情
    loadorderdetails(e) {
      this.setData({
        orderdetailsByorderid: e.currentTarget.dataset.id,
        orderdetailshowflag: true,
        orderIndex: e.currentTarget.dataset.index
      });
    },

    closeorderdetailsbut() {
      this.setData({
        orderdetailshowflag: false
      });
    },

    // 筛选条件，清空
    deletequeryparam(e) {
      if(e.currentTarget.dataset.type == 'simple') {
        this.setData({
          ['queryorderlistReqPram.' + e.currentTarget.dataset.key]: ''
        });
      } else if (e.currentTarget.dataset.type == 'complex') {
        this.setData({
          ['queryorderlistReqPram.' + e.currentTarget.dataset.key + 'Id']: '',
          ['queryorderlistReqPram.' + e.currentTarget.dataset.key + 'name']: '',
        });
      } else {
        if (e.currentTarget.dataset.key == 'startTimeShow') {
          this.setData({
            ['queryorderlistReqPram.startTimeShow']: '',
            ['queryorderlistReqPram.s_year']: '',
            ['queryorderlistReqPram.s_month']: '',
            ['queryorderlistReqPram.s_day']: '',
            ['queryorderlistReqPram.beginDate']: '',
          });
        } else {
          this.setData({
            ['queryorderlistReqPram.endTimeShow']: '',
            ['queryorderlistReqPram.e_year']: '',
            ['queryorderlistReqPram.e_month']: '',
            ['queryorderlistReqPram.e_day']: '',
            ['queryorderlistReqPram.endDate']: '',
          });
        }
      }
      
    },

    // 关闭订单详情
    _closeorderdetailpanel() {
      this.setData({
        orderdetailshowflag: false
      });
    },

    // 订单详情做指派操作后
  _orderdetailappoint(e) {
    var orderdetail = this.data.orderlist[e.detail.index];
      this.setData({
        ['orderlist[' + e.detail.index + '].order.status']: orderdetail.order.status == config.orderStatus.PREPAID.value ? config.orderStatus.WAITPICK.value : orderdetail.order.status,
        ['orderlist[' + e.detail.index + '].order.statusdesc']: orderdetail.order.status == config.orderStatus.PREPAID.value ? config.orderStatus.WAITPICK.name : orderdetail.order.statusdesc,
        ['orderlist[' + e.detail.index + '].charge']: e.detail.staff.name,
        ['orderlist[' + e.detail.index + '].appUser']: e.detail.staff,
      })
    },

    
  },
  
  
  
  
})