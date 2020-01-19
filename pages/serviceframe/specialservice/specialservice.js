const App = getApp();
const request = require('../../../request');
const config = require('../../../config');
// 高德地图引用
const amapFile = require('../../../thirdparty/js/amap-wx.js');

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

    // 是否分配三级分销商
    isallocdistributor3rd: false,

    // 企业用户列表
    enterprise_list: [],

    // 选择结果企业用户
    enterprise_result_name:'',
    enterprise_result_channel: '',

    // 寄间类型滑块
    sliding: {
      'takeaddrinfo': 'takeaddrinfo_HOTEL'
    },

    selectaddrpage: false,// 地址选择页面是否开启 true 开启 false不开启，默认不开启
    suggestion: [{}],// 地址列表
    addrnode: '',// 地址选择标志

    // 地址类型决定 时间范围
    sendtimebyaddrtype: {
      'HOTEL': {
        starttime: 7,
        endtime: 18
      },
      'HOUSE': {
        starttime: 9,
        endtime: 18
      },
      'AIRPORTCOUNTER': {
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
      'HOTEL': {
        starttime: 7,
        endtime: 23
      },
      'HOUSE': {
        starttime: 9,
        endtime: 23
      },
      'AIRPORTCOUNTER': {
        starttime: 9,
        endtime: 22
      }
    },

    // 收件时间内容
    multiArray_take: [],
    // 默认收件时间下标
    multiIndex_take: [0, 0, 0],
    firstdayhourslist_take: [],
    otherdayhourslist_take: [],
    firstdayminlist_take: [],
    otherminlist_take: ['00', '30'],
    taketime: '加载中......',

    // 客户信息
    cusname: '',
    cusphone: '',
    cusidno: '',

    // 行李数量
    lugnum: 1,
    lugnummax: 10,

    // 行李照片列表
    lugphotolist: [],

    // 行李br前缀
    lugbrprefix: 'JPQR',
    // 行李 br 码的数量
    lugbrlist: [],
    // 是否查看qr
    isviewbr: false,
    
    // 价格
    lugprice: '',
    remark: '',

    surebutisvaild: false,

    // 下单地址模型
    ordermaininfo: {
      'sendaddrinfo': {
        provcode: '',
        provname: '',
        cityname: '',
        citycode: '',
        //默认地址类型 => 机场
        addrtype: 'AIRPORTCOUNTER',
        landmark: '',
        address: '',
        location: '',
        doornum: '',
        time: ''
      },
      'takeaddrinfo': {
        provcode: '',
        provname: '',
        cityname: '',
        citycode: '',
        //默认地址类型 => 酒店
        addrtype: 'HOTEL',
        landmark: '',
        address: '',
        location: '',
        doornum: '',
        time: ''
      }
    },
  },

  // 组件生命周期函数-在组件实例进入页面节点树时执行
  attached() {
    this.init_abnlplaceanorder();
  },

  methods: {
    init_abnlplaceanorder() {
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

            this_.loadData();

            clearInterval(getToken);
          }
        } else {
          // 结束循环
          clearInterval(getToken);
        }
      }, 10)
    },

    // 加载数据
    loadData() {
      // 是否分配三级分销商
      if(this.data.accountInfo.appUser.distributor3rd == null || this.data.accountInfo.appUser.distributor3rd == '') {
        this.setData({
          isallocdistributor3rd: true
        });
        wx.showToast({
          title: '未被分配三级分销商',
          icon: 'none',
          duration: 2000
        })
        return;
      }

      // 加载企业用户
      this.queryEnterp();
      // 寄件时间
      this.sendDate();
      // 收件时间
      this.taketime();
    },

    // 加载企业用户
    queryEnterp() {
      let this_ = this;
      request.HttpRequst('/v2/Enterp/enterpriseUserlist', 'POST', this.data.accountInfo.appUser.distributor3rd).then(function (res) {
        console.info(res);
        if(res.code == 0) {
          this_.setData({
            enterprise_list: res.enterplist
          });
        }
      });
    },

    // 选择企业用户
    bindChoiceEnterprise(e) {
      this.setData({
        enterprise_result_name: this.data.enterprise_list[e.detail.value].userName,
        enterprise_result_channel: this.data.enterprise_list[e.detail.value].userCode
      })
    },

    // 地址类型
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
          ['ordermaininfo.' + addrnode + '.doornum']: '',
          ['ordermaininfo.' + addrnode + '.time']: '',
          ['sliding.' + addrnode]: addrnode + '_' + addrtype,
        });
      }

      // 寄收件时间
      var this_ = this;
      'sendaddrinfo' == addrnode ? this_.sendDate() : this_.taketime();
    },


    // 加载地址栏
    loadaddrselect(e) {
      this.setData({
        showNewaddrselectPanelflag: true,
        actionType: e.currentTarget.dataset.actiontype,
      });
    },

    // 取消地址
    _cancleaddrselepage() {
      this.setData({
        showNewaddrselectPanelflag: false,
      });
    },

      // 回填地址
      _backfilladdr(e) {
        var ordermaininfo = this.data.ordermaininfo;
        console.info(e.detail);
        var flag = e.detail.actiontype + 'addrinfo';
        ordermaininfo[flag].provcode = e.detail.provcode;
        ordermaininfo[flag].provname = e.detail.provname;
        ordermaininfo[flag].cityname = e.detail.cityname;
        ordermaininfo[flag].citycode = e.detail.citycode;
        ordermaininfo[flag].landmark = e.detail.landmark;
        ordermaininfo[flag].address = e.detail.address;
        ordermaininfo[flag].location = e.detail.location;
  
        console.info(ordermaininfo);
        this.setData({
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
      var firstdayminlist_send = ['00', '30'];

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

      var list = [];
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
        multiArray_take: [datelist_take, firstdayhourslist_take, firstdayminlist_take],
        firstdayhourslist_take: firstdayhourslist_take,
        otherdayhourslist_take: otherdayhourslist_take,
        firstdayminlist_take: firstdayminlist_take,
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

    // 
    inputcusname(e) {
      this.setData({
        cusname:  e.detail.value.replace(/\s+/g, '')
      });
    },

    inputcusiphone(e) {
      this.setData({
        cusphone:  e.detail.value.replace(/\s+/g, '')
      });
    },

    inputcusidno(e) {
      this.setData({
        cusidno:  e.detail.value.replace(/\s+/g, '')
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

    deletephoto(e) {
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
        success: res => {
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

      for (var i = 0; i < list.length; i++) {
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

          if (this_.data.lugbrprefix != res.result.substring(0, 4)) {
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
    checkqrvalid(qr, this_) {

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
        isviewbr: false
      });
    },

    deleteqr(e) {
      var lugbrlist = this.data.lugbrlist;
      lugbrlist.splice(e.currentTarget.dataset.qrindex);
      this.setData({
        lugbrlist: lugbrlist,
      });
    },

    // 行李价格
    lugpriceinput(e) {
      this.setData({
        lugprice: e.detail.value.replace(/\s+/g, '')
      }); 
    },

    // 行李价格
    remarkinput(e) {
      this.setData({
        remark: e.detail.value
      }); 
    },

    // 下单
    sure_createrorder() {

      if(this.data.accountInfo.distributor3rd == '') {
        wx.showToast({
          title: '未被分配到三级分销商',
          icon: 'none',
          duration: 2000
        })
        return;
      }

      if(this.data.enterprise_result_name == '') {
        wx.showToast({
          title: '选择企业用户',
          icon: 'none',
          duration: 2000
        })
        return;
      }

      if(this.data.ordermaininfo.sendaddrinfo.landmark == '') {
        wx.showToast({
          title: '填写寄件地址',
          icon: 'none',
          duration: 2000
        })
        return;
      }

      if(this.data.ordermaininfo.takeaddrinfo.landmark == '') {
        wx.showToast({
          title: '填写收件地址',
          icon: 'none',
          duration: 2000
        })
        return;
      }
     
      if(this.data.ordermaininfo.sendaddrinfo.time == '') {
        wx.showToast({
          title: '填写寄件时间',
          icon: 'none',
          duration: 2000
        })
        return;
      }

      if(this.data.ordermaininfo.takeaddrinfo.time == '') {
        wx.showToast({
          title: '填写收件时间',
          icon: 'none',
          duration: 2000
        })
        return;
      }

      if(this.data.cusname == '') {
        wx.showToast({
          title: '填写客户姓名',
          icon: 'none',
          duration: 2000
        })
        return;
      }

      if(this.data.cusphone == '') {
        wx.showToast({
          title: '填写客户电话号码',
          icon: 'none',
          duration: 2000
        })
        return;
      }

      let valid_rule = /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/;// 手机号码校验规则
      if ( ! valid_rule.test(this.data.cusphone)) {
        wx.showToast({
          title: '检查电话格式',
          icon: 'none',
          duration: 2000
        })
        return;
      }

      if(this.data.cusidno == '') {
        wx.showToast({
          title: '填写客户身份证号',
          icon: 'none',
          duration: 2000
        })
        return;
      }

      if(this.data.lugphotolist.length == 0) {
        wx.showToast({
          title: '请拍照',
          icon: 'none',
          duration: 2000
        })
        return;
      }

      // if(this.data.lugbrlist.length == 0) {
      //   wx.showToast({
      //     title: '添加br码',
      //     icon: 'none',
      //     duration: 2000
      //   })
      //   return;
      // }
      
      if(this.data.lugprice != '' &&  !this.data.lugprice.match(/^(:?(:?\d+.\d+)|(:?\d+))$/)) {
        wx.showToast({
          title: '价格不是数字',
          icon: 'none',
          duration: 2000
        })  
        return;
      }

      let this_ = this;
      wx.showModal({
        title: '提示',
        content: '是否确定下单？',
        success (res) {
          if (res.confirm) {

            if(this_.data.surebutisvaild) {
              wx.showToast({
                title: '不可重复下单！',
                icon: 'none',
                duration: 2000
              })
              return;
            }
      
            this_.setData({
              surebutisvaild: true
            });

            let reqparam = {
              order: {
                channel: this_.data.enterprise_result_channel,
                srcType: this_.data.ordermaininfo.sendaddrinfo.addrtype,
                destType: this_.data.ordermaininfo.takeaddrinfo.addrtype,
                srcTime: this_.data.ordermaininfo.sendaddrinfo.time,
                destTime: this_.data.ordermaininfo.takeaddrinfo.time,
                distributorId: this_.data.accountInfo.appUser.distributor3rd,
                num: this_.data.lugnum,
                remark: this_.data.remark,
                serviceType: config.serviceType.ABNL.value,
                totalmoney: this_.data.lugprice == ''? 0:this_.data.lugprice,
                cutmoney: 0,
                actualmoney: this_.data.lugprice == ''? 0:this_.data.lugprice,
                paytype: 2, // 月结
                distributorName: this_.data.accountInfo.appUser.thirdname
              },
              address: {
                srcaddrtype: this_.data.ordermaininfo.sendaddrinfo.addrtype,
                destaddrtype: this_.data.ordermaininfo.takeaddrinfo.addrtype,
                srcprovid: this_.data.ordermaininfo.sendaddrinfo.provcode,
                srcprovname: this_.data.ordermaininfo.sendaddrinfo.provname,
                srccityid: this_.data.ordermaininfo.sendaddrinfo.citycode,
                srccityname: this_.data.ordermaininfo.sendaddrinfo.cityname,
                scrlandmark: this_.data.ordermaininfo.sendaddrinfo.landmark,
                srcaddress:this_.data.ordermaininfo.sendaddrinfo.address + ' ' + this_.data.ordermaininfo.sendaddrinfo.doornum,  
                srcgps: "{'lng':'" + this_.data.ordermaininfo.sendaddrinfo.location.split(",")[0] + "','lat':'" + this_.data.ordermaininfo.sendaddrinfo.location.split(",")[1] + "'}",

                destprovid: this_.data.ordermaininfo.takeaddrinfo.provcode,
                destprovname: this_.data.ordermaininfo.takeaddrinfo.provname,
                destcityid: this_.data.ordermaininfo.takeaddrinfo.citycode,
                destcityname: this_.data.ordermaininfo.takeaddrinfo.cityname,
                destlandmark: this_.data.ordermaininfo.takeaddrinfo.landmark,
                destaddress: this_.data.ordermaininfo.takeaddrinfo.address + ' ' + this_.data.ordermaininfo.takeaddrinfo.doornum,  
                destgps: "{'lng':'" + this_.data.ordermaininfo.takeaddrinfo.location.split(",")[0] + "','lat':'" + this_.data.ordermaininfo.takeaddrinfo.location.split(",")[1] + "'}",
              },
              contact: {
                name: this_.data.cusname,
                idno: this_.data.cusidno,
                mobile: this_.data.cusphone
              },
              orderImgVO: {
                imgUrls: this_.data.lugphotolist
              },
              orderQRVO: {
                qrCode: this_.data.lugbrlist.toString()
              }
            }

            // 确认按钮失效
            console.info(reqparam);
            request.HttpRequst('/v2/order/submitOrder_abnl', 'POST', reqparam).then(function (res) {
              this_.setData({
                surebutisvaild: false
              });

              wx.showToast({
                title: '下单成功',
                icon: 'success',
                duration: 2000
              })

              // 重置信息
              this_.setData({
                ['ordermaininfo.sendaddrinfo.time']: '',
                ['ordermaininfo.takeaddrinfo.addrtype']: 'HOTEL',
                ['ordermaininfo.takeaddrinfo.landmark']: '',
                ['ordermaininfo.takeaddrinfo.address']: '',
                ['ordermaininfo.takeaddrinfo.location']: '',
                ['ordermaininfo.takeaddrinfo.doornum']: '',
                ['ordermaininfo.takeaddrinfo.time']: '',
                ['sliding.takeaddrinfo']: 'takeaddrinfo_HOTEL',
                cusname: '',
                cusphone: '',
                cusidno: '',
                lugnum: 1,
                lugphotolist: [],
                lugbrlist: [],
                lugprice: '',
                remark: ''
              });
            }); 
          } else if (res.cancel) {
          }
        }
      })
    },
  }
})