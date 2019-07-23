const App = getApp();
// userEdit.js
const request = require('../../../request');
const util = require('../../../utils/util');
const config = require('../../../config')

Component({
  properties: {
    edittype: {
      type: String,
      value: ''
    },
    userinfo: {
      type: Object,
      value: {},
    },
    editlaterindex: {
      type: String,
      value: '',
    }
  },
  
  data: {
    // 页面可用高度
    windowH: App.globalData.windowHeight,
    // 页面可用宽度
    windowW: App.globalData.windowWidth,
    
    // 等级枚举
    levelEnum: config.levelType,
    // 用户编辑枚举
    userEditTypeEnum: config.userEditType,

    // 分销商选取序号
    distributorIndex: 0,
    // 分销商列表
    distributorList: [
      { 
        id: -1,
        name: '待分配'
      },
    ],
    
    
    // 用户级别-默认初级
    userLevel: '3',
    // 用户id
    userId: '',

    // 是否为修改本人信息
    editMyself: false,

  },

  attached () {
    this.init_userEdit();
  },

  methods: {
    init_userEdit() {

      this.setData({
        edittype: this.properties.edittype,
        userinfo: this.properties.userinfo
      });
      
      // 加载分销商信息
      this.loaddistributorlist();
    },

    loaddistributorlist() {
      var this_ = this;
      // 获取分销商列表
      request.HttpRequst('/v2/distributor/ownerList', 'GET', '').then(res => {
        this_.setData({
          distributorList: this_.data.distributorList.concat(res.list)
        })


        var disindex = this_.data.distributorList.findIndex(function (e) { return e.id == this_.data.userinfo.distributor3rd });
        if (disindex != -1) {
          this_.setData({
            distributorIndex: disindex
        });
        }
        
      })
    },

    // 保存用户输入的姓名
    setName: function (e) {
      this.setData({
        ['userinfo.name']: e.detail.value
      })
    },
    // 保存用户输入的电话
    setPhone: function (e) {
      this.setData({
        ['userinfo.mobile']: e.detail.value
      })
    },
    // 指派所属分销商
    changeDistributor: function (e) {
      this.setData({
        distributorIndex: e.detail.value
      })
    },

    //修改取派员工作方式
    changeWorktype: function (e) {
      this.setData({
        ['userinfo.workType']: e.currentTarget.dataset.param
      })
    },

    // 修改指派员级别
    changeLevel: function (e) {
      this.setData({
        ['userinfo.level']: e.currentTarget.dataset.param
      })
    },
    // 提交信息
    submitInfo: function () {
      var this_ = this;
      
      if (config.levelType.HIGH.value == this.data.userinfo.level || this.data.edittype == config.userEditType.MYSELF.value) {
        if (this.data.userinfo.name.trim() == '') {
          wx.showToast({
            title: '姓名不能为空',
            icon: 'none',
            duration: 2000
          });
          return false
        }
        // 手机号验证
        if (this.data.userinfo.mobile.trim() == '') {
          wx.showToast({
            title: '手机号不能为空',
            icon: 'none',
            duration: 2000
          });
          return false
        }
        // 手机号验证
        if (!util.checkPhone(this.data.userinfo.mobile)) {
          wx.showToast({
            title: '请填写正确的手机号',
            icon: 'none',
            duration: 2000
          });
          return false
        }

        // 分销商验证
        if (this.data.distributorList[this.data.distributorIndex].id == -1) {
          wx.showToast({
            title: '请选择分销商',
            icon: 'none',
            duration: 2000
          });
          return false
        }
      }

      let params = {
        distributor_3rd: this.data.distributorList[this.data.distributorIndex].id,
        id: this.data.userinfo.id,
        level: this.data.userinfo.level,
        mobile: this.data.userinfo.mobile,
        name: this.data.userinfo.name,
        work_type: this.data.userinfo.workType
      }
     
      request.HttpRequst('/v2/app-user/update', 'PUT', params).then(res => {
        if (res.code == 0) {
          if(config.userEditType.MYSELF.value == this_.data.edittype) {
            // 修改自己
            let accountInfo = wx.getStorageSync('accountInfo');
            accountInfo.appUser.name = this_.data.userinfo.name
            accountInfo.appUser.mobile = this_.data.userinfo.mobile,
            accountInfo.appUser.workType = this_.data.userinfo.workType,
            accountInfo.appUser.distributor3rd = this_.data.distributorList[this_.data.distributorIndex].id,
            accountInfo.appUser.thirdname = this_.data.distributorList[this_.data.distributorIndex].name,

            wx.setStorage({
              key: 'accountInfo',
              data: accountInfo
            })
  
            this_.sureEditSuccess();
          } else {
            // 修改其他级别
            var userinfo = this_.data.userinfo;
            userinfo.distributor3rd = this_.data.distributorList[this_.data.distributorIndex].id;
            userinfo.thirdname = this_.data.distributorList[this_.data.distributorIndex].name;
            var e = {
              "index": this_.properties.editlaterindex,
              "userinfo": this_.data.userinfo
            }
            this_.sureEditSuccess(e);
          }
          
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1500
          })

          
          this_.closeUserEditpanel();
        }
      })
    },

    // 刷新
    sureEditSuccess(e) {
      this.triggerEvent("sureEditSuccess", e)
    },

    // 关闭
    closeUserEditpanel() {
      this.triggerEvent("closeUserEditpanel")
    }
  },

  
  
})
