const App = getApp();

const request = require('../../request');
const config = require('../../config');
// const addrselect = require('addrselect/addrselect');
// // 高德地图引用
const amapFile = require('../../thirdparty/js/amap-wx.js');


Page({
  data : {
    // 状态栏高度
    navH: App.globalData.navHeight,
    // 标题栏高度
    titlebarH: App.globalData.titlebarHeight,
    // 页面可用高度
    windowH: App.globalData.windowHeight,
    // 页面可用宽度
    windowW: App.globalData.windowWidth,
    
    // 点击三条杠是否打开左侧弹出框
    open: false,
    // 默认登陆页面是 => 金牌配送
    servicename: 'order',

    // 订单页面
    // 选择订单按钮数据储存
    selectedorderlist:[],
    queryorderlistReqPram:{
      counterId: '',// 柜台id
      distributorId: '',// 分销商id
      beginDate: '',// 开始时间
      endDate: '',//结束时间
      orderno: '',// 订单号
      status: '',// 订单状态
      userId: '', // 用户id
      pageIndex: 1 // 默认第一页
    },
    // 订单列表展示
    orderlist:[],
    totalPage: 0,// 页面总数;
    multiplechoiceflag:false,// 多选
    mulchoiceflag: false,//多选
    openshadepanel:false,// 不打开遮罩
    staffinfolist: [],//更改取派员列表
    staffid:'',// 选中的取派员id
    staffinfo: {},


    // 寄间类型滑块
    sliding: {
      'sendaddrinfo': 'sendaddrinfo_hotel',
      'takeaddrinfo': 'takeaddrinfo_hotel'
    },

    selectaddrpage: false,// 地址选择页面是否开启 true 开启 false不开启，默认不开启
    suggestion: [{}],// 地址列表
    addrnode: '',// 地址选择标志
    isselect_addr:false,// 地址搜索是否不可用 false 是可用

    // 地址类型决定 时间范围
    sendtimebyaddrtype: {
      'hotel': {
        starttime: 7,
        endtime: 18
      },
      'residence': {
        starttime: 9,
        endtime: 18
      },
      'airport': {
        starttime: 9,
        endtime: 22
      }
    },

    // 寄件时间容器
    multiArray: [], 
    // 初始化寄件时间显示下标
    multiIndex: [0, 0, 0],
    // 第一天的小时列表
    firstdayhourlist_send: [],
    // 除第一天的小时列表
    otherdayhourlist_send: [],
    // 最后一天的小时列表
    lastday_hourlist_send: [],
    // 第一天的第一个小时的分钟列表
    firstdayminlist_send: [],
    // 除第一天的第一个小时的分钟列表
    otherminlist: ['00', '30'],
    // 最后一天的最后一个小时的分钟列表
    lastday_lasthour_minlist: ['00'],
    // 寄件事件原型
    sendtime: '加载中......',

    // 地址类型决定 时间范围
    taketimebyaddrtype: {
      'hotel': {
        starttime: 7,
        endtime: 23
      },
      'residence': {
        starttime: 9,
        endtime: 23
      },
      'airport': {
        starttime: 9,
        endtime: 22
      }
    },
  
    // 收件时间内容
    multiArray_take: [],
    // 默认收件收件时间下标
    multiIndex_take: [0, 0, 0],
    firstdayhourslist_take: [],
    otherdayhourslist_take: [],
    firstdayminlist_take: [],
    otherminlist_take: ['00', '30'],
    taketime: '加载中......',

    // 是否加急
    isurgent: false,

    // 客户信息
    cusname: '',
    cusphone: '',
    cusidno: '',

    // 是否投保
    isinsured: false,
    // 保价比例
    lugvalue: '',
    // 保费比例
    insured_scale:0.1,
    // 行李价值上线
    lugvaluemax:20000,
    // 保费
    prem:0,

    // 行李数量
    lugnum: 1,
    lugnummax:10,

    // 行李照片列表
    lugphotolist: [],

    // 行李br前缀
    lugbrprefix: 'JPQR',
    // 行李 br 码的数量
    lugbrlist: [],
    // 是否查看qr
    isviewbr:false,

    // 总价格
    totalmoney: 0,

    // 登录用户信息
    accountInfo : {},

    // 价格
    goldserviceprice: {

    },

    // 行李价格明细表
    ispricedetailpage: false,

    // 下单地址模型
    ordermaininfo: {
      'sendaddrinfo': {
        cityname: '',
        citycode: '',
        //默认地址类型 => 酒店
        addrtype: 'hotel', 
        landmark: '',
        address: '',
        location: '',
        doornum: '',
        time: ''
       },
      'takeaddrinfo': {
        cityname: '',
        citycode: '',
        //默认地址类型 => 酒店
        addrtype: 'hotel', 
        landmark: '',
        address: '',
        location: '',
        doornum: '',
        time: ''
      }
    },
  },

  // 页面加载进入的时候
  onLoad: function (options) {
    this.is_register();
  },

  // 是否跳转注册页面
  is_register() {
    var this_ = this;
    var getToken = setInterval(function () {
      if (request.header.token && wx.getStorageSync('userInfo')) {
        // 判断是否需要注册
        if (!wx.getStorageSync('userInfo').isReg) {
          clearInterval(getToken);
          // 跳转到注册页
          wx.redirectTo({
            url: '../login/login'
          })
          return false
        }
        clearInterval(getToken);
        // 获取当前登录用户信息
        this_.setData({
          accountInfo: wx.getStorageSync('accountInfo')
        })

        // 根据页面选择情况加载相关数据
        this_.loaddatabyservicetype();

        
      }
    }, 10)
  },

// 根据页面选择情况加载相关数据
  loaddatabyservicetype() {
    if (this.data.servicename == 'order') {
      // 订单信息,加载订单列表
      this.loadOrderlist();
    } else {
      // 授权地理位置信息
      this_.getCurrCity();
      // 寄件时间
      this_.sendDate();
      // 收件时间
      this_.taketime();
    }
  },

  // 用户位置权限设置
  
  // 高德地图识别当前城市信息
  getCurrCity() {
    var this_ = this;
    // 通过高德地图api把经纬度转换为城市
    const myAmapFun = new amapFile.AMapWX({ key: config.map.key });
    myAmapFun.getRegeo({
      success: data => {
        let cityName = data[0].regeocodeData.addressComponent.city;
        
        if (cityName == '') {
          cityName = data[0].regeocodeData.addressComponent.province
        }

        const temp_ = data[0].regeocodeData.addressComponent.adcode;
        var citycode = temp_.substring(0, 4) + '00';
        
        this.setData({
          ['ordermaininfo.sendaddrinfo.cityname']: cityName,
          ['ordermaininfo.sendaddrinfo.citycode']: citycode,
          ['ordermaininfo.takeaddrinfo.cityname']: cityName,
          ['ordermaininfo.takeaddrinfo.citycode']: citycode,
        });
      }
    })
  },


  // 点击菜单加载按钮，左侧菜单弹出或收回
  navBack() {
    if (this.data.open) {
      this.setData({
        open: false
      });
    } else {
      this.setData({
        open: true
      });
    }
  },

  // 点击遮罩层listbar收回
  cancallistbar () {
    this.setData({
      open: false
    });
  },

  // 菜单栏选择菜单
  servicetap: function (param) {
    this.setData({
      open: false,
      servicename: param.currentTarget.dataset.service
    });
  },

  // 寄送地址类型
  selectaddrtype(param) {
    var ordermaininfo = this.data.ordermaininfo;
    var addrnode = param.currentTarget.dataset.addrnode;
    var addrtype = param.currentTarget.dataset.addrtype;
    if (ordermaininfo[addrnode].addrtype != addrtype) {
      this.setData({
        ['ordermaininfo.' + addrnode + '.addrtype']: addrtype,
        ['ordermaininfo.' + addrnode + '.landmark']: '',
        ['ordermaininfo.' + addrnode + '.address']: '',
        ['ordermaininfo.' + addrnode + '.location']: '',
        ['sliding.' + addrnode]: addrnode + '_' + addrtype,
      });
    }

    // 寄收件时间
    var this_ = this;
    'sendaddrinfo' == addrnode ? this_.sendDate() : this_.taketime(); 
  },


  //柜台服务中心接口参数 根据城市id查询柜台信息
  loadcounter(cityid) {
    var this_ = this;
    if (this.data.accountInfo.appUser.distributor3rd) {
      var counterParams = this.data.accountInfo.appUser.distributor3rd

      request.HttpRequst('/v2/counter/listByDistributor', 'POST', counterParams).then(function (res) {
        var sug = [];
        for (var i = 0; i < res.counters.length; i++) {
          sug.push({ 
            landmark: res.counters[i].servicecentername,// 地标性建筑
            address: res.counters[i].address,// 详细地址
            location: res.counters[i].gps.lng + ',' + res.counters[i].gps.lat
          });
        }
        this_.setData({
         suggestion: sug,
         isselect_addr: true,
        })
      })
    }
  },

  // 加载地址栏
  loadaddrselect(e) {
    this.setData({
      selectaddrpage: true,
      addrnode: e.currentTarget.dataset.addrnode,
      city_: this.data.ordermaininfo[e.currentTarget.dataset.addrnode].cityname
    });

    // 柜台加载
    if ('airport' == this.data.ordermaininfo[e.currentTarget.dataset.addrnode].addrtype) {
      this.loadcounter(this.data.ordermaininfo[e.currentTarget.dataset.addrnode].citycode);
    }
  },

  // 取消地址
  cancleaddrselepage() {
    this.setData({
      selectaddrpage: false,
      isselect_addr: false,
      suggestion: [{}],
      addrnode: '',
      addrinput_: '',
    });
  },

  //触发关键词输入提示事件
  getsuggest(e) {
    var _this = this;
    var keywords = e.detail.value;
    // 通过高德地图api获取搜索列表
    const myAmapFun = new amapFile.AMapWX({ key: config.map.key });
    myAmapFun.getInputtips({
      keywords: keywords,
      citylimit: true,
      city: _this.data.ordermaininfo[_this.data.addrnode].citycode,
      success: data => {
        if (data && data.tips) {
          // 处理高亮字符
          let datas = data.tips
          var sug = [];
          for (var i = 0; i < datas.length; i++) {
            sug.push({ // 获取返回结果，放到sug数组中、
              landmark: datas[i].name,// 地标性建筑
              address: datas[i].district + datas[i].address,// 详细地址
              location: datas[i].location,
            });
          }

          _this.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
            suggestion: sug
          });
        }
      }
    })
  },

  // 选择地址回填
  pitchonaddrone: function (e) {// 选择地址
    var ordermaininfo = this.data.ordermaininfo
    ordermaininfo[this.data.addrnode].landmark = e.currentTarget.dataset.landmark;
    ordermaininfo[this.data.addrnode].address = e.currentTarget.dataset.address;
    ordermaininfo[this.data.addrnode].location = e.currentTarget.dataset.location;

    this.setData({
      selectaddrpage: false,
      isselect_addr: false,
      suggestion: [{}],
      addrnode: '',
      addrinput_: '',
      ordermaininfo: ordermaininfo
    })
  },

  // 门牌号
  doornuminput(e) {
    this.setData({
      ['ordermaininfo.' + e.currentTarget.dataset.addrnode + '.doornum']: e.detail.value
    });
  },

  // 寄件时间
  sendDate() {
    function addZone(num) {
      return num < 10 ? ('0' + num) : num;
    }

    // 营业结束开始
    var starttime = this.data.sendtimebyaddrtype[this.data.ordermaininfo.sendaddrinfo.addrtype].starttime;
    // 营业结束时间
    var endtime = this.data.sendtimebyaddrtype[this.data.ordermaininfo.sendaddrinfo.addrtype].endtime;
    // 最后一天
    var later_day = 18;
    // 时间范围14天
    var scopetime = 14;

    // date list
    var datelist_send = [];
    // first day hour list
    var firstdayhourlist_send = [];
    // ohter day hours list
    var otherdayhourlist_send = [];
    // last day hours list
    var lastday_hourlist_send = [];
    // first day min list
    var firstdayminlist_send = ['00','30'];

    // today
    var toDay = new Date();

    if (toDay.getHours() < starttime) {
      // 未到开始营业时间

      firstdayhourlist_send = this.calcu_hour_list(starttime, endtime);
    } else if (starttime <= toDay.getHours() <= endtime) {
      // 在营业范围内

      if (toDay.getMinutes() < 30) {
        // 小于30分钟
        firstdayminlist_send = ['30'];
        firstdayhourlist_send = this.calcu_hour_list(toDay.getHours(), endtime);
      } else {
        // 大于三十分钟
        if (toDay.getHours() + 1 > endtime) {
          toDay.setDate(toDay.getDate() + 1);
          scopetime = scopetime - 1;
          firstdayhourlist_send = this.calcu_hour_list(starttime, endtime);
        } else {
          toDay.setHours(toDay.getHours() + 1);
          firstdayhourlist_send = this.calcu_hour_list(toDay.getHours(), endtime);
        }

      }
    } else {
      // 超出营业范围
      toDay.setDate(toDay.getDate() + 1);
      console.info(toDay);
      scopetime = scopetime - 1;
      firstdayhourlist_send = this.calcu_hour_list(starttime, endtime);
    }
    
    // 计算 scopetime 范围内的日期
    var thisyear = toDay.getFullYear();// 今天是那一年
    var thismonth = toDay.getMonth() + 1;// 今天是几月
    var thisday = toDay.getDate();
    datelist_send.push(thisyear + '-' + addZone(thismonth) + '-' + addZone(thisday));
    for (var i = 1; i < scopetime; i++) {
      toDay.setDate(toDay.getDate() + 1);
      var thisyear = toDay.getFullYear();// 今天是那一年
      var thismonth = toDay.getMonth() + 1;// 今天是几月
      var thisday = toDay.getDate();
      datelist_send.push(thisyear + '-' + addZone(thismonth) + '-' + addZone(thisday));
    }

    var multiArray = [];
    multiArray.push(datelist_send);
    multiArray.push(firstdayhourlist_send);
    multiArray.push(firstdayminlist_send);

    // other day hour list =>
    otherdayhourlist_send = this.calcu_hour_list(starttime, endtime);
    // last day hour list => calcu，
    lastday_hourlist_send = this.calcu_hour_list(starttime, later_day);
    
    this.setData({
      multiArray: multiArray,
      firstdayhourlist_send: firstdayhourlist_send,
      otherdayhourlist_send: otherdayhourlist_send,
      firstdayminlist_send: firstdayminlist_send,
      lastday_hourlist_send: lastday_hourlist_send,
      sendtime: multiArray[0][0] + ' ' + multiArray[1][0] + ':' + multiArray[2][0]
    });
  },

  // 计算 时间
  calcu_hour_list(start, end) {
    function addZone(num) {
      return num < 10 ? ('0' + num) : num;
    }

    var list=[];
    for (var i = start; i <= end; i++) {
      list.push(addZone(i));
    }
    
    return list;
  },

  bindMultiPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var multiArray = this.data.multiArray;
    var multiIndex = this.data.multiIndex;
    this.setData({
      multiIndex: e.detail.value,
      ['ordermaininfo.sendaddrinfo.time']: multiArray[0][multiIndex[0]] + ' ' + multiArray[1][multiIndex[1]] + ':' + multiArray[2][multiIndex[2]]
    });

    // 计算收件时间
    this.taketime();
  },

  bindMultiPickerColumnChange(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value)
    const data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    }
    data.multiIndex[e.detail.column] = e.detail.value

    var datelaterindex = data.multiArray[0].length - 1;
    var timelaterindex = data.multiArray[1].length - 1;

    switch (e.detail.column) {
      case 0:
        switch (e.detail.value) {
          case 0:
            data.multiArray[1] = this.data.firstdayhourlist_send;
            data.multiArray[2] = this.data.firstdayminlist_send;
            break;
          case datelaterindex:
            data.multiArray[1] = this.data.lastday_hourlist_send;
            data.multiArray[2] = this.data.otherminlist;
            break;
          default:
            data.multiArray[1] = this.data.otherdayhourlist_send;
            data.multiArray[2] = this.data.otherminlist;
            break;
        }
        break;
      case 1:
        switch (e.detail.value) {
          case 0:
            data.multiArray[2] = (this.data.multiIndex[0] == 0) ? this.data.firstdayminlist_send : this.data.otherminlist;
            break;
          case timelaterindex:
            data.multiArray[2] = (this.data.multiIndex[0] == datelaterindex) ? this.data.lastday_lasthour_minlist : this.data.otherminlist;
            break;
          default:
            data.multiArray[2] = this.data.otherminlist;
            break;
        }
        break;
    }

    this.setData(data)
  },

  // 收件时间
  taketime() {
    function addZone(num) {
      return num < 10 ? ('0' + num) : num;
    }

    // 寄件时间和收件时间间隔 h 为单位
    var sT_differ_tT = 4;
    // 时间范围14天
    var scopetime = 14;
    // 营业结束开始
    var starttime = this.data.taketimebyaddrtype[this.data.ordermaininfo.takeaddrinfo.addrtype].starttime;
    // 营业结束时间
    var endtime = this.data.taketimebyaddrtype[this.data.ordermaininfo.takeaddrinfo.addrtype].endtime;

    // 日期
    var datelist_take = [];
    var firstdayhourslist_take = [];
    var otherdayhourslist_take = [];
    var firstdayminlist_take = ['00', '30'];;

    // 计算最大间隔天数天后的日期
    var curdate = new Date();
    var addscopetime_late = curdate.setDate(curdate.getDate() + scopetime);
    // 根据寄件地址计算收件时间初始值
    var sendtime_temp = this.data.ordermaininfo.sendaddrinfo.time
    if (this.data.ordermaininfo.sendaddrinfo.time == '') {
      var multiArray = this.data.multiArray;
      var multiIndex = this.data.multiIndex;
      sendtime_temp = multiArray[0][multiIndex[0]] + " " + multiArray[1][multiIndex[1]] + ":" + multiArray[2][multiIndex[2]];
    }
    var takedate = new Date(sendtime_temp);
    takedate.setHours(takedate.getHours() + sT_differ_tT);

    // 可以选择的最后一天和收件时间初始值的天差
    var days = parseInt(Math.abs(addscopetime_late - takedate) / 1000 / 60 / 60 / 24); //把差的毫秒数转换为天数  

    // 第一天的小时间隔 and 第一天的分钟间隔
    if (takedate.getHours() < starttime) {
      firstdayhourslist_take = this.calcu_hour_list(starttime, endtime);
    } else if (starttime <= takedate.getHours() <= endtime) {
      if (takedate.getMinutes() < 30) {
        firstdayminlist_take = ['30'];
        firstdayhourslist_take = this.calcu_hour_list(takedate.getHours(), endtime);
      } else {
        if (takedate.getHours() + 1 > endtime) {
          takedate.setDate(takedate.getDate() + 1);
          days = days - 1;
          firstdayhourslist_take = this.calcu_hour_list(starttime, endtime);
        } else {
          takedate.setHours(takedate.getHours() + 1);
          firstdayhourslist_take = this.calcu_hour_list(takedate.getHours(), endtime);
        }
      }
    } else {
      takedate.setDate(takedate.getDate() + 1);
      days = days - 1;
      firstdayhourslist_take = this.calcu_hour_list(starttime, endtime);
    }

    // other day hour list
    for (var i = starttime; i <= endtime; i++) {
      otherdayhourslist_take.push(addZone(i));
    }

    // 计算统计日期
    // 增加第一天
    var thisyear = takedate.getFullYear();// 今天是那一年
    var thismonth = takedate.getMonth() + 1;// 今天是几月
    var thisday = takedate.getDate();
    datelist_take.push(thisyear + '-' + addZone(thismonth) + '-' + addZone(thisday));
    // 增加后几天
    for (var i = 0; i < days; i++) {
      takedate.setDate(takedate.getDate() + 1);
      var thisyear = takedate.getFullYear();// 今天是那一年
      var thismonth = takedate.getMonth() + 1;// 今天是几月
      var thisday = takedate.getDate();
      datelist_take.push(thisyear + '-' + addZone(thismonth) + '-' + addZone(thisday));
    }

    this.setData({
      multiArray_take: [datelist_take, firstdayhourslist_take,firstdayminlist_take],
      firstdayhourslist_take:firstdayhourslist_take,
      otherdayhourslist_take: otherdayhourslist_take,
      firstdayminlist_take:firstdayminlist_take,
    });
  },

  bindMultiPickerChange_take(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var multiArray_take = this.data.multiArray_take;
    var multiIndex_take = this.data.multiIndex_take;

    this.setData({
      multiIndex_take: e.detail.value,
      ['ordermaininfo.takeaddrinfo.time']: multiArray_take[0][multiIndex_take[0]] + ' ' + multiArray_take[1][multiIndex_take[1]] + ':' + multiArray_take[2][multiIndex_take[2]]
    });
  },

  bindMultiPickerColumnChange_take(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value)
    const data = {
      multiArray_take: this.data.multiArray_take,
      multiIndex_take: this.data.multiIndex_take
    }
    data.multiIndex_take[e.detail.column] = e.detail.value

    var datelaterindex = data.multiArray_take[0].length - 1;
    var timelaterindex = data.multiArray_take[1].length - 1;

    switch (e.detail.column) {
      case 0:
        switch (e.detail.value) {
          case 0:
            data.multiArray_take[1] = this.data.firstdayhourslist_take
            data.multiArray_take[2] = this.data.firstdayminlist_take;
            break;
          default:
            data.multiArray_take[1] = this.data.otherdayhourslist_take;
            data.multiArray_take[2] = this.data.otherminlist_take;
            break;
        }
        break;
      case 1:
        switch (e.detail.value) {
          case 0:
            data.multiArray_take[2] = (this.data.multiIndex_take[0] == 0) ? this.data.firstdayminlist_take : this.data.otherminlist_take;
            break;
          default:
            data.multiArray_take[2] = this.data.otherminlist;
            break;
        }
        break;
    }

    this.setData(data)
  },

  // 金牌or专车
  urgent_tap() {
    this.setData({
      isurgent: !this.data.isurgent
    });
  },

  // 保费价格计算
  calcuinsured(e) {
    if (e.detail.value <= this.data.lugvaluemax) {
      wx.showModal({
        content: '行李价值上限' + this.data.lugvaluemax,
        confirmText: '确定',
        confirmColor: '#9F68AC',
        showCancel: false,
        success: res=> {
          this.setData({
            lugvalue: '',
            prem: ''
          });
        }
      });
      return;
    }
    this.setData({
      lugvalue: e.detail.value,
      prem: e.detail.value*this.data.insured_scale,
    });
  },
  

