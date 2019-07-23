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
        console.info(res);
        if(res.code == 0 && res.data.length > 0) {
          this_.setData({
            stafflist_2rdall: res.data
          });
          this_.screenstafflist();
        }
      })
    },

    // 筛选
    screenstafflist() {

      var stafflist_2rdall = this.data.stafflist_2rdall;
      
      for (var i = 0; i < stafflist_2rdall.length; i++) {
        if (this.data.search_name && stafflist_2rdall[i].name.indexOf(this.data.search_name) == -1) {
          stafflist_2rdall[i].showflag = false;
          continue;
        }
        if (this.data.onlyshowstartuserflag && stafflist_2rdall[i].isvalid == config.isvalidType.N.value) {
          stafflist_2rdall[i].showflag = false;
          continue;
        }
        stafflist_2rdall[i].showflag = true;
      }
      console.info("====");
      console.info(stafflist_2rdall);
      this.setData({
        stafflist_2rdall: []
      });
      this.setData({
        stafflist_2rdall: stafflist_2rdall
      });
    },

    // 实时筛选
    search_name_input(e) {
      this.setData({
        search_name: e.detail.value
      });

      this.screenstafflist();
    },

    // 清空搜索条件
    clearsearch_name() {
      this.setData({
        search_name: ''
      });

      this.screenstafflist();
    },

    // 编辑用户
    editUserInfo(e) {
      var userinfo = this.data.stafflist_2rdall[e.currentTarget.dataset.index];
      if(userinfo.isvalid == config.isvalidType.N.value) {
        return;
      }

      this.setData({
        editlaterindex: e.currentTarget.dataset.index,
        edittype: e.currentTarget.dataset.edittype,
        userinfo: userinfo,
        isshowuserEdit: true
      });
    },
  

    // 是否仅显示启动的用户
    isshowonlystartuser() {
      this.setData({
        onlyshowstartuserflag: !this.data.onlyshowstartuserflag
      });

      this.screenstafflist();
    },

    // 切换用户状态
    enableUser: function (e) {
      var this_ = this;
      wx.showLoading({
        mask: true
      });
      console.info(e);
      let params = {
        "id": e.currentTarget.dataset.param.id,
        "isvalid": e.currentTarget.dataset.param.isvalid == config.isvalidType.Y.value? config.isvalidType.N.value:config.isvalidType.Y.value,
      }
      request.HttpRequst('/v2/app-user/operate', 'PUT', params).then(res => {
        console.info(res);
        wx.hideLoading();
        if (res.code != 0) {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 3000
          });
         return;
        } 

        this_.setData({
          ['stafflist_2rdall[' + e.currentTarget.dataset.index +'].isvalid']: params.isvalid
        });

        this_.screenstafflist();
      })
    },
    
    

    // 关闭编辑面板
    closeUserEditpanel() {
      this.setData({
        isshowuserEdit:false
      });
    },

    // 编辑成功回调
    sureEditSuccess(e) {
      console.info(e);
      this.setData({
        ['stafflist_2rdall[' + e.detail.index + ']']: e.detail.userinfo
      })
    }
  },

  
  
})
