// pages/orderDetail/orderDetail.js
const App = getApp();
const request = require('../../../request')
const config = require('../../../config')

Component ({
  data: {
    // 页面可用高度
    windowH: App.globalData.windowHeight,
    // 页面可用宽度
    windowW: App.globalData.windowWidth,
    // 工作方式
    workTypeEnum: config.workType,
    // 等级类型枚举
    levelTypeEnum: config.levelType,
    // 是否启动枚举
    isvalidTypeEnum: config.isvalidType,
    // 登录用户信息
    accountInfo: {},
    // 搜索条件
    search_name: '',
    // 是否仅显示启动用户
    onlyshowstartuserflag: true,
    // 2级分销商下的所有员工信息
    stafflist_2rdall: [],
    // 筛选过后员工列表
    stafflist_2rdall_screenlater: [],

  },

  attached() {
    this.init_user();
  },

  methods:{

    // 是否跳转注册页面
    init_user() {
      var maxcirclu = 1;
      var this_ = this;

      var getToken = setInterval(function () {
        if (maxcirclu <= 100) {
          maxcirclu = maxcirclu + 1;

          if (request.header.token) {
            // 获取当前登录用户信息

            var accountInfo = wx.getStorageSync('accountInfo');
            this_.setData({
              accountInfo: accountInfo
            })

            this_.load2rdAllstafflist();

            clearInterval(getToken);
          }
        } else {
          wx.showToast({
            title: '系统异常',
            icon: 'none',
            duration: 1000
          });

          // 结束循环
          clearInterval(getToken);
          return;

        }
      }, 10)
    },

    // 加载二级分销商下的所有取派员
    load2rdAllstafflist() {
      var this_ = this;

      let params = {
        distributorId: this.data.accountInfo.appUser.distributor2nd
      }
      request.HttpRequst('/v2/app-user/list', 'POST', params).then(res => {
        console.info(res.data);
        this_.setData({
          stafflist_2rdall: res.data,
          stafflist_2rdall_screenlater: res.data
        });
      })
    },

    // 实时筛选
    search_name_input(e) {


      this.setData({
        search_name: e.detail.value
      });
    },

    // 清空搜索条件
    clearsearch_name() {
      this.setData({
        search_name: ''
      });
    },

    // 编辑用户
    editUserInfo(e) {
      console.info(e);
      this.setData({
        edittype: e.currentTarget.dataset.edittype,
        userinfo: this.data.accountInfo,
        isshowuserEdit: true
      });
    },

    // 是否仅显示启动的用户
    isshowonlystartuser() {
      this.setData({
        onlyshowstartuserflag: !this.data.onlyshowstartuserflag
      });
    },
    
    // 编辑用户
    linkToEdit: function (e) {
      if (e.currentTarget.dataset.enable) {
        if (e.currentTarget.dataset.param == 'myself') {
          // 要修改登录人信息-只能修改姓名与手机号
          wx.setStorage({
            key: 'editUserInfo',
            data: {
              type: 'myself',
              distributor: this.data.accountInfo.appUser.thirdname
            }
          });
        } else {
          wx.setStorage({
            key: 'editUserInfo',
            data: e.currentTarget.dataset.param
          });
        }

        this.setData({
          userinfo: this.data.accountInfo,
          isshowuserEdit:true
        });
      }
    },

    // 关闭编辑面板
    closeUserEditpanel() {
      this.setData({
        isshowuserEdit:false
      });
    },

    // 编辑成功回调
    sureEditSuccess() {
      this.setData({
        accountInfo: wx.getStorageSync('accountInfo')
      })
    }
  },

  
  
})