// 减少
reduce() {
  var lugnum_ = this.data.lugnum;
  if (lugnum_ > 1) {
    this.setData({
      lugnum: lugnum_ - 1,
    });
  }
},

// 增加
add() {
  var lugnum_ = this.data.lugnum;
  if (lugnum_ < this.data.lugnummax) {
    this.setData({
      lugnum: lugnum_ + 1,
    });
  }
 
},

insured_tap() {
  this.setData({
    isinsured: !this.data.isinsured
  });
},

deletephoto(e){
  var lugphotolist = this.data.lugphotolist;
  lugphotolist.splice(e.currentTarget.dataset.photoindex, 1);
  this.setData({
    lugphotolist: lugphotolist
  });
},

chooseImage_() {
  var this_ = this;
  var maxphotonum = 6;
  var lugphotolist = this.data.lugphotolist;

  wx.chooseImage({
    count: maxphotonum - lugphotolist.length,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: res=> {
      // tempFilePath可以作为img标签的src属性显示图片
      const tempFilePaths = res.tempFilePaths;
      this_.uploadLugImage(tempFilePaths);
    }
  })
},

// =================================================== start
// 上传行李照片
uploadLugImage(list) {
  var this_ = this;

  var uploadsuccessLugImage = [];

  for (var i= 0; i < list.length; i++) {
    console.info(config.ipconfig + '/v2/img-storage/upload');
    wx.uploadFile({
      url: config.ipconfig + '/v2/img-storage/upload',
      filePath: list[i],
      name: 'file',//这里根据自己的实际情况改
      formData: null,//这里是上传图片时一起上传的数据
      success: function (resp) {
        
        if (JSON.parse(resp.data).msg == 'success') {
          var uploadsuccessLugImage = this_.data.lugphotolist;
          console.info(JSON.parse(resp.data).url);
          uploadsuccessLugImage.push(JSON.parse(resp.data).url)
          this_.setData({
            lugphotolist: uploadsuccessLugImage
          });
        }
        
      },
      fail: function (res) {
        wx.showToast({
          title: '部分图片未上传成功',
          icon: 'none',
          duration: 1000
        });
      },
    }) 
  }

  
},
// =================================================== end



