const App = getApp();
// userEdit.js
const request = require('../../../request');
const util = require('../../../utils/util');

Component({
  
  data: {
    // 页面可用高度
    windowH: App.globalData.windowHeight,
    // 页面可用宽度
    windowW: App.globalData.windowWidth,
    // 分销商列表
    distributorList: [],
    // 分销商选取序号
    distributorIndex: 0,
    // 用户姓名
    userName: '',
    // 用户电话
    userPhone: '',
    // 用户级别-默认初级
    userLevel: '3',
    // 用户id
    userId: '',
    // 是否为修改本人信息
    editMyself: false,
    //工作方式
    userWorkType: 0
  },

  methods: {
    // 保存用户输入的姓名
    setName: function (e) {
      this.setData({
        userName: e.detail.value
      })
    },
    // 保存用户输入的电话
    setPhone: function (e) {
      this.setData({
        userPhone: e.detail.value
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
        userWorkType: e.currentTarget.dataset.param
      })
    },

    // 修改指派员级别
    changeLevel: function (e) {
      this.setData({
        userLevel: e.currentTarget.dataset.param
      })
    },
    // 提交信息
    submitInfo: function () {
      // 验证
      // 姓名不能为空
      if (this.data.userName.trim() == '') {
        wx.showModal({
          content: '姓名不能为空',
          confirmText: '确定',
          confirmColor: '#fbc400',
          showCancel: false,
        });
        return false
      }
      // 手机号验证
      if (this.data.userPhone.trim() == '') {
        wx.showModal({
          content: '手机号不能为空',
          confirmText: '确定',
          confirmColor: '#fbc400',
          showCancel: false,
        });
        return false
      }
      // 手机号验证
      if (!util.checkPhone(this.data.userPhone)) {
        wx.showModal({
          content: '请填写正确的手机号',
          confirmText: '确定',
          confirmColor: '#fbc400',
          showCancel: false,
        });
        return false
      }
      let params = {}
      // 分销商验证
      if (this.data.distributorList[this.data.distributorIndex].id == 'none') {
        wx.showModal({
          content: '请选择分销商',
          confirmText: '确定',
          confirmColor: '#fbc400',
          showCancel: false,
        });
        return false
      }
      // 修改本人信息时不存在级别
      if (this.data.editMyself) {
        params = {
          id: this.data.userId,
          mobile: this.data.userPhone,
          name: this.data.userName,
          distributor_3rd: this.data.distributorList[this.data.distributorIndex].id,
          work_type: this.data.userWorkType
        }
      } else {
        params = {
          distributor_3rd: this.data.distributorList[this.data.distributorIndex].id,
          id: this.data.userId,
          level: this.data.userLevel,
          mobile: this.data.userPhone,
          name: this.data.userName,
          work_type: this.data.userWorkType
        }
      }
      // console.log(params)
      wx.showLoading({
        title: '加载中...',
        mask: true
      });
      request.HttpRequst('/v2/app-user/update', 'PUT', params).then(res => {
        wx.hideLoading();
        // console.log(res)
        if (res.code == 0) {
          let tempInfo = wx.getStorageSync('accountInfo');
          tempInfo.appUser.mobile = this.data.userPhone
          tempInfo.appUser.name = this.data.userName
          tempInfo.appUser.workType = this.data.userWorkType
          tempInfo.appUser.thirdname = this.data.distributorList[this.data.distributorIndex].name
          if (this.data.editMyself) {
            wx.setStorage({
              key: 'accountInfo',
              data: tempInfo
            })
          }
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1500
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        }
      })
    },

    closeUserEditpanel() {
      this.triggerEvent("closeUserEditpanel")
    }
  },

  attached: function () {
    // 回显用户信息
    let userInfo = wx.getStorageSync('editUserInfo');
    if (userInfo.type) {
      let accountInfo = wx.getStorageSync('accountInfo').appUser;
      // 修改登录人信息-只能修改姓名+手机号+分销商
      this.setData({
        userName: accountInfo.name,
        userPhone: accountInfo.mobile,
        userId: accountInfo.id,
        userWorkType: accountInfo.workType,
        editMyself: true
      })
    } else {
      this.setData({
        userName: userInfo.name,
        userPhone: userInfo.phone,
        userLevel: userInfo.level ? userInfo.level : '3',
        userId: userInfo.id,
        userWorkType: userInfo.workType
      })
    }
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    // 获取分销商列表
    request.HttpRequst('/v2/distributor/ownerList', 'GET', '').then(res => {
      // console.log(res.list)
      wx.hideLoading();
      let tempList = [{ id: 'none', name: '待分配' }]
      this.setData({
        distributorList: tempList.concat(res.list)
      })
      // 回显分销商信息
      this.data.distributorList.forEach((item, index) => {
        if (item.name == userInfo.distributor) {
          this.setData({
            distributorIndex: index
          })
        }
      })
    })
  },
  
})
