const App = getApp();
// pages/orderDetail/orderDetail.js
const request = require('../../../request')
const config = require('../../../config')

Component ({
  data: {
    // 状态栏高度
    navH: App.globalData.navHeight,
    // 标题栏高度
    titlebarH: App.globalData.titlebarHeight,
    // 页面可用高度
    windowH: App.globalData.windowHeight,
    // 页面可用宽度
    windowW: App.globalData.windowWidth,

    // 搜索的用户名
    searchName: '',
    // 筛选条件
    userEnable: true,
    // 用户列表
    userList: [],
    // 筛选列表信息
    filterUserList: [],
    // 登录用户信息
    accountInfo: {},
    // 数据是否为空
    noData: false,
    // 滚动模块高度
    wrapperH: 0
  },

  attached() {
    

    this.init_user();
  },

  

  methods:{

    init_user() {
      wx.showLoading({
        title: '加载中...',
        mask: true
      });
      // 清空数据
      this.setData({
        userList: [],
        filterUserList: []
      })
      const getToken = setInterval(() => {
        if (request.header.token) {
          clearInterval(getToken)
          // 获取当前登录用户信息
          this.setData({
            accountInfo: wx.getStorageSync('accountInfo')
          })
          // 获取用户列表
          let params = {
            distributorId: this.data.accountInfo.appUser.distributor2nd
          }
          console.info(this.data.accountInfo.appUser.distributor2nd);
          request.HttpRequst('/v2/app-user/list', 'POST', params).then(res => {
            console.log(res)
            wx.hideLoading();
            let tempList = []
            res.data.forEach((item) => {
              let tempObj = {}
              tempObj.id = item.id
              tempObj.name = item.name
              tempObj.phone = item.mobile
              tempObj.distributor = item.distributor3rdName ? item.distributor3rdName : '待分配'
              // level: 1-高级，2-中级，3-初级
              tempObj.level = item.level
              tempObj.enable = item.isvalid == 'Y' ? true : false
              tempList.push(tempObj)
             
            })
            console.info('----------------');
            console.info(tempList);
            this.setData({
              userList: tempList,
              filterUserList: tempList
            })
          })
        }
      }, 500)
    },
    // 保存用户输入的姓名
    setUserName: function (e) {
      this.setData({
        searchName: e.detail.value
      })
      // console.log(e.detail.value)
    },
    // 按姓名搜索
    searchUser: function () {
      this.setData({
        noData: false
      })
      // 筛选用户信息
      // 如果输入内容为空则恢复列表内容
      if (this.data.searchName.trim() == '') {
        this.setData({
          filterUserList: this.data.userList
        })
      } else {
        let tempList = []
        this.data.userList.forEach((item) => {
          if (item.name.indexOf(this.data.searchName) != -1) {
            tempList.push(item)
          }
        })
        this.setData({
          filterUserList: tempList
        })
        if (tempList.length == 0) {
          this.setData({
            noData: true
          })
        }
        // 判断禁用数据
        if (this.data.userEnable) {
          let listLength = 0
          this.data.filterUserList.forEach((item) => {
            if (item.enable) {
              listLength++
            }
          })
          if (listLength <= 0) {
            this.setData({
              noData: true
            })
          }
        }
      }
    },
    // 筛选条件点击
    searchFilter: function () {
      this.setData({
        noData: false
      })
      this.setData({
        userEnable: !this.data.userEnable
      })
      // 判断禁用数据
      if (this.data.userEnable) {
        let listLength = 0
        this.data.filterUserList.forEach((item) => {
          if (item.enable) {
            listLength++
          }
        })
        if (listLength <= 0) {
          this.setData({
            noData: true
          })
        }
      }
    },
    // 切换用户状态
    enableUser: function (e) {
      console.log(e.currentTarget.dataset)
      let params = {
        "id": e.currentTarget.dataset.param.id,
        "isvalid": e.currentTarget.dataset.param.enable ? 'N' : "Y",
      }
      wx.showLoading({
        title: '加载中...',
        mask: true
      });
      request.HttpRequst('/v2/app-user/operate', 'PUT', params).then(res => {
        console.log(res)
        if (res.code == 500) {
          wx.hideLoading();
          wx.showModal({
            content: res.msg,
            confirmText: '确定',
            confirmColor: '#fbc400',
            showCancel: false
          })
        }
        this.onShow()
      })
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
          isshowuserEdit:true
        });
      }
    },

    // 关闭编辑面板
    closeUserEditpanel() {
      this.setData({
        isshowuserEdit:false
      });
    }
  },

  
  
})