// 扫描qr
scancode() {
  var this_ = this;
  wx.scanCode({
    scanType: ['pdf417', 'qrCode', 'datamatrix', 'barCode'],
    success(res) {
      // qr不能超过行李数
      if (this_.data.lugbrlist.length == this_.data.lugnum) {
        wx.showToast({
          title: 'qr码已达上限',
          icon: 'none',
          duration: 3000
        })
        return;
      }

      if (this_.data.lugbrprefix != res.result.substring(0,4)) {
        wx.showToast({
          title: '此码无效' + res.result,
          icon: 'none',
          duration: 3000
        })
        return;
      } 

      if (this_.data.lugbrlist.indexOf(res.result) != -1) {
        wx.showToast({
          title: 'qr码重复添加',
          icon: 'none',
          duration: 3000
        })
      }

      // 检查qr码是否有效
      this_.checkqrvalid(res.result, this_);
    }
  })
},

  // 检查qr码是否有效
  checkqrvalid(qr,this_) {

    request.HttpRequst('/v2/order/qrIsRepet', 'GET', { qrCode: qr }).then(function (res) {
      if (res.isRepet) {
        wx.showToast({
          title: '此码已经使用过',
          icon: 'none',
          duration: 3000
        })
        return;
      }

      // 扫描的内容
      var lugbrlist = this_.data.lugbrlist;
      lugbrlist.push(qr);
      this_.setData({
        lugbrlist: lugbrlist,
      });

      wx.showToast({
        title: 'qr添加成功',
        icon: 'none',
        duration: 2000
      })
    })
  },

  viewbrbut() {
    this.setData({
      isviewbr: true
    })
  },

  // 取消查看qr
  cancleviewbr() {
    this.setData({
      isviewbr:false
    });
  },

  deleteqr(e) {
    var lugbrlist = this.data.lugbrlist;
    lugbrlist.splice(e.currentTarget.dataset.qrindex);
    this.setData({
      lugbrlist:lugbrlist,
    });
  },

  // 打开页面详情列
  openpricedetail() {
    this.setData({
      ispricedetailpage: true
    })
  },

  // 打开页面详情列
  closepricedetailpage() {
    this.setData({
      ispricedetailpage: false
    })
  },

  // 选择
  picthupone(e) {
    // 退单中的信息无法选择
    var orderinfo = this.data.orderlist[e.currentTarget.dataset.index];
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

    console.info(this.data.selectedorderlist);
  },

  // 加载订单列表数据
  loadOrderlist() {
    var this_ = this
    request.HttpRequst('/v2/order/list', 'POST', this.data.queryorderlistReqPram).then(function (res) {
      // 隐藏加载框
      wx.hideLoading();
      // 未成功加载
      if (res.code == 500) {
        this_.setData({ orderlist: [] })
        wx.showModal({
          content: '您还没有被分配到三级分销商',
          confirmText: '确定',
          confirmColor: '#fbc400',
          showCancel: false,
        })
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
            // actualmoney: list[i].order.actualmoney,
            // addtime: list[i].order.addtime,
            // channel: list[i].order.channel,
            // cusid: list[i].order.cusid,
            // cutmoney: list[i].order.cutmoney,
            distributorId: list[i].order.distributorId,
            // fetchcode: list[i].order.fetchcode,
            id: list[i].order.id,
            // isvalid: list[i].order.isvalid,
            // mobile: list[i].order.mobile,
            // name: list[i].order.name,
            num: list[i].order.num,
            // orderno: list[i].order.orderno,
            taketime: list[i].order.taketime,
            taketimepart: list[i].order.taketime.substring(5, 16),
            serviceType: list[i].order.serviceType,
            serviceTypeDesc: config.serviceType[list[i].order.serviceType].name,
            status: list[i].order.status,
            statusdesc: config.orderStatus[list[i].order.status].name,// 订单状态描述
            iscanceled: list[i].order.iscanceled,
            sendtime: list[i].order.sendtime,
            sendtimepart: list[i].order.sendtime.substring(5, 16),
            // totalmoney: list[i].order.totalmoney,
            // type: list[i].order.type,
            // neadfeach: list[i].order.neadfetch
          },
          orderAddress: {
            destaddress: list[i].orderAddress.destaddress,
            destaddrtype: list[i].orderAddress.destaddrtype,
            destaddrtypedesc: list[i].destType,
            // destcityid: list[i].orderAddress.destcityid,
            // destcityname: list[i].orderAddress.destcityname,
            // destgps: list[i].orderAddress.destgps,
            // destprovid: list[i].orderAddress.destprovid,
            // destprovname: list[i].orderAddress.destprovname,
            // orderid: list[i].orderAddress.orderid,
            srcaddress: list[i].orderAddress.srcaddress,
            srcaddrtype: list[i].orderAddress.srcaddrtype,
            srcaddrtypedesc: list[i].srcType,
            // srcaddressid: list[i].orderAddress.srcaddressid,
            // srccityid: list[i].orderAddress.srccityid,
            // srccityname: list[i].orderAddress.srccityname,
            // srcgps: list[i].orderAddress.srcgps,
            // srcprovid: list[i].orderAddress.srcprovid,
            // srcprovname: list[i].orderAddress.srcprovname
          },
          charge: list[i].appUser ? list[i].appUser.name : '无',
          appUser: list[i].appUser ? list[i].appUser: {},
          selected: true,
        }

        orderlist.push(oneItem)
      }

      this_.setData({
        orderlist: orderlist,
        ["queryorderlistReqPram.pageIndex"]: this_.data.queryorderlistReqPram.pageIndex + 1,
        totalPage: res.result.totalPage
      })
    })
  },

  // 下拉加载数据;
  bindDownLoad: function () {
    if (this.data.queryorderlistReqPram.pageIndex > this.data.totalPage) {
      return false
    }
    this.loadOrderlist()
  },

  // 刷新
  refreshtap() {
    // 弹出加载页面
    wx.showLoading();
    // 刷新订单列表的目标：携带筛选条件重新查询一边,并且页数回到第一页
    this.setData({
      orderlist: [],
      ['queryorderlistReqPram.pageIndex']: 1,
    });
    // 查询订单列表信息
    this.loadOrderlist();
  },

  // 是否多选
  tomutlchoice() {
    this.setData({
      multiplechoiceflag: true
    });
  },

  // 取消多选
  mutlchoice_cancal() {
    var orderlist = this.data.orderlist;
    for (var i = 0; i < orderlist.length; i++) {
      orderlist[i].selected= true;
    }
        
    this.setData({
      selectedorderlist: [],
      multiplechoiceflag: false,
      orderlist:orderlist,
      mulchoiceflag:false,
      staffid:'',
      staffinfo: {},
      staffinfolist:[],
      staffselect: '-1',
    });
  },

  // 取消
  mulchoiceflag() {
    var orderlist = this.data.orderlist;
    var selectedorderlist = this.data.selectedorderlist;
    selectedorderlist = [];
    var mulchoiceflag = this.data.mulchoiceflag;
    if (mulchoiceflag) {
      for (var i = 0; i < orderlist.length; i++) {
        orderlist[i].selected = mulchoiceflag;
      }
    } else {
      for (var i = 0; i < orderlist.length; i++) {
        // 退单中的信息无法选择
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

    console.info(this.data.selectedorderlist);
  },

  // 批量改派 调出遮罩层，
  batchchangesendtap() {
    var this_ = this;
    if(this.data.selectedorderlist.length==0) {
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

      if (selectedorder.order.distributorId != selectedorderlist[i].order.distributorId) {
        wx.showModal({
          content: '所选订单不属于同一分销商',
          confirmText: '确定',
          confirmColor: '#fbc400',
          showCancel: false
        })

        return false
      }
      
    }

    
    var params = {
      distributorId: selectedorder.order.distributorId
    }
    request.HttpRequst('/v2/app-user/select', 'GET', params).then(function (res) {
      console.log(res)
      this_.setData({
        staffinfolist: res.data
      })
    })
    
    this.setData({
      openshadepanel:true
    });
  },

  cancalshadepanel() {
    this.setData({
      openshadepanel: false
    });
  },

  // 选中某个取派员
  selecedstaff(e) {
    var staffid = e.currentTarget.dataset.id;
    
    this.setData({
      staffselect: e.currentTarget.dataset.index,
      staffid:staffid,
      staffinfo: this.data.staffinfolist[e.currentTarget.dataset.index],
    });

  },

  surestaff_changorder() {
    var staffid = this.data.staffid;
    if(!staffid) {
      wx.showToast({
        title: '请选择改派人员',
        icon: 'none',
        duration: 2000,
      });
      return false
    }

    var this_ = this
    var non_appoint_orderid_list = ''
    var appoint_orderid_list = ''
    var non_appoint_execute = false;
    var appoint_execute = false;
    
    // 选中待改派的订单
    var selectedorderlist = this.data.selectedorderlist;
    for (var i = 0; i < selectedorderlist.length; ++i) {
      if (selectedorderlist[i]) {
        if (selectedorderlist[i].appUser.id) {
          appoint_orderid_list += selectedorderlist[i].order.id + ','
        } else {
          non_appoint_orderid_list += selectedorderlist[i].order.id + ','
        }
      }
    }

    if (non_appoint_orderid_list != '' && appoint_orderid_list == '') {
      var params = {
        userId: this.data.staffid,
        orderIds: non_appoint_orderid_list.substring(0, non_appoint_orderid_list.length - 1)
      }
      console.log(new_params)
      request.HttpRequst('/v2/order/appoint', 'POST', params).then(function (res) {
        console.info(res);
        if(res.code == 0) {
          var selectedorderlist = this_.data.selectedorderlist;
          var orderlist = this_.data.orderlist;
          for (var i = 0; i < selectedorderlist.length; i++) {
            if (selectedorderlist[i]) {
              this_.setData({
                ['orderlist[' + i + '].order.status']: orderlist[i].order.status == config.orderStatus.PREPAID.value ? config.orderStatus.WAITPICK.value : orderlist[i].order.status,
                ['orderlist[' + i + '].order.statusdesc']: orderlist[i].order.status == config.orderStatus.PREPAID.value ? config.orderStatus.WAITPICK.name : orderlist[i].order.statusdesc,
                ['orderlist[' + i + '].charge']: this_.data.staffinfo.name,
                ['orderlist[' + i + '].appUser']: this_.data.staffinfo,
                ['orderlist[' + i + '].selected']: false,
              })
            }
          }

          // 取派人员框消失
          this_.setData({
            openshadepanel: false,
            staffselect: '-1',
            staffinfolist: [],
            selectedorderlist: []
          });  
        } else {
          wx.showToast({
            title: '改派未成功，' + res.msg,
            icon: 'none',
            duration: 2000,
          });
          return false
        }
      
      })
    } else if (non_appoint_orderid_list == '' && appoint_orderid_list != '') {
      var new_params = {
        userId: this.data.staffid,
        orderIds: appoint_orderid_list.substring(0, appoint_orderid_list.length - 1)
      }
      request.HttpRequst('/v2/order/anewAppoint', 'POST', new_params).then(function (res) {
        if(res.code == 0) {
          console.info(res);
          var selectedorderlist = this_.data.selectedorderlist;
          var orderlist = this_.data.orderlist;
          for (var i = 0; i < selectedorderlist.length; i++) {
            if (selectedorderlist[i]) {
              this_.setData({
                ['orderlist[' + i + '].order.status']: orderlist[i].order.status == config.orderStatus.PREPAID.value ? config.orderStatus.WAITPICK.value : orderlist[i].order.status,
                ['orderlist[' + i + '].order.statusdesc']: orderlist[i].order.status == config.orderStatus.PREPAID.value ? config.orderStatus.WAITPICK.name : orderlist[i].order.statusdesc,
                ['orderlist[' + i + '].charge']: this_.data.staffinfo.name,
                ['orderlist[' + i + '].appUser']: this_.data.staffinfo,
                ['orderlist[' + i + '].selected']: false,
              })
            }
          }

          // 取派人员框消失
          this_.setData({
            openshadepanel: false,
            staffselect: '-1',
            staffinfolist: [],
            selectedorderlist: []
          });
        } else {
          wx.showToast({
            title: '改派未成功，'+ res.msg,
            icon: 'none',
            duration: 2000,
          });
          return false
        }
      })
    } else {
      var params = {
        userId: this.data.staffid,
        orderIds: non_appoint_orderid_list.substring(0, non_appoint_orderid_list.length - 1)
      }
      console.log(new_params)
      request.HttpRequst('/v2/order/appoint', 'POST', params).then(function (res) {
        var new_params = {
          userId: this.data.staffid,
          orderIds: appoint_orderid_list.substring(0, appoint_orderid_list.length - 1)
        }
        request.HttpRequst('/v2/order/anewAppoint', 'POST', new_params).then(function (res) {
          if(res.code == 0) {
            console.info(res);
            var selectedorderlist = this_.data.selectedorderlist;
            var orderlist = this_.data.orderlist;
            for (var i = 0; i < selectedorderlist.length; i++) {
              if (selectedorderlist[i]) {
                this_.setData({
                  ['orderlist[' + i + '].order.status']: orderlist[i].order.status == config.orderStatus.PREPAID.value ? config.orderStatus.WAITPICK.value : orderlist[i].order.status,
                  ['orderlist[' + i + '].order.statusdesc']: orderlist[i].order.status == config.orderStatus.PREPAID.value ? config.orderStatus.WAITPICK.name : orderlist[i].order.statusdesc,
                  ['orderlist[' + i + '].charge']: this_.data.staffinfo.name,
                  ['orderlist[' + i + '].appUser']: this_.data.staffinfo,
                  ['orderlist[' + i + '].selected']: false,
                })
              }
            }

            // 取派人员框消失
            this_.setData({
              openshadepanel: false,
              staffselect: '-1',
              staffinfolist: [],
              selectedorderlist: []
            });

          } else {
            wx.showToast({
              title: '改派未成功，' + res.msg,
              icon: 'none',
              duration: 2000,
            });
            return false
          }

         
        })
      })
    }
  },
  
  // 取消选择改派人员列表
  cancal_changeorder() {
    // 取派人员框消失
    this.setData({
      openshadepanel: false,
      staffselect: '-1',
      staffinfolist: [],
    });
  }
})




