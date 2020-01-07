const App = getApp();
const request = require('../../../request');
const config = require('../../../config');
// 高德地图引用
const amapFile = require('../../../thirdparty/js/amap-wx.js');
// 汉子转拼音
const pinyin = require('../../../thirdparty/js/pinying/pinyinUtil');

Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    actionType: {
      type: String,
      value: '',
    },
  },
  data: {
    // 状态栏高度
    navH: App.globalData.navHeight,
    // 标题栏高度
    titlebarH: App.globalData.titlebarHeight,
    // 页面可用高度
    windowH: App.globalData.windowHeight,
    // 页面可用宽度
    windowW: App.globalData.windowWidth,
    cityselePanelW: 20,
    addrInputPanelW: 60,
    isQueryCityList: false,
    // 登录用户信息
    accountInfo: {},

    selectaddrpage: false,// 地址选择页面是否开启 true 开启 false不开启，默认不开启
    suggestion: [{}],// 地址列表
    addrnode: '',// 地址选择标志
    isselect_addr: false,// 地址搜索是否不可用 false 是可用

    // 城市列表
    cityList: [],
    query_result_cityList: [],

    // 全部城市
    allCity: [],

    // 地址模型
    addrinfo: {
      provcode: '',
      provname: '',
      cityname: '',
      citycode: '',
      landmark: '',
      address: '',
      location: '',
      actiontype: ''
    },

  },

  // 组件生命周期函数-在组件实例进入页面节点树时执行
  attached() {
    this.init();
  },

  methods: {
    // 用户位置权限设置
    init() {
      // 打开
     
      this.setData({
        selectaddrpage: true,
        ['addrinfo.actiontype']: this.properties.actionType
      });

      this.getCurrCity();
    
      if(this.properties.actionType == config.actionType.SEND.value) {
        this.getOpenCityList();
      } else {
        this.getAllCityList();
      }
      
    },

    // 高德地图识别当前城市信息
    getCurrCity() {
      var this_ = this;
      // 通过高德地图api把经纬度转换为城市
      const myAmapFun = new amapFile.AMapWX({ key: config.map.key });
      myAmapFun.getRegeo({
        success: data => {
          let cityName = data[0].regeocodeData.addressComponent.city;

          const temp_ = data[0].regeocodeData.addressComponent.adcode;
          var citycode = temp_.substring(0, 2) + '00';

          var provcode =  temp_.substring(0, 2) + '0000';
          var provname = data[0].regeocodeData.addressComponent.province;

          if (cityName == '') {
            citycode = citycode.substring(0, 2) + '0000';
            cityName = data[0].regeocodeData.addressComponent.province

            provname = provname.substring(0, 2);
          }

          

          this.setData({
            ['addrinfo.provcode']: provcode,
            ['addrinfo.provname']: provname,
            ['addrinfo.cityname']: cityName,
            ['addrinfo.citycode']: citycode,
          });
        }
      })
    },

    // 获取开通城市列表
    getOpenCityList() {
      var this_ = this;
      request.HttpRequst('/v2/area/servicecity', 'GET', {}).then(function (res) {
        if(res.code == 0) {
          this_.setData({
            cityList: res.cities,
            query_result_cityList: res.cities
          });
        }
      });
    },

    // 获取开通城市列表
    getAllCityList() {
      var this_ = this;
      request.HttpRequst('/v2/area/allcity', 'GET', {}).then(function (res) {
        console.info(res.cities);
        if(res.code == 0) {
          this_.setData({
            cityList: res.cities,
            query_result_cityList: res.cities
          });
        }
      });
    },

    // 选择城市时
    editcityselet() {
      this.setData({
        cityselePanelW: 40,
        addrInputPanelW: 40, 
        isQueryCityList: true,
      });
    },

    // 点击选择地址时
    editaddrselet() {
      this.setData({
        cityselePanelW: 20,
        addrInputPanelW: 60, 
        isQueryCityList: false,

      });
    },

    // 选择某个城市
    pitchonCityone(e) {
      this.setData({
        ['addrinfo.provname']: e.currentTarget.dataset.provname,
        ['addrinfo.provcode']: e.currentTarget.dataset.provcode,
        ['addrinfo.cityname']: e.currentTarget.dataset.cityname,
        ['addrinfo.citycode']: e.currentTarget.dataset.citycode,
        suggestion: [{}]
      });

      this.editaddrselet();
    },

    // 城市
    searchCity(e) {
      this.setData({
        query_result_cityList: []
      });

      var keywords = e.detail.value;

      var list = [];
      var oridata = this.data.cityList;
      for(var i = 0; i< oridata.length; i++) {
          if(oridata[i].name.indexOf(keywords) != -1 
          || pinyin.pinyinUtil.getPinyin(oridata[i].name).indexOf(pinyin.pinyinUtil.getPinyin(keywords)) != -1) {
            list.push(oridata[i]);
          }
      }

      this.setData({
        query_result_cityList: list
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
        city: this.data.addrinfo.citycode,
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
      this.setData({
        ['addrinfo.landmark']:e.currentTarget.dataset.landmark,
        ['addrinfo.address']:e.currentTarget.dataset.address,
        ['addrinfo.location']:e.currentTarget.dataset.location,
      })

      this._backfilladdr();
      this.cancleaddrselepage();
    },

    // 回填地址
    _backfilladdr() {
      this.triggerEvent("_backfilladdr", this.data.addrinfo);
    },

     // 取消地址
     cancleaddrselepage() {
      this.setData({
        selectaddrpage: false
      });

      var this_ = this;
      setTimeout(function() {
        this_.triggerEvent("_cancleAddrSelePanel");
      }, 300);
    },
  }
})