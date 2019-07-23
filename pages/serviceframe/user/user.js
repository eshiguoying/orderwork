// pages/orderDetail/orderDetail.js
const request = require('../../../request')

Component ({
  data: {
    // 登录用户信息
    accountInfo: {},
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
            this_.setData({
              accountInfo: wx.getStorageSync('accountInfo')
            })
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

    // 编辑用户
    editUserInfo(e) {
      console.info(e);
      this.setData({
        edittype: e.currentTarget.dataset.edittype,
        userinfo: this.data.accountInfo.appUser,
        isshowuserEdit: true
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
