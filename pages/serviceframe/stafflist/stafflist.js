
const App = getApp();
// pages/orderDetail/orderDetail.js
const request = require('../../../request')
const config = require('../../../config')

Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    distributorId: {
      type: String,
      value: '',
    },
    // 改派 or 指派
    appoint_type: {
      type: String,
      value: '',
    }
  },

  data: {
    // 页面可用高度
    windowH: App.globalData.windowHeight,
    // 页面可用宽度
    windowW: App.globalData.windowWidth,

    // 员工列表
    stafflist:[],
    // 选中某个取派员的小标
    selectedstaff_index: -1,
    // 选中的某个取派员
    selected_staffinfo: {},
  },

  attached() {
    this.loadstafflist();
  },

  methods: {
    loadstafflist() {
      var this_ = this;
      request.HttpRequst('/v2/app-user/select', 'GET', { distributorId:  this.properties.distributorId}).then(function (res) {
        console.info(res.data);
        this_.setData({
          stafflist: res.data
        })
      })
  },


    closestafflistpanel() {
      this.triggerEvent("closestafflistpanel")
    },

    // 选中某个取派员
    selectedstaff(e) {
      var staffid = e.currentTarget.dataset.id;

      this.setData({
        selectedstaff_index: e.currentTarget.dataset.index,
      });
    },

    sure_changeallow_staff() {
      if (this.data.selectedstaff_index == -1) {
        wx.showToast({
          title: '请选择改派人员',
          icon: 'none',
          duration: 2000,
        });
        return false
      }

      this.triggerEvent("sure_changeallow_staff", this.data.stafflist[this.data.selectedstaff_index]);

      // 关闭
      this.closestafflistpanel();
    }
  }
})